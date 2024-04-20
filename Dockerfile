# Use a imagem oficial do Node.js como base
FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Expõe a porta 3000 para que a aplicação Express seja acessível
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
