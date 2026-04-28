FROM node:22-slim

RUN apt-get update && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx playwright install chromium 2>/dev/null || true

COPY server.js .

EXPOSE 3002
CMD ["node", "server.js"]
