FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

COPY app.js ./
COPY src/ ./src/

# Run as non-root user
USER node

EXPOSE 8080

CMD ["npm", "start"]
