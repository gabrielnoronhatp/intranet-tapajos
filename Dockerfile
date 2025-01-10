# Use uma versão LTS do Node
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Limpe o cache do npm e instale as dependências
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Instale o next globalmente com versão específica
RUN npm install -g next@13.5.6

# Copie o resto dos arquivos
COPY . .

# Crie o diretório .next e ajuste as permissões
RUN mkdir -p .next
RUN chown -R node:node /app
RUN chmod -R 755 /app
RUN chmod -R 777 .next

# Mude para o usuário node
USER node

# Build do Next.js
RUN npm run build

# Exponha a porta 3000 (Next.js usa 3000 por padrão)
EXPOSE 3000 3001 

# Comando para rodar o Next.js em produção
CMD ["npm", "start"]