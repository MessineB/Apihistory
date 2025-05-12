FROM node:18

# Install dependencies required for Prisma (for native bindings)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le projet (y compris prisma/)
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Compiler le projet (si tu utilises TypeScript)
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
