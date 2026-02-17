# Planka MCP Server

[![npm version](https://img.shields.io/npm/v/@chmald/planka-mcp)](https://www.npmjs.com/package/@chmald/planka-mcp)
[![Docker Image Version](https://img.shields.io/docker/v/chmald/planka-mcp?sort=semver&label=Docker)](https://hub.docker.com/r/chmald/planka-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP server that enables AI assistants (Claude, VS Code Copilot, etc.) to interact with [Planka](https://planka.app/) - a real-time Kanban board application.

## Quick Start

### Prerequisites

- **Node.js 18+** or **Docker**
- **Planka instance** running and accessible
- **Planka user account** with appropriate permissions

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "planka": {
      "command": "npx",
      "args": ["@chmald/planka-mcp"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "planka": {
      "type": "stdio",
      "command": "npx",
      "args": ["@chmald/planka-mcp"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

### Docker

```json
{
  "mcpServers": {
    "planka": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "PLANKA_BASE_URL=http://host.docker.internal:3000",
        "-e", "PLANKA_USERNAME=your-username",
        "-e", "PLANKA_PASSWORD=your-password",
        "chmald/planka-mcp:latest"
      ]
    }
  }
}
```

> **Note:** Use `host.docker.internal` instead of `localhost` when running Docker.

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PLANKA_BASE_URL` | Yes | `http://localhost:3000` | Your Planka instance URL |
| `PLANKA_USERNAME` | Yes | - | Planka username or email |
| `PLANKA_PASSWORD` | Yes | - | Planka password |
| `ENABLE_ALL_TOOLS` | No | `false` | Enable all 27 tools |
| `ENABLE_ADMIN_TOOLS` | No | `false` | Enable admin tools |
| `ENABLE_OPTIONAL_TOOLS` | No | `false` | Enable optional tools |

### Tool Categories

By default, **9 core tools** are enabled for essential Kanban operations:

| Category | Tools | Description |
|----------|-------|-------------|
| **Core** | 9 | Projects, boards, lists, cards, tasks, comments, labels (always enabled) |
| **Optional** | 14 | Attachments, custom fields, notifications, etc. |
| **Admin** | 4 | User management, webhooks, config |

Enable more tools:
```json
"env": {
  "ENABLE_ALL_TOOLS": "true"
}
```

---

## Available Tools

Each tool uses an `action` parameter. Example: `{ "action": "list" }` or `{ "action": "get", "id": "123" }`

<details>
<summary><strong>Core Tools</strong> (always enabled)</summary>

| Tool | Actions |
|------|---------|
| `bootstrap` | `get` - Get app data, user info, projects |
| `projects` | `list`, `get`, `create`, `update`, `delete` |
| `boards` | `get`, `create`, `update`, `delete` |
| `lists` | `get`, `create`, `update`, `delete` |
| `cards` | `list`, `get`, `create`, `update`, `delete` |
| `comments` | `list`, `create` |
| `tasks` | `getList`, `createList`, `create`, `update` |
| `labels` | `create`, `update`, `delete`, `addToCard`, `removeFromCard` |
| `cardMembers` | `add`, `remove` |

</details>

<details>
<summary><strong>Admin Tools</strong> (ENABLE_ADMIN_TOOLS=true)</summary>

| Tool | Actions |
|------|---------|
| `config` | `get`, `update`, `testSmtp` |
| `users` | `list`, `create`, `update`, `delete`, `updateEmail`, `updatePassword`, etc. |
| `webhooks` | `list`, `create`, `update`, `delete` |
| `projectManagers` | `add`, `remove` |

</details>

<details>
<summary><strong>Optional Tools</strong> (ENABLE_OPTIONAL_TOOLS=true)</summary>

| Tool | Actions |
|------|---------|
| `attachments` | `create`, `update`, `delete` |
| `boardMembers` | `add`, `update`, `remove` |
| `customFields` | `createBaseGroup`, `createField`, `setValue`, etc. |
| `notifications` | `list`, `get`, `markRead`, `markAllRead`, `markCardRead`, `createUserService`, `createBoardService`, `updateService`, `deleteService`, `testService` |
| `actions` | `boardActions`, `cardActions` |
| `cardExtras` | `duplicate` |
| `commentExtras` | `update`, `delete` |
| `listExtras` | `clear`, `moveCards`, `sort` |
| `taskExtras` | `updateList`, `deleteList`, `deleteTask` |
| `labelExtras` | `update`, `delete`, `removeFromCard` |
| `cardMemberExtras` | `remove` |
| `backgroundImages` | `upload`, `delete` |
| `userInfo` | `get` |
| `auth` | `login`, `logout`, `acceptTerms`, etc. |

</details>

---

## Multi-Client Mode (SSE)

For team deployments where multiple clients share one server:

```bash
docker run -d \
  --name planka-mcp \
  -p 3001:3001 \
  -e MCP_TRANSPORT=sse \
  -e PLANKA_BASE_URL=http://your-planka-server:3000 \
  -e PLANKA_USERNAME=admin \
  -e PLANKA_PASSWORD=your-password \
  chmald/planka-mcp:latest
```

Connect clients to `http://localhost:3001/sse`.

---

## Troubleshooting

### "Authentication failed"
- Verify username/password are correct
- Check that `PLANKA_BASE_URL` is accessible

### "Connection refused" with Docker
- Use `host.docker.internal` instead of `localhost`
- Ensure Planka is running

### npx fails
- Ensure Node.js 18+ is installed: `node --version`
- Try: `npm cache clean --force`

### Debug logs
```bash
npx @chmald/planka-mcp 2>&1 | tee debug.log
```

---

## Links

- [GitHub Issues](https://github.com/chmald/planka-mcp/issues) - Report bugs
- [Planka](https://planka.app/) - The Kanban board application
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development & publishing guide
- [SECURITY.md](SECURITY.md) - Security policy

## License

MIT - see [LICENSE](LICENSE)
