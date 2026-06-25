FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

# Порт Next.js
EXPOSE 3000

CMD ["npm", "start"]