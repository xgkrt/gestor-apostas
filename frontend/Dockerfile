FROM node:22-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código-fonte
COPY . .

# Porta do Vite
EXPOSE 5173

# Comando de desenvolvimento com hot-reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
