# Start from the official Node.js LTS image on Alpine Linux (small and fast)
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first — this enables layer caching for npm install
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Document the port the app listens on
EXPOSE 3000

# The command to run when the container starts
CMD ["node", "app.js"]
