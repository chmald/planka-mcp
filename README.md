# Planka MCP Server

[![Docker Image Version](https://img.shields.io/docker/v/chmald/planka-mcp?sort=semver&label=Docker)](https://hub.docker.com/r/chmald/planka-mcp)
[![npm version](https://img.shields.io/npm/v/@chmald/planka-mcp)](https://www.npmjs.com/package/@chmald/planka-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP (Model Context Protocol) server that enables AI assistants to interact with [Planka](https://planka.app/) - a real-time collaborative Kanban board application.

## Features

- 🔌 **Two transport modes**: stdio (single-client) and SSE (multi-client)
- 🔐 **Automatic authentication** with token caching and refresh
- 🛠️ **27 grouped tools** covering 100 API operations for managing projects, boards, lists, cards, tasks, and more
- 🎛️ **Configurable tool categories**: Core (9 tools), Optional (14 tools), Admin (4 tools)
- 🏗️ **Stable API**: Tool definitions are hardcoded for stability (no external dependencies)
- 🐳 **Docker support** with multi-architecture images (amd64, arm64)
- 📦 **Semantic versioning** with tagged releases

## Prerequisites

- **Node.js 18+** (for npm/npx installation)
- **Docker** (for containerized deployment)
- **Planka instance** running and accessible
- **Planka user account** with appropriate permissions

## Quick Start

### Recommended: Single-Client Mode (stdio)

For individual use with Claude Desktop, VS Code, or other MCP clients:

**Linux/macOS:**
```bash
# Using npx (no installation required)
PLANKA_BASE_URL=http://localhost:3000 \
PLANKA_USERNAME=admin \
PLANKA_PASSWORD=your-password \
npx @chmald/planka-mcp
```

**Windows (PowerShell):**
```powershell
$env:PLANKA_BASE_URL="http://localhost:3000"
$env:PLANKA_USERNAME="admin"
$env:PLANKA_PASSWORD="your-password"
npx @chmald/planka-mcp
```

### Alternative: Multi-Client Mode (SSE)

For shared/team deployments where multiple clients connect to one server:

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

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Transport Modes](#transport-modes)
- [Installation Methods](#installation-methods)
- [Configuration](#configuration)
- [Client Setup](#client-setup)
- [Docker Deployment](#docker-deployment)
- [Available Tools](#available-tools)
- [Development](#development)
- [Publishing](#publishing)
- [Versioning](#versioning)
- [Troubleshooting](#troubleshooting)
- [Security](#security)

---

## Transport Modes

This MCP server supports two transport modes. Choose based on your use case:

| Mode | Transport | Best For | Docker Support |
|------|-----------|----------|----------------|
| **Single-Client** | `stdio` (default) | Individual users, personal setups | ✅ Interactive |
| **Multi-Client** | `sse` | Teams, shared deployments | ✅ Background service |

### Single-Client Mode (stdio) - Recommended

**Use this mode when:**
- You're the only person using the MCP server
- Running locally on your machine
- Direct integration with Claude Desktop or VS Code

The server communicates via stdin/stdout, making it ideal for direct process spawning by MCP clients.

### Multi-Client Mode (SSE)

**Use this mode when:**
- Multiple team members need access to the same MCP server
- Running as a centralized service
- Deploying behind a reverse proxy

The server exposes HTTP endpoints for Server-Sent Events (SSE) connections.

---

## Installation Methods

### Option 1: npx (Recommended for Quick Start)

No installation required - runs directly:

```bash
npx @chmald/planka-mcp
```

### Option 2: Global npm Install

Install once, run anywhere:

```bash
npm install -g @chmald/planka-mcp
planka-mcp
```

### Option 3: Docker Image

Pull from Docker Hub:

```bash
# Latest release
docker pull chmald/planka-mcp:latest

# Specific version
docker pull chmald/planka-mcp:1.0.0

# Major version (receives minor/patch updates)
docker pull chmald/planka-mcp:1
```

### Option 4: Build from Source

```bash
git clone https://github.com/chmald/planka-mcp.git
cd planka-mcp
npm install
npm run build
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PLANKA_BASE_URL` | Yes | `http://localhost:3000` | Base URL of your Planka instance |
| `PLANKA_USERNAME` | Yes | - | Your Planka username or email |
| `PLANKA_PASSWORD` | Yes | - | Your Planka password |
| `MCP_TRANSPORT` | No | `stdio` | Transport mode: `stdio` or `sse` |
| `MCP_PORT` | No | `3001` | HTTP port for SSE mode |
| `ENABLE_ALL_TOOLS` | No | `false` | Enable all 27 grouped tools (overrides other flags) |
| `ENABLE_ADMIN_TOOLS` | No | `false` | Enable admin tools (webhooks, user management, config) |
| `ENABLE_OPTIONAL_TOOLS` | No | `false` | Enable optional tools (attachments, custom fields, etc.) |

### Tool Categories

By default, only **core tools (9 grouped tools, 28 operations)** are enabled. Each grouped tool contains multiple related actions. You can enable additional categories:

| Category | Tools | Operations | Description | Environment Variable |
|----------|-------|------------|-------------|---------------------|
| **Core** | 9 | 28 | Essential Kanban operations (projects, boards, lists, cards, tasks, comments, labels) | Always enabled |
| **Optional** | 14 | 54 | Extended features (attachments, custom fields, notifications, board memberships, etc.) | `ENABLE_OPTIONAL_TOOLS=true` |
| **Admin** | 4 | 18 | Administrative functions (user management, webhooks, config) | `ENABLE_ADMIN_TOOLS=true` |

**Total: 27 grouped tools covering 100 API operations**

**Enable all tools:**
```bash
ENABLE_ALL_TOOLS=true npx @chmald/planka-mcp
```

**Enable core + admin tools:**
```bash
ENABLE_ADMIN_TOOLS=true npx @chmald/planka-mcp
```

**Enable everything except admin:**
```bash
ENABLE_OPTIONAL_TOOLS=true npx @chmald/planka-mcp
```

### Tool Reference

Each tool uses an `action` parameter to specify the operation. For example:
```json
{ "action": "list" }           // List all items
{ "action": "get", "id": "123" }  // Get specific item
{ "action": "create", "name": "New Item" }  // Create item
```

<details>
<summary><strong>Core Tools (9 grouped tools, 28 operations)</strong> - Always enabled</summary>

#### bootstrap
System initialization tool.

| Action | Description |
|--------|-------------|
| `get` | Retrieves application bootstrap data including current user info, projects, boards, and notifications |

#### projects
Manage Planka projects.

| Action | Description |
|--------|-------------|
| `list` | Retrieves all projects the current user has access to |
| `get` | Retrieves comprehensive project information including boards and memberships |
| `create` | Creates a new project (user becomes project manager) |
| `update` | Updates a project's settings |
| `delete` | Deletes a project and all associated data |

#### boards
Manage boards within projects.

| Action | Description |
|--------|-------------|
| `get` | Retrieves board with lists, cards, labels, and memberships |
| `create` | Creates a board within a project |
| `update` | Updates board settings and configuration |
| `delete` | Deletes a board and all associated data |

#### lists
Manage lists within boards.

| Action | Description |
|--------|-------------|
| `get` | Retrieves a list with its cards |
| `create` | Creates a new list on a board |
| `update` | Updates list name, position, or type |
| `delete` | Deletes a list (cards move to trash) |

#### cards
Manage cards within lists.

| Action | Description |
|--------|-------------|
| `search` | Searches for cards across all accessible boards |
| `get` | Retrieves card with task lists, attachments, and custom fields |
| `create` | Creates a new card in a list |
| `update` | Updates card properties (can move between lists) |
| `delete` | Deletes a card permanently |

#### comments
Manage comments on cards.

| Action | Description |
|--------|-------------|
| `list` | Retrieves comments for a card with pagination |
| `create` | Creates a comment on a card |

#### tasks
Manage task lists and tasks on cards.

| Action | Description |
|--------|-------------|
| `getTaskList` | Retrieves a task list with all its tasks |
| `createTaskList` | Creates a new task list on a card |
| `createTask` | Creates a new task in a task list |
| `updateTask` | Updates task (name, completion, assignee, position) |

#### labels
Manage labels on boards and cards.

| Action | Description |
|--------|-------------|
| `create` | Creates a new label on a board |
| `addToCard` | Adds a label to a card |

#### cardMembers
Manage card memberships.

| Action | Description |
|--------|-------------|
| `add` | Assigns a user to a card |

</details>

<details>
<summary><strong>Admin Tools (4 grouped tools, 18 operations)</strong> - Requires <code>ENABLE_ADMIN_TOOLS=true</code></summary>

#### config
Manage application configuration.

| Action | Description |
|--------|-------------|
| `get` | Retrieves application configuration (SMTP settings) |
| `update` | Updates application configuration |
| `testSmtp` | Sends a test email to verify SMTP configuration |

#### users
Manage user accounts.

| Action | Description |
|--------|-------------|
| `list` | Retrieves list of all users |
| `create` | Creates a new user account |
| `update` | Updates a user's profile |
| `delete` | Deletes a user account |
| `updateAvatar` | Updates a user's avatar image |
| `updateEmail` | Updates a user's email address |
| `updatePassword` | Updates a user's password |
| `updateUsername` | Updates a user's username |
| `createApiKey` | Generates an API key for a user |

#### webhooks
Manage webhooks for integrations.

| Action | Description |
|--------|-------------|
| `list` | Retrieves all configured webhooks |
| `create` | Creates a new webhook |
| `update` | Updates a webhook's configuration |
| `delete` | Deletes a webhook |

#### projectManagers
Manage project manager assignments.

| Action | Description |
|--------|-------------|
| `add` | Adds a user as project manager |
| `remove` | Removes a project manager |

</details>

<details>
<summary><strong>Optional Tools (14 grouped tools, 54 operations)</strong> - Requires <code>ENABLE_OPTIONAL_TOOLS=true</code></summary>

#### auth
Authentication operations (typically handled by the server).

| Action | Description |
|--------|-------------|
| `acceptTerms` | Accept terms during authentication flow |
| `login` | Authenticate with email/password |
| `logout` | Logout current user |
| `exchangeOidc` | Exchange OIDC code for access token |
| `revokePending` | Revoke pending authentication token |
| `getTerms` | Retrieve terms and conditions |

#### actions
Retrieve action history.

| Action | Description |
|--------|-------------|
| `getBoard` | Retrieves action history for a board |
| `getCard` | Retrieves action history for a card |

#### attachments
Manage file attachments on cards.

| Action | Description |
|--------|-------------|
| `create` | Creates an attachment on a card |
| `update` | Updates attachment properties |
| `delete` | Deletes an attachment |

#### boardMembers
Manage board memberships.

| Action | Description |
|--------|-------------|
| `add` | Adds a user to a board |
| `update` | Updates board membership role |
| `remove` | Removes a user from a board |

#### customFields
Manage custom field groups and fields.

| Action | Description |
|--------|-------------|
| `createBaseGroup` | Creates a base custom field group template |
| `updateBaseGroup` | Updates a base custom field group |
| `deleteBaseGroup` | Deletes a base custom field group |
| `createBoardGroup` | Creates a custom field group on a board |
| `createCardGroup` | Creates a custom field group on a card |
| `getGroup` | Retrieves a custom field group with fields |
| `updateGroup` | Updates a custom field group |
| `deleteGroup` | Deletes a custom field group |
| `createFieldInBase` | Creates a field in a base group |
| `createFieldInGroup` | Creates a field in a group |
| `updateField` | Updates a custom field |
| `deleteField` | Deletes a custom field |
| `setValue` | Sets a custom field value on a card |
| `deleteValue` | Clears a custom field value |

#### notifications
Manage user notifications.

| Action | Description |
|--------|-------------|
| `list` | Retrieves all unread notifications |
| `get` | Retrieves a specific notification |
| `markRead` | Marks a notification as read |
| `markAllRead` | Marks all notifications as read |
| `markCardRead` | Marks all notifications for a card as read |
| `createUserService` | Creates user notification service |
| `createBoardService` | Creates board notification service |
| `updateService` | Updates a notification service |
| `deleteService` | Deletes a notification service |
| `testService` | Tests a notification service |

#### backgroundImages
Manage project background images.

| Action | Description |
|--------|-------------|
| `upload` | Uploads a background image |
| `delete` | Deletes a background image |

#### cardExtras
Extended card operations.

| Action | Description |
|--------|-------------|
| `duplicate` | Duplicates a card with all content |

#### commentExtras
Extended comment operations.

| Action | Description |
|--------|-------------|
| `update` | Updates a comment |
| `delete` | Deletes a comment |

#### listExtras
Extended list operations.

| Action | Description |
|--------|-------------|
| `clear` | Moves all cards in a list to trash |
| `moveCards` | Moves all cards to another list |
| `sort` | Sorts cards in a list |

#### taskExtras
Extended task operations.

| Action | Description |
|--------|-------------|
| `updateTaskList` | Updates a task list |
| `deleteTaskList` | Deletes a task list |
| `deleteTask` | Deletes a task |

#### labelExtras
Extended label operations.

| Action | Description |
|--------|-------------|
| `update` | Updates a label |
| `delete` | Deletes a label |
| `removeFromCard` | Removes a label from a card |

#### cardMemberExtras
Extended card membership operations.

| Action | Description |
|--------|-------------|
| `remove` | Removes a user from a card |

#### userInfo
User information retrieval.

| Action | Description |
|--------|-------------|
| `get` | Retrieves a user's profile |

</details>

### Example .env File

```bash
PLANKA_BASE_URL=http://localhost:3000
PLANKA_USERNAME=admin
PLANKA_PASSWORD=your-secure-password
MCP_TRANSPORT=stdio

# Tool categories (all false by default - only core tools enabled)
# ENABLE_ALL_TOOLS=true
# ENABLE_ADMIN_TOOLS=true
# ENABLE_OPTIONAL_TOOLS=true
```

---

## Client Setup

### Claude Desktop

#### Single-Client Mode (stdio) - Recommended

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

**Using npx (core tools only - default):**
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

**Using npx with all tools enabled:**
```json
{
  "mcpServers": {
    "planka": {
      "command": "npx",
      "args": ["@chmald/planka-mcp"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password",
        "ENABLE_ALL_TOOLS": "true"
      }
    }
  }
}
```

**Using global install:**
```json
{
  "mcpServers": {
    "planka": {
      "command": "planka-mcp",
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

**Using local build:**
```json
{
  "mcpServers": {
    "planka": {
      "command": "node",
      "args": ["/path/to/planka-mcp/dist/server.js"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

**Using Docker (stdio):**
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

> **Note:** Use `host.docker.internal` to access services running on your host machine from within Docker.

#### Multi-Client Mode (SSE)

First start the SSE server (see [Docker Deployment](#docker-deployment)), then:

```json
{
  "mcpServers": {
    "planka": {
      "type": "sse",
      "url": "http://localhost:3001/sse"
    }
  }
}
```

### VS Code

#### Single-Client Mode (stdio) - Recommended

Add to your VS Code settings or `.vscode/mcp.json`:

**Using npx:**
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

**Using global install:**
```json
{
  "servers": {
    "planka": {
      "type": "stdio",
      "command": "planka-mcp",
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

**Using Docker (stdio):**
```json
{
  "servers": {
    "planka": {
      "type": "stdio",
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

**Using local build:**
```json
{
  "servers": {
    "planka": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/server.js"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

#### Multi-Client Mode (SSE)

```json
{
  "servers": {
    "planka": {
      "type": "sse",
      "url": "http://localhost:3001/sse"
    }
  }
}
```

---

## Docker Deployment

### Image Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `latest` | Latest stable release from master branch | `chmald/planka-mcp:latest` |
| `X.Y.Z` | Specific version (e.g., `1.0.0`) | `chmald/planka-mcp:1.0.0` |
| `X.Y` | Minor version (receives patch updates) | `chmald/planka-mcp:1.0` |
| `X` | Major version (receives minor/patch updates) | `chmald/planka-mcp:1` |
| `sha-XXXXXXX` | Specific commit build | `chmald/planka-mcp:sha-abc1234` |

### Single-Client Mode with Docker

For stdio mode, run the container interactively:

```bash
docker run -it --rm \
  -e PLANKA_BASE_URL=http://host.docker.internal:3000 \
  -e PLANKA_USERNAME=admin \
  -e PLANKA_PASSWORD=your-password \
  chmald/planka-mcp:latest
```

### Multi-Client Mode with Docker

```bash
docker run -d \
  --name planka-mcp \
  -p 3001:3001 \
  -e MCP_TRANSPORT=sse \
  -e PLANKA_BASE_URL=http://your-planka-server:3000 \
  -e PLANKA_USERNAME=admin \
  -e PLANKA_PASSWORD=your-password \
  --restart unless-stopped \
  chmald/planka-mcp:latest
```

### Docker Compose

Create a `.env` file:

```bash
PLANKA_BASE_URL=http://your-planka-server:3000
PLANKA_USERNAME=admin
PLANKA_PASSWORD=your-password
```

**Single-client mode:**
```bash
docker compose run --rm planka-mcp
```

**Multi-client mode:**
```bash
docker compose up planka-mcp-sse -d
```

### SSE Endpoints

When running in SSE mode:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sse` | GET | Establish SSE connection (returns session ID) |
| `/messages?sessionId=<id>` | POST | Send messages to the server |
| `/health` | GET | Health check with active client count |

**Health check example:**
```bash
curl http://localhost:3001/health
# {"status":"ok","activeClients":2,"toolsAvailable":80}
```

---

## Available Tools

The server automatically generates tools from the Planka OpenAPI specification (80+ tools). Key operations include:

### Projects
- `getprojects` - Get all accessible projects
- `createproject` - Create a new project
- `getproject` - Get project details
- `updateproject` - Update a project
- `deleteproject` - Delete a project

### Boards
- `createboard` - Create a board within a project
- `getboard` - Get board details with lists and cards
- `updateboard` - Update a board
- `deleteboard` - Delete a board

### Lists
- `createlist` - Create a list within a board
- `getlist` - Get list details
- `updatelist` - Update a list
- `deletelist` - Delete a list
- `sortlist` - Sort cards in a list

### Cards
- `createcard` - Create a card within a list
- `getcard` - Get card details
- `updatecard` - Update a card
- `deletecard` - Delete a card
- `duplicatecard` - Duplicate a card

### Tasks
- `createtasklist` - Create a task list on a card
- `createtask` - Create a task within a task list
- `updatetask` - Update a task
- `deletetask` - Delete a task

### Comments
- `createcomment` - Add a comment to a card
- `getcomments` - Get comments on a card
- `updatecomments` - Update a comment
- `deletecomment` - Delete a comment

### Labels
- `createlabel` - Create a label on a board
- `createcardlabel` - Add a label to a card
- `deletecardlabel` - Remove a label from a card

### Users & Authentication
- `getusers` - Get all users (admin only)
- `createuser` - Create a user (admin only)
- `getconfig` - Get application configuration

---

## Development

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode (stdio)
npm run dev

# Run in development mode (SSE)
npm run dev:sse

# Build for production
npm run build

# Run the built server
npm start        # stdio mode
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

---

## Publishing

### Publishing to npm (enables npx)

To make the package available via `npx @chmald/planka-mcp`, you need to publish it to npm:

```bash
# 1. Ensure you're logged in to npm
npm login

# 2. Verify package.json has correct metadata
#    - name: "@chmald/planka-mcp"
#    - version: matches your release
#    - bin: points to dist/server.js

# 3. Build the project
npm run build

# 4. Publish to npm (public scoped package)
npm publish --access public
```

**Note:** Scoped packages (`@chmald/planka-mcp`) require `--access public` for public visibility.

**Automated Publishing (Optional):**

Add a GitHub Actions workflow for npm publishing. Create `.github/workflows/npm-publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Required Secret:** Add `NPM_TOKEN` to your repository secrets (Settings → Secrets → Actions).

Generate an npm token at: npmjs.com → Account → Access Tokens → Generate New Token (Automation)

### Publishing Docker Images

Docker images are automatically published via GitHub Actions when you push tags. See [Versioning](#versioning) below.

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **Major version** (`1.x.x`): Breaking changes
- **Minor version** (`x.1.x`): New features, backward compatible
- **Patch version** (`x.x.1`): Bug fixes, backward compatible

### Creating a Release

1. Update version in `package.json`
2. Commit changes: `git commit -m "Release v1.0.0"`
3. Create and push tag: `git tag v1.0.0 && git push origin v1.0.0`
4. GitHub Actions will automatically:
   - Build and test the code
   - Build multi-arch Docker images
   - Push to Docker Hub with appropriate tags
   - Generate SBOM (Software Bill of Materials)

### Docker Tag Strategy

When you push `v1.2.3`, the following Docker tags are created:
- `chmald/planka-mcp:1.2.3`
- `chmald/planka-mcp:1.2`
- `chmald/planka-mcp:1`
- `chmald/planka-mcp:latest`
- `chmald/planka-mcp:sha-abc1234`

---

## Troubleshooting

### Common Issues

#### "Authentication failed" error

- Verify `PLANKA_USERNAME` and `PLANKA_PASSWORD` are correct
- Ensure the Planka user account exists and is active
- Check that `PLANKA_BASE_URL` is accessible from where the MCP server runs

#### "Connection refused" when using Docker

- Use `host.docker.internal` instead of `localhost` for `PLANKA_BASE_URL`
- Ensure the Planka service is running and accessible
- Check Docker network settings if using custom networks

#### npx command not found or fails

- Ensure Node.js 18+ is installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Use full package name: `npx @chmald/planka-mcp`

#### Docker image not found

- Pull the latest image: `docker pull chmald/planka-mcp:latest`
- Check Docker Hub for available tags: https://hub.docker.com/r/chmald/planka-mcp/tags

#### MCP client doesn't connect (stdio mode)

- Verify the command path is correct in your client configuration
- Check that environment variables are properly set
- Look for error messages in the MCP client logs

#### SSE connection drops

- Check for proxy/load balancer timeout settings (increase to 120+ seconds)
- Verify the `/health` endpoint is responding
- Check server logs for heartbeat failures

### Debug Mode

To see detailed logs, check stderr output:

```bash
# stdio mode - errors go to stderr
npx @chmald/planka-mcp 2>&1 | tee debug.log

# SSE mode - logs appear in container output
docker logs -f planka-mcp
```

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/chmald/planka-mcp/issues)
- **Discussions:** [GitHub Discussions](https://github.com/chmald/planka-mcp/discussions)

---

## Security

### Best Practices

- **Never hardcode credentials** - Always use environment variables
- **Use specific version tags** - Avoid `latest` in production
- **Restrict network access** - SSE mode should be behind a firewall/VPN for team use
- **Rotate credentials** - Regularly update Planka passwords

### Security Features

- Credentials are passed via environment variables, never hardcoded
- Docker image runs as non-root user (`mcpuser`)
- Token caching with automatic refresh on 401 errors
- SBOM generated for each release for supply chain security
- Multi-stage Docker build minimizes attack surface

For security concerns, please see [SECURITY.md](SECURITY.md).

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Planka](https://planka.app/) - The open-source Kanban board this MCP server integrates with
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - SDK used to build this server
