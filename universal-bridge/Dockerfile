# Build stage for Vite static assets
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production runtime stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Only copy over package.json to install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built frontend client
COPY --from=builder /usr/src/app/dist ./dist

# Copy backend api code
COPY api/ ./api/

# Expose port (Cloud Run sets standard PORT=8080)
EXPOSE 8080

CMD ["node", "api/index.js"]
