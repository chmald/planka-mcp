# Contributing to Planka MCP Server

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/planka-mcp.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

```bash
# Run in development mode (stdio)
npm run dev

# Run in development mode (SSE)
npm run dev:sse

# Build for production
npm run build

# Run built version
npm start          # stdio mode
npm run start:sse  # SSE mode
```

### Building Docker Image Locally

```bash
# Build with default settings
docker build -t planka-mcp:local .

# Build with version metadata
docker build \
  --build-arg VERSION=1.0.0 \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  -t planka-mcp:1.0.0 .
```

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic

## Pull Request Process

1. Ensure your code builds without errors
2. Update the README.md if needed
3. Ensure no credentials or sensitive data are included
4. Submit a pull request with a clear description

## Reporting Issues

When reporting issues, please include:
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior

---

## Publishing

### Publishing to npm

```bash
# Login to npm
npm login

# Build and publish
npm run build
npm publish --access public
```

### Creating a Release

1. Update version in `package.json`
2. Commit: `git commit -m "Release v1.0.0"`
3. Tag and push: `git tag v1.0.0 && git push origin v1.0.0`

GitHub Actions will automatically:
- Build multi-arch Docker images
- Push to Docker Hub with appropriate tags
- Generate SBOM

### Docker Tags

When you push `v1.2.3`:
- `chmald/planka-mcp:1.2.3`
- `chmald/planka-mcp:1.2`
- `chmald/planka-mcp:1`
- `chmald/planka-mcp:latest`

---

## Security

**Never commit credentials or sensitive information.**

If you discover a security vulnerability, please report it privately. See [SECURITY.md](SECURITY.md) for details.
