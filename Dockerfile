FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/
COPY swagger.json ./

# Environment variables (can be overridden at runtime)
ENV MCP_TRANSPORT=sse
ENV MCP_PORT=3001
ENV PLANKA_BASE_URL=http://localhost:3000

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${MCP_PORT}/health || exit 1

CMD ["node", "dist/server.js"]
