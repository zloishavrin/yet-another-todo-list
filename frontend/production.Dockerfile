# Сборка
FROM node:alpine AS builder

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Запуск NGINX
FROM nginx:alpine

COPY --from=builder /frontend/dist /usr/share/nginx/html

COPY nginx_production/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
