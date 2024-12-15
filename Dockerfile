# Etapa 1: Construir a aplicação Angular
FROM node:16-alpine AS build

WORKDIR /app

# Copie os arquivos de dependência e instale
COPY package.json package-lock.json ./
RUN npm install

# Copie o código-fonte e faça o build
COPY . .
RUN npm run build --prod

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Remova a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie os arquivos construídos do Angular para o diretório do Nginx
COPY --from=build /app/dist/projeto-login-simples /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Inicie o Nginx
CMD ["nginx", "-g", "daemon off;"]
