#!/usr/bin/env node
import { loadMethods } from '../src/schema-loader.js';

process.env.VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN || 'test_token';
process.env.VK_MCP_MODE = 'all';

await loadMethods();
console.log('[VK MCP] Schema downloaded and cached successfully');
