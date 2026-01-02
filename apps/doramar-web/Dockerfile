# 1. Etapa de limpeza
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune --scope=doramar-web --docker

# 2. Etapa de Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=pruner /app/out/full/ .
COPY tsconfig.base.json* ./ 

ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL

# Build apenas do frontend
RUN npx turbo run build --filter=doramar-web

# 3. Etapa Final (Nginx)
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Verifica se sua pasta chama 'front' ou 'frontend'
COPY --from=builder /app/apps/doramar-web/dist .

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]