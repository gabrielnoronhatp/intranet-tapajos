# Use uma versão LTS do Node
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o resto dos arquivos
COPY . .

# Build do Next.js
RUN npm run build

# Exponha a porta 3000 (Next.js usa 3000 por padrão)
EXPOSE 3000

# Comando para rodar o Next.js em produção
CMD ["npm", "start"]
