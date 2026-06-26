FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Порт Next.js
EXPOSE 3000

CMD ["npm", "start"]