# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder
WORKDIR /app

# Манифесты зависимостей — кэшируется, пока package*.json не меняются
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Конфиги сборки — кэшируется, пока tsconfig/next.config не меняются
COPY tsconfig.json next.config.ts next-env.d.ts postcss.config.mjs eslint.config.mjs ./

# Исходники
COPY . .

# Сборка с кэшем Next.js (турбо по умолчанию в Next.js 15)
RUN npm run build

# --- runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]