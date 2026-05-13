# VK MCP Server

Model Context Protocol (MCP) server for [VKontakte](https://vk.com) (VK) — the largest social network in Russia and CIS countries.

This server allows AI assistants (Claude, Cursor, Windsurf, VS Code, etc.) to interact with VK through a standardized MCP interface.

## Features

- **180+ VK API tools auto-generated from the official schema** (full set available with `VK_MCP_MODE=all`; safe defaults expose a smaller subset) — users, wall, groups, friends, photos, videos, messages, market, stats, stories, polls, and more
- **Auto-generated from VK API schema** — always up-to-date with the official API
- **Read/Write/Money mode filtering** — restrict AI to read-only, allow non-financial writes, or enable financially sensitive methods
- **Section filtering** — include or exclude specific API sections (e.g., disable `ads`, `secure`)
- **`.env` support** — load token from environment file for local development
- **VK upload API helpers** — exposes upload-server and save methods for media workflows
- **ESM-based** — modern Node.js module system
- **Multiple transports** — stdio (for Claude Desktop / Cursor), Streamable HTTP and SSE (for remote MCP clients like Grok)

## Prerequisites

- Node.js ≥ 18
- VK Access Token with required permissions

## Installation

```bash
# Clone the repository
git clone https://github.com/ssm82/full-vk-mcp.git
cd full-vk-mcp

# Install dependencies
npm install
```

The VK API schema is downloaded **automatically** on the first run. No manual steps needed.

## Configuration

### 1. VK Access Token

Create a `.env` file in the project root:

```bash
VK_ACCESS_TOKEN=your_vk_token_here
```

Or get a token from:
- [vkhost.github.io](https://vkhost.github.io/) — quick token generator
- [VK Dev](https://dev.vk.com/) — official developer portal

**Required permissions depend on your use case:**
- `wall` — posting and reading wall
- `photos` — uploading photos
- `groups` — community management
- `friends`, `messages`, `market`, `stats` — as needed

> **Security:** Never commit your token to git. The `.env` file is already in `.gitignore`.

### 2. Choose a Profile (Recommended)

Instead of manually configuring sections and methods, use a built-in profile via `VK_MCP_PROFILE`:

```bash
VK_MCP_PROFILE=minimal node src/index.js
```

| Profile | Mode | Description | Warning |
|---------|------|-------------|---------|
| `minimal` | read | Essential read methods | Safe |
| `social` | read | Users, friends + extras | Safe |
| `content_read` | read | ~25 content viewing methods | Safe |
| `content_publish` | all | ~20 content creation methods | Can publish |
| `community_manager` | all | Wall, board, groups management | Can modify communities |
| `messenger` | all | Messages + user info | Requires `messages` scope |
| `analytics` | read | Stats, wall, groups insights | Safe |
| `ads` | money | Ads API + helper methods | **Can spend money** |
| `market` | money | VK Market + upload helpers | Can modify shop |
| `commerce` | money | Market, orders, store, gifts, donut | Financially sensitive |
| `search` | read | ~10 search methods | Safe |
| `full_read` | read | All read methods except ads/secure | Safe |
| `full` | all | **All VK API methods** | **Development only** |

Profiles can be extended with environment variables:

```bash
VK_MCP_PROFILE=social VK_MCP_INCLUDE_SECTIONS=wall node src/index.js
```

> **Env extends profile:** list variables (sections, methods, excludes) are merged with the profile; scalar `mode` is overridden by env.

### 3. MCP Client Setup

#### VS Code (with Copilot / Claude / etc.)

Create `.vscode/mcp.json`:

```json
{
  "servers": {
    "vk": {
      "type": "stdio",
      "command": "node",
      "args": ["src/index.js"],
      "env": {
        "VK_ACCESS_TOKEN": "${input:vk-token}",
        "VK_MCP_PROFILE": "minimal"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "vk-token",
      "description": "VK Access Token",
      "password": true
    }
  ]
}
```

#### Cursor

Create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "vk": {
      "command": "node",
      "args": ["src/index.js"],
      "env": {
        "VK_ACCESS_TOKEN": "your_token",
        "VK_MCP_PROFILE": "social"
      }
    }
  }
}
```

#### Claude Desktop

Edit `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "vk": {
      "command": "node",
      "args": ["/absolute/path/to/full-vk-mcp/src/index.js"],
      "env": {
        "VK_ACCESS_TOKEN": "your_token",
        "VK_MCP_PROFILE": "minimal"
      }
    }
  }
}
```

#### Windsurf / Other MCP Clients

Use the stdio transport and provide `VK_ACCESS_TOKEN` via environment variables.

### 4. Transport Mode

By default, the server uses **stdio** transport for local MCP clients. To enable remote connections, switch to HTTP:

| `VK_MCP_TRANSPORT` | Use case |
|--------------------|----------|
| `stdio` (default)  | Claude Desktop, Cursor, VS Code, Windsurf |
| `http`             | Grok, ChatGPT, remote MCP clients |
| `sse`              | Same as `http` (both endpoints enabled) |

```bash
# HTTP mode for remote clients
VK_ACCESS_TOKEN=your_token VK_MCP_TRANSPORT=http node src/index.js
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VK_ACCESS_TOKEN` | *(required)* | Your VK API access token |
| `VK_MCP_PROFILE` | — | Built-in profile name (`minimal`, `social`, `full`, etc.) |
| `VK_MCP_MODE` | `read` | `read` — read-only, `write` — non-financial writes, `money` — financially sensitive, `all` — everything |
| `VK_MCP_INCLUDE_SECTIONS` | — | Comma-separated whitelist of API sections. Without a profile, safe subset (`users`, `groups`, `wall`, `friends`, `photos`) is used |
| `VK_MCP_EXCLUDE_SECTIONS` | `ads,secure,market,orders,store,gifts,donut,votes` *(without profile / without explicit includes)* | Comma-separated blacklist of API sections. Skipped when `VK_MCP_INCLUDE_SECTIONS` or `VK_MCP_INCLUDE_METHODS` is set |
| `VK_MCP_INCLUDE_METHODS` | — | Comma-separated whitelist of methods (e.g., `users.get,wall.get`) |
| `VK_MCP_EXCLUDE_METHODS` | — | Comma-separated blacklist of methods |
| `VK_MCP_MAX_TOOLS` | — | Limit the number of exposed tools |
| `VK_MCP_TRANSPORT` | `stdio` | Transport type: `stdio`, `http`, or `sse` |
| `VK_MCP_PORT` | `3000` | HTTP port (falls back to `$PORT` for PaaS like Render) |
| `VK_MCP_HOST` | `127.0.0.1` | Bind address. Use `0.0.0.0` for public hosts |
| `VK_MCP_AUTH_TOKEN` | — | Bearer token for HTTP transport auth (required when binding to non-loopback) |

### Mode Filtering

The server automatically classifies each VK API method into risk levels:

| Mode | Description | Sections |
|------|-------------|----------|
| `read` | Read-only methods | Safe subset: `users`, `groups`, `wall`, `friends`, `photos` |
| `write` | Read + non-financial writes | Can modify your account (post, edit, delete, send, etc.) |
| `money` | Financially sensitive only | `ads`, `market`, `orders`, `store`, `gifts`, `donut`, `votes`, selected `secure.*` |
| `all` | Everything | Read + write + money — no restrictions |

- **Read** methods — `get*`, `search*`, `is*`, `are*`, `check*`, `resolve*`, `find*`, `count*`, `lookup*`, `list*`
- **Write** methods — everything else (post, edit, delete, send, etc.)
- **Money** methods — any method in financial sections or explicitly tagged (`secure.getAppBalance`, etc.)

Use `VK_MCP_MODE=read` to prevent the AI from making any changes to your VK account.
Use `VK_MCP_MODE=money` when you need ads, market, or payment-related tools.

## Running Locally

```bash
# With .env file (recommended for development)
node src/index.js

# Or inline
VK_ACCESS_TOKEN=your_token node src/index.js

# Use a profile
VK_ACCESS_TOKEN=your_token VK_MCP_PROFILE=minimal node src/index.js

# Read-only mode
VK_ACCESS_TOKEN=your_token VK_MCP_MODE=read node src/index.js

# Include only specific sections
VK_ACCESS_TOKEN=your_token VK_MCP_INCLUDE_SECTIONS=users,wall node src/index.js
```

### HTTP Mode

```bash
# Start HTTP server (localhost only, no auth)
VK_ACCESS_TOKEN=your_token VK_MCP_TRANSPORT=http node src/index.js

# With custom port
VK_MCP_TRANSPORT=http VK_MCP_PORT=8080 node src/index.js

# Public deploy (auth required)
VK_MCP_TRANSPORT=http VK_MCP_HOST=0.0.0.0 VK_MCP_AUTH_TOKEN=your_secret node src/index.js
```

### Test HTTP endpoint

```bash
# Health check
curl http://127.0.0.1:3000/health

# Initialize MCP session (returns Mcp-Session-Id header)
curl -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'

# List tools (use Mcp-Session-Id from the previous response)
curl -X POST http://127.0.0.1:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Mcp-Session-Id: <session_id_from_above>" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

For full protocol testing use the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI select **Streamable HTTP** and enter `http://127.0.0.1:3000/mcp`.

## Available Tools (by Category)

| Category | Examples | Count |
|----------|----------|-------|
| **Wall** | `vk_wall_get`, `vk_wall_post`, `vk_wall_edit`, `vk_wall_delete`, `vk_wall_search` | 10+ |
| **Users** | `vk_users_get`, `vk_users_search`, `vk_users_get_followers` | 5+ |
| **Groups** | `vk_groups_get`, `vk_groups_get_members`, `vk_groups_search`, `vk_groups_join` | 20+ |
| **Photos** | `vk_photos_get`, `vk_photos_get_upload_server`, `vk_photos_save` | 15+ |
| **Videos** | `vk_video_get`, `vk_video_search`, `vk_video_save` | 10+ |
| **Messages** | `vk_messages_get_history`, `vk_messages_get_conversations`, `vk_messages_send` | 20+ |
| **Friends** | `vk_friends_get`, `vk_friends_get_online`, `vk_friends_add` | 10+ |
| **Market** | `vk_market_get`, `vk_market_search`, `vk_market_get_orders` | 10+ |
| **Stories** | `vk_stories_get`, `vk_stories_get_upload_server` | 5+ |
| **Polls** | `vk_polls_create`, `vk_polls_get_by_id`, `vk_polls_add_vote` | 5+ |
| **Stats** | `vk_stats_get`, `vk_stats_get_post_reach` | 2+ |
| **Ads** | `vk_ads_get_campaigns`, `vk_ads_get_ads`, `vk_ads_get_statistics` | 15+ |
| **+ 60 more sections** | docs, notes, board, fave, notifications, pages, storage, etc. | — |

> **Total:** 180+ tools auto-generated from the official VK API schema.

## Examples

### Get your wall posts

```
Tool: vk_wall_get
Arguments: { "count": 5 }
```

### Search for users

```
Tool: vk_users_search
Arguments: { "q": "Ivan Ivanov", "count": 10 }
```

### Get community members

```
Tool: vk_groups_get_members
Arguments: { "group_id": "apiclub", "count": 100 }
```

### Create a poll

```
Tool: vk_polls_create
Arguments: {
  "question": "What's your favorite color?",
  "add_answers": "[\"Red\", \"Green\", \"Blue\"]"
}
```

## Deployment

For Render, Railway, Fly.io, or similar PaaS:

```bash
# build command
npm install

# start command
node src/index.js

# environment variables
VK_ACCESS_TOKEN=...
VK_MCP_TRANSPORT=http
VK_MCP_HOST=0.0.0.0
VK_MCP_PORT=3000        # or omit to use $PORT (Render auto-sets it)
VK_MCP_AUTH_TOKEN=...   # required for public access
VK_MCP_MODE=read        # or your chosen profile/mode
```

> **Render note:** Render provides the port via the `$PORT` environment variable. The server automatically falls back to it when `VK_MCP_PORT` is not set.

## Development

```bash
# Run tests (schema downloads automatically on first run)
npm test

# Start the server
node src/index.js
```

## Project Structure

```
full-vk-mcp/
├── src/
│   ├── index.js           # Entry point (transport switching)
│   ├── server-factory.js  # MCP server factory
│   ├── http-transport.js  # HTTP/SSE transport
│   ├── schema-loader.js   # Loads and filters VK API schema
│   ├── tool-registry.js   # Builds MCP tools from schema
│   ├── param-converter.js # Converts VK params to JSON Schema
│   ├── profiles.js        # Built-in profiles
│   └── vk-client.js       # VK API HTTP client
├── vk-api-schema/         # Official VK API schema (JSON) — see note below
├── tests.test.js          # Test suite
├── .env                   # Your token (gitignored)
├── package.json
└── README.md
```

## VK API Schema

The VK API schema is **not included** in this repository to keep it lightweight. On the first run (server or tests), it is downloaded **automatically** from the official VK repository:

```
https://github.com/VKCOM/vk-api-schema
```

The schema is saved to `vk-api-schema/` in the project root and cached for subsequent runs.

### Updating the Schema

To get the latest VK API changes, delete the cached folder and restart:

```bash
rm -rf vk-api-schema/
node src/index.js  # schema will be re-downloaded automatically
```

## Security

- **Token storage:** Use `.env` or your MCP client's secure environment variables. Never commit tokens.
- **Least privilege:** Use `VK_MCP_MODE=read` if the AI only needs to read data.
- **Section filtering:** Exclude sensitive sections like `ads`, `secure` if not needed.
- **HTTP mode security:** By default, HTTP binds to `127.0.0.1` only. If you bind to `0.0.0.0` (public), `VK_MCP_AUTH_TOKEN` is **required** — the server will refuse to start without it. Always use HTTPS in production.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `VK_ACCESS_TOKEN is required` | Create `.env` file or set the environment variable |
| `Unknown tool` | Check that the method name uses snake_case (`vk_wall_get` not `vk.wall.get`) |
| `Access denied` | Your token lacks the required VK permission scope |
| Too many tools | Use `VK_MCP_INCLUDE_SECTIONS` or `VK_MCP_MODE=read` to filter |
| HTTP `Not Acceptable` | Add header `Accept: application/json, text/event-stream` |
| HTTP `VK_MCP_AUTH_TOKEN is required` | Set auth token when binding to `0.0.0.0` |

## License

MIT

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

**Made for the [Model Context Protocol](https://modelcontextprotocol.io/) ecosystem**
