# Сборка
FROM node:alpine as builder

WORKDIR /usr/src/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Запуск
FROM node:alpine

WORKDIR /usr/src/backend

COPY --from=builder /usr/src/backend/dist ./dist
COPY --from=builder /usr/src/backend/node_modules ./node_modules
COPY --from=builder /usr/src/backend/package.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]