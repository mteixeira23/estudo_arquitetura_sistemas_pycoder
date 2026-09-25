# Estágio 1: Builder (Node.js para gerar a build de produção)
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar os manifests primeiro para otimizar o Cache de Camada do Docker
COPY package.json package-lock.json ./
RUN npm ci

# Copiar o resto do código-fonte (O .dockerignore vai barrar a pasta node_modules local)
COPY . .

# Executar a compilação de produção com Vite (Gera a pasta /app/dist)
RUN npm run build

# Estágio 2: Runner (Nginx Leve para Servir Arquivos Estáticos)
FROM nginx:alpine

# Copiar a nossa configuração focada em SPA (redireciona rotas virtuais para o index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar o "dist" gerado pelo estágio anterior para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Apenas documentativo, pois Nginx já escuta na 80 nativamente
EXPOSE 80

# Iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
