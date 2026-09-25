import axios from 'axios';

// Helper para resolução dinâmica da URL da API (Suporta runtime config do Nginx em produção)
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.__ENV__?.VITE_API_URL) {
    return window.__ENV__.VITE_API_URL;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

// Instância base do Axios apontando para o nosso novo Backend Django
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  // OBRIGATÓRIO para a segurança no Traefik/Swarm e para tráfego de cookies HttpOnly
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de Requisição: Injeta o Access Token em todas as chamadas HTTP
api.interceptors.request.use(
  (config) => {
    // Nota: Seguindo o Arquiteto (Defense in Depth), futuramente vamos migrar esse 
    // acesso para um estado em memória. Por enquanto lemos do Storage.
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Variáveis de controle para concorrência de Refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de Resposta: Renovação Automática do Token (Silent Refresh) com Fila
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se a API retornar 401 (Não Autorizado) e ainda não tentamos renovar...
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está atualizando, coloca a requisição atual na fila (Promise)
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Tentamos bater na rota de refresh silenciosamente
        const res = await axios.post(
          `${getApiBaseUrl()}/auth/token/refresh/`, 
          {}, 
          { withCredentials: true }
        );
        
        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);
        
        // Atualiza a fila e a requisição original
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Sessão expirada. Refaça o login.');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
