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

COPY --from=pruner /app/out/full/ .

  COPY tsconfig.base.json* ./ 


RUN cd apps/doramar-api && npx prisma generate
RUN npx turbo run build --filter=doramar-api

FROM node:20-alpine AS runner
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

ENV NODE_ENV=production 

RUN npm install -g pm2

COPY --from=builder /app/apps/doramar-api/package.json .
COPY --from=builder /app/apps/doramar-api/dist ./dist
COPY --from=builder /app/apps/doramar-api/prisma ./prisma

COPY --from=builder /app/node_modules ./node_modules 

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]