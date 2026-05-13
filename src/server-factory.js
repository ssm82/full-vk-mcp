import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { loadMethods } from './schema-loader.js';
import { buildTools, buildHandler } from './tool-registry.js';
import { VKClient } from './vk-client.js';

export async function createMcpServer() {
  const methods = await loadMethods();
  const tools = buildTools(methods);

  const bySection = methods.reduce((acc, m) => {
    acc[m.section] = (acc[m.section] || 0) + 1;
    return acc;
  }, {});

  console.error(
    `[VK MCP] Loaded ${methods.length} tools ` +
    `(mode=${process.env.VK_MCP_MODE || 'read'}, ` +
    `profile=${process.env.VK_MCP_PROFILE || 'none'})`
  );
  console.error(
    `[VK MCP] Sections: ${Object.entries(bySection).map(([k, v]) => `${k}=${v}`).join(', ')}`
  );

  if (methods.length === 0) {
    console.error('[VK MCP] WARNING: No tools registered. Check VK_MCP_MODE / VK_MCP_PROFILE / VK_MCP_INCLUDE_* settings.');
  }

  const vk = new VKClient(process.env.VK_ACCESS_TOKEN);
  const handler = buildHandler(methods, vk);

  const server = new Server(
    { name: 'vk-mcp-server', version: '0.3.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => handler(req.params));

  return server;
}
