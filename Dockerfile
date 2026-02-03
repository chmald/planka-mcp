# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Add labels for versioning and metadata
ARG VERSION=dev
ARG BUILD_DATE
ARG VCS_REF

LABEL org.opencontainers.image.title="Planka MCP Server" \
      org.opencontainers.image.description="MCP server for Planka - Real-Time Collaborative Kanban Board" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.source="https://github.com/chmald/planka-mcp" \
      org.opencontainers.image.url="https://github.com/chmald/planka-mcp" \
      org.opencontainers.image.documentation="https://github.com/chmald/planka-mcp#readme" \
      org.opencontainers.image.vendor="chmald" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist/ ./dist/

# Create non-root user for security
RUN addgroup -g 1001 -S mcpuser && \
    adduser -u 1001 -S mcpuser -G mcpuser && \
    chown -R mcpuser:mcpuser /app

USER mcpuser

# Environment variables (can be overridden at runtime)
# Default to stdio for single-client use (recommended for individual hosting)
ENV MCP_TRANSPORT=stdio
ENV MCP_PORT=3001
ENV PLANKA_BASE_URL=http://localhost:3000
ENV NODE_ENV=production

# Expose port (only used in SSE mode)
EXPOSE 3001

# Health check (only effective in SSE mode)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD if [ "$MCP_TRANSPORT" = "sse" ]; then wget --no-verbose --tries=1 --spider http://localhost:${MCP_PORT}/health || exit 1; else exit 0; fi

CMD ["node", "dist/server.js"]
