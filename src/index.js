#!/usr/bin/env node
import 'dotenv/config';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './server-factory.js';
import { startHttpServer } from './http-transport.js';
import { PROFILES, getProfileNames } from './profiles.js';

function validateEnv() {
  if (!process.env.VK_ACCESS_TOKEN) {
    console.error('[VK MCP] ERROR: VK_ACCESS_TOKEN is required');
    process.exit(1);
  }

  const profile = process.env.VK_MCP_PROFILE;
  if (profile && !PROFILES[profile]) {
    console.error(
      `[VK MCP] ERROR: Unknown profile "${profile}". ` +
      `Available: ${getProfileNames().join(', ')}`
    );
    process.exit(1);
  }

  const mode = process.env.VK_MCP_MODE;
  if (mode && !['read', 'write', 'money', 'all'].includes(mode)) {
    console.error(`[VK MCP] ERROR: Invalid VK_MCP_MODE="${mode}". Use: read, write, money, all`);
    process.exit(1);
  }

  if (mode === 'money' || mode === 'all') {
    console.error(`[VK MCP] WARNING: Running in "${mode}" mode. Financial/destructive operations are enabled.`);
  }
}

async function runStdio() {
  const server = await createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[VK MCP] Listening on stdio');
}

async function runHttp() {
  await startHttpServer();
}

async function main() {
  validateEnv();

  const transport = (process.env.VK_MCP_TRANSPORT || 'stdio').toLowerCase();

  switch (transport) {
    case 'stdio':
      await runStdio();
      break;
    case 'http':
    case 'sse':
      await runHttp();
      break;
    default:
      console.error(`[VK MCP] ERROR: Unknown VK_MCP_TRANSPORT="${transport}". Use: stdio, http, sse`);
      process.exit(1);
  }
}

process.on('SIGINT', () => {
  console.error('[VK MCP] Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('[VK MCP] Shutting down...');
  process.exit(0);
});

main().catch((error) => {
  console.error('[VK MCP] Fatal error:', error.message);
  process.exit(1);
});
