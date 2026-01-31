# Planka MCP Server

An MCP (Model Context Protocol) server that enables AI assistants to interact with [Planka](https://planka.app/) - a real-time collaborative Kanban board application.

> **Note:** This server uses the official [Planka OpenAPI specification](https://plankanban.github.io/planka/swagger-ui/) (`swagger.json`) to automatically generate all API endpoints and tools.

## Features

- Full API coverage from the Planka OpenAPI specification
- Automatic authentication using username/password
- Token caching with automatic refresh on 401 errors
- 80+ tools for managing projects, boards, lists, cards, tasks, and more
- **Multi-client support** via SSE (Server-Sent Events) transport

## Installation

### From Source

```bash
git clone https://github.com/chmald/planka-mcp.git
cd planka-mcp
npm install
npm run build
```

### Via npm (Global)

```bash
npm install -g planka-mcp
```

### Via npx (No Install)

```bash
npx planka-mcp
```

### Via Docker

```bash
docker pull chmald/planka-mcp
# or build locally
docker build -t planka-mcp .
```

## Configuration

Set the following environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PLANKA_BASE_URL` | Yes | `http://localhost:3000` | Base URL of your Planka instance |
| `PLANKA_USERNAME` | Yes | - | Your Planka username or email |
| `PLANKA_PASSWORD` | Yes | - | Your Planka password |
| `MCP_TRANSPORT` | No | `stdio` | Transport mode: `stdio` (single client) or `sse` (multiple clients) |
| `MCP_PORT` | No | `3001` | HTTP port for SSE mode |

## Single Client Mode (stdio)

For single-client use with Claude Desktop or VS Code.

### Usage with Claude Desktop

Add the following to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "planka": {
      "command": "node",
      "args": ["C:/path/to/planka-mcp/dist/server.js"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

### Usage with VS Code

Add to your VS Code settings or `.vscode/mcp.json`:

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

## Multi-Client Mode (SSE)

For scenarios where multiple clients need to connect to the same MCP server simultaneously.

### Starting the Server

```bash
# Start in SSE mode on default port 3001
MCP_TRANSPORT=sse PLANKA_BASE_URL=http://localhost:3000 PLANKA_USERNAME=admin PLANKA_PASSWORD=admin npm start

# Or with a custom port
MCP_TRANSPORT=sse MCP_PORT=8080 PLANKA_BASE_URL=http://localhost:3000 PLANKA_USERNAME=admin PLANKA_PASSWORD=admin npm start
```

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sse` | GET | Establish SSE connection (returns session ID) |
| `/messages?sessionId=<id>` | POST | Send messages to the server |
| `/health` | GET | Health check with active client count |

### Connecting MCP Clients

Clients that support SSE transport can connect using:
- **SSE URL**: `http://localhost:3001/sse`
- **Messages URL**: `http://localhost:3001/messages`

Example VS Code configuration for SSE:

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

## Deployment Options

### Docker (Recommended for Production)

The easiest way to deploy for multiple clients.

#### Using Docker Compose

Create a `.env` file with your credentials:

```bash
PLANKA_BASE_URL=http://your-planka-server:3000
PLANKA_USERNAME=admin
PLANKA_PASSWORD=your-password
```

Then run:

```bash
docker compose up -d
```

#### Using Docker Directly

```bash
docker build -t planka-mcp .

docker run -d \
  --name planka-mcp \
  -p 3001:3001 \
  -e MCP_TRANSPORT=sse \
  -e PLANKA_BASE_URL=http://your-planka-server:3000 \
  -e PLANKA_USERNAME=admin \
  -e PLANKA_PASSWORD=your-password \
  --restart unless-stopped \
  planka-mcp
```

#### Health Check

```bash
curl http://localhost:3001/health
# Returns: {"status":"ok","activeClients":2,"toolsAvailable":80}
```

### npm Global Package

Install once, use anywhere:

```bash
# Install globally
npm install -g planka-mcp

# Run in stdio mode (single client)
PLANKA_BASE_URL=http://localhost:3000 PLANKA_USERNAME=admin PLANKA_PASSWORD=admin planka-mcp

# Run in SSE mode (multiple clients)
MCP_TRANSPORT=sse PLANKA_BASE_URL=http://localhost:3000 PLANKA_USERNAME=admin PLANKA_PASSWORD=admin planka-mcp
```

### npx (Zero Install)

Run directly without installing:

```bash
npx @your-org/planka-mcp
```

## Client Configuration Examples

### For Docker/SSE Deployment

Claude Desktop (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "planka": {
      "type": "sse",
      "url": "http://your-server:3001/sse"
    }
  }
}
```

VS Code (`.vscode/mcp.json`):
```json
{
  "servers": {
    "planka": {
      "type": "sse",
      "url": "http://your-server:3001/sse"
    }
  }
}
```

### For npm Global Install

Claude Desktop:
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

### For npx

Claude Desktop:
```json
{
  "mcpServers": {
    "planka": {
      "command": "npx",
      "args": ["planka-mcp"],
      "env": {
        "PLANKA_BASE_URL": "http://localhost:3000",
        "PLANKA_USERNAME": "your-username",
        "PLANKA_PASSWORD": "your-password"
      }
    }
  }
}
```

## Available Tools

The server automatically generates tools from the Planka OpenAPI specification. Key operations include:

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

## Development

```bash
# Run in development mode (stdio)
npm run dev

# Run in development mode (SSE)
npm run dev:sse

# Build for production
npm run build

# Run the built server (stdio)
npm start

# Run the built server (SSE)
npm run start:sse
```

## Publishing

To publish as an npm package:

```bash
npm login
npm publish --access public
```

To publish as a Docker image:

```bash
docker build -t chmald/planka-mcp:latest .
docker push chmald/planka-mcp:latest
```

## License

MIT
