/**
 * Hook especializado para consumo de endpoints de IA com Streaming (Fase 4)
 * 
 * Engenheiro de IA: O Axios com interceptors NÃO suporta streams nativamente.
 * Para o efeito "máquina de escrever" do LangGraph/Ollama, usamos o fetch nativo
 * com ReadableStream. Este módulo é separado do api.js propositalmente.
 */
import { getApiBaseUrl } from './api';

/**
 * Envia um prompt para o endpoint de IA e processa tokens em stream.
 * @param {string} endpoint - Ex: '/chat/stream/'
 * @param {object} payload  - Ex: { mensagem: 'Resuma o prontuário', prontuario_id: 'xxx' }
 * @param {function} onChunk - Callback chamado a cada token recebido: (token) => void
 */
export async function streamAI(endpoint, payload, onChunk) {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    method: 'POST',
    credentials: 'include', // Garante envio dos cookies HttpOnly
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erro ao conectar à IA: ${response.status}`);
  }

  // Lemos o ReadableStream token a token
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}
