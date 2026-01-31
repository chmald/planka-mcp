# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to [chmald@microsoft.com](mailto:chmald@microsoft.com). All security vulnerabilities will be promptly addressed.

Please do **not** report security vulnerabilities through public GitHub issues.

### What to include in your report

- Type of issue (e.g., credential exposure, injection, etc.)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

## Security Best Practices

When using this MCP server:

1. **Never commit credentials**: Always use environment variables or `.env` files (which are gitignored)
2. **Use strong passwords**: Use unique, strong passwords for your Planka account
3. **Limit permissions**: Use a Planka account with minimal necessary permissions
4. **Secure your deployment**: When running in SSE mode, consider using HTTPS via a reverse proxy
5. **Rotate credentials**: Regularly rotate your Planka credentials
