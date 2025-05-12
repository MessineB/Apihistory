# frontend/Dockerfile
FROM node:18

WORKDIR /app

# Supprimer les caches esbuild potentiellement foireux
COPY package*.json ./

RUN rm -rf node_modules package-lock.json \
  && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
