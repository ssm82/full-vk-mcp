#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadMethods, resolveConfig } from './schema-loader.js';
import { buildTools, buildHandler } from './tool-registry.js';
import { VKClient } from './vk-client.js';

function printConfigExample() {
  const example = `
Example mcp.json configuration:

VS Code (.vscode/mcp.json):
{
  "servers": {
    "vk": {
      "type": "stdio",
      "command": "node",
      "args": ["src/index.js"],
      "env": {
        "VK_ACCESS_TOKEN": "\${input:vk-token}",
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

Cursor (.cursor/mcp.json):
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

Claude Desktop (claude_desktop_config.json):
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
`;
  console.error(example);
}

// CLI commands (no token required)
if (process.argv.includes('--list-profiles')) {
  const { PROFILES, getProfileNames } = await import('./profiles.js');
  console.log('Available VK MCP profiles:\n');
  for (const name of getProfileNames()) {
    const p = PROFILES[name];
    const parts = [`mode=${p.mode || 'read'}`];
    if (p.sections?.length) parts.push(`sections=${p.sections.length}`);
    if (p.methods?.length) parts.push(`methods=${p.methods.length}`);
    if (p.excludeMethods?.length) parts.push(`excludes=${p.excludeMethods.length} methods`);
    if (p.excludeSections?.length) parts.push(`excludes=${p.excludeSections.length} sections`);
    console.log(`  ${name.padEnd(18)} ${parts.join(', ')}`);
  }
  console.log('\nUse with VK_MCP_PROFILE=<name\u003e');
  process.exit(0);
}

if (process.argv.includes('--list-tools')) {
  try {
    const methods = await loadMethods();
    const tools = buildTools(methods);
    console.log(`Available tools (${methods.length} total):\n`);
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      const method = methods[i];
      console.log(`${tool.name.padEnd(40)} ${method.access.padEnd(6)} ${method.section}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(`[VK MCP] Error: ${err.message}`);
    process.exit(1);
  }
}

// Resolve config early for profile validation and warnings
let config;
try {
  config = resolveConfig();
} catch (err) {
  console.error(`[VK MCP] Error: ${err.message}`);
  process.exit(1);
}

if (config.mode === 'money' || config.profileName === 'money') {
  console.error('[VK MCP] WARNING: money mode is enabled. Tools may access ads, market, orders or other financial VK API methods.');
}

if (config.mode === 'all' || config.profileName === 'full') {
  console.error('[VK MCP] WARNING: all mode is enabled. This includes money-related and destructive VK API methods.');
}

if (!process.env.VK_ACCESS_TOKEN) {
  console.error('Error: VK_ACCESS_TOKEN environment variable is required.');
  printConfigExample();
  process.exit(1);
}

try {
  const methods = await loadMethods();
  const tools = buildTools(methods);

  const bySection = methods.reduce((acc, m) => {
    acc[m.section] = (acc[m.section] || 0) + 1;
    return acc;
  }, {});
  console.error(`[VK MCP] Loaded ${methods.length} VK API methods.`);
  console.error(`[VK MCP] Sections: ${Object.entries(bySection).map(([k, v]) => `${k}=${v}`).join(', ')}`);

  const vk = new VKClient(process.env.VK_ACCESS_TOKEN);
  const handler = buildHandler(methods, vk);

  const server = new Server(
    { name: 'vk-mcp-server', version: '0.3.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => handler(req.params));

  process.on('SIGINT', async () => {
    console.error('[VK MCP] Shutting down...');
    await server.close();
    process.exit(0);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (err) {
  console.error('[VK MCP] Fatal startup error:', err);
  process.exit(1);
}
