FROM node:18-alpine as build

WORKDIR /

# Criar e configurar usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app

# Mudar para o usuário não-root
USER appuser

# Copiar package.json e package-lock.json
COPY --chown=appuser:appgroup package*.json ./

# Instalar dependências com flags específicas
RUN npm install --legacy-peer-deps --no-optional

# Copiar o resto dos arquivos
COPY --chown=appuser:appgroup . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]