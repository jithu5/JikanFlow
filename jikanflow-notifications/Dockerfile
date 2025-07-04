# Stage 1: Build the TypeScript code
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file first (for better layer caching)
COPY package*.json ./

# Install only dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the built app
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the built files and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port (change this if your app runs on a different port)
EXPOSE 4002

# Start the app
CMD ["node", "dist/server.js"]
