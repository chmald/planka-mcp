# Contributing to Planka MCP Server

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/planka-mcp.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

```bash
# Run in development mode
npm run dev

# Run in SSE mode for testing multi-client
npm run dev:sse

# Build
npm run build

# Run built version
npm start
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

## Security

**Never commit credentials or sensitive information.**

If you discover a security vulnerability, please report it privately. See [SECURITY.md](SECURITY.md) for details.
