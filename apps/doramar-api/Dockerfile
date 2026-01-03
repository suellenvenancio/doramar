FROM node:20-alpine AS pruner

RUN npm install -g turbo

WORKDIR /app

COPY . .

RUN turbo prune --scope=doramar-api --docker

# 2. Etapa de Build
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# 1. Copia as definições de pacotes
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm install

# 2. Copia o código fonte (Aqui o Turbo traz os arquivos da API)
COPY --from=pruner /app/out/full/ .
 
COPY tsconfig.base.json* ./ 
# ==========================================

RUN npx prisma generate --schema=apps/doramar-api/prisma/schema.prisma
RUN npx turbo run build --filter=doramar-api
RUN npm prune --production

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/doramar-api/package.json .
COPY --from=builder /app/apps/doramar-api/dist ./dist
COPY --from=builder /app/apps/doramar-api/prisma ./prisma

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/server.js"]
