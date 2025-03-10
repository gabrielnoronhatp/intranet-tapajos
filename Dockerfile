# Etapa 1: Build
FROM node:18 AS builder

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY package.json package-lock.json ./
RUN npm install
RUN npm i sharp

COPY . .

# Build da aplicação Next.js
RUN npm run build

# Etapa 2: Produção
FROM node:18

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários da etapa de build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Definir a porta do contêiner
EXPOSE 3000

# Comando para iniciar o servidor Next.js
CMD ["npm", "start"]
