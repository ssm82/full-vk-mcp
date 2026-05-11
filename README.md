# VK MCP Server

Model Context Protocol (MCP) server for [VKontakte](https://vk.com) (VK) — the largest social network in Russia and CIS countries.

This server allows AI assistants (Claude, Cursor, Windsurf, etc.) to interact with VK through a standardized MCP interface.

## Features

- Full access to VK API methods (users, wall, groups, friends, photos, videos, messages, market, stats, etc.)
- Photo upload support (wall photos)
- Clean parameter handling and boolean normalization
- ~180+ available tools
- Works via stdio (standard for MCP)

## Installation

### Prerequisites

- Node.js ≥ 18
- VK Access Token with required permissions

### Quick Start

```bash
# Clone or download the server
git clone https://github.com/ssm82/full-vk-mcp.git
cd vk-mcp-server

# Install dependencies
npm install

# Run the server
VK_ACCESS_TOKEN=your_token_here node index.js
```

## Getting a VK Access Token

1. Go to [VK Developer Tools](https://vk.com/dev)
2. Create a new application or use an existing one
3. Get an access token with the necessary scopes:
   - `wall` — for posting and reading wall
   - `photos` — for uploading photos
   - `groups` — for community management
   - `friends`, `messages`, etc. (depending on your needs)

**Warning:** The token gives the AI full access according to its permissions. Use tokens with minimal required rights.

## Configuration in MCP Clients

### Claude Desktop

Add to your Claude config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "vk": {
      "command": "node",
      "args": ["/path/to/vk-mcp-server/index.js"],
      "env": {
        "VK_ACCESS_TOKEN": "your_vk_token_here"
      }
    }
  }
}
```

### Other MCP Clients

Use the stdio transport with environment variable `VK_ACCESS_TOKEN`.

## Available Tools (Examples)

| Category       | Tools                                      | Description                     |
|----------------|--------------------------------------------|---------------------------------|
| Wall           | `vk_wall_get`, `vk_wall_post`, `vk_wall_edit`, `vk_wall_delete` | Work with posts |
| Users          | `vk_users_get`, `vk_users_search`          | User information                |
| Groups         | `vk_groups_get`, `vk_groups_get_members`   | Communities and members         |
| Photos         | `vk_photos_get`, `vk_photos_upload_wall`   | Photos + upload                 |
| Messages       | `vk_messages_get_history`, `vk_messages_get_conversations` | Messaging (read)     |
| Market         | `vk_market_get_items`, `vk_market_search`, `vk_market_get_orders` | VK Market     |
| Stats          | `vk_stats_get`, `vk_stats_get_post_reach`  | Statistics (admin)              |
| Friends        | `vk_friends_get`, `vk_friends_get_online`  | Friends                         |
| + 170 more tools | —                                        | Full list in the code           |

## Development

```bash
# Run tests
npm test

# The server uses ESM
node index.js
```

## Security Notes

- Never commit your `VK_ACCESS_TOKEN` to git
- Use tokens with the minimum required permissions
- The server runs locally via stdio — it does not expose any network ports

## License

MIT

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

**Made for the Model Context Protocol ecosystem**
