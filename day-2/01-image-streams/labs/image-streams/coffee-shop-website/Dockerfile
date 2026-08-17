FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

COPY app.js ./
COPY src/ ./src/

# Run as non-root user
USER node

EXPOSE 8080

CMD ["npm", "start"]
