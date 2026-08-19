# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests first for optimal layer caching
COPY package*.json ./

# Install production dependencies only and clear npm cache to keep image lean
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code (server & public assets)
COPY server/ ./server/
COPY public/ ./public/

# Change file ownership to non-root node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server/server.js"]
