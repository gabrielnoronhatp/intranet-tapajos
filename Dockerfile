# Use a imagem base do Node.js
FROM node:17

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências com permissões adequadas
RUN npm install --unsafe-perm=true

# Copie o restante do código da aplicação
COPY . .

# Corrija permissões para os arquivos
RUN  chmod -R 755 /app 


# Construa a aplicação para produção
# Construa a aplicação para produção
RUN npm run build

# Instale um servidor para servir os arquivos estáticos
RUN npm install -g serve

# Comando para iniciar o servidor
CMD ["serve", "-s", "build"]

# Exponha a porta 80 para o tráfego HTTP
EXPOSE 80
