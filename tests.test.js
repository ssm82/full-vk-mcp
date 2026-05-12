/**
 * VK MCP Server Tests
 *
 * Unit tests for the new dynamic VK MCP server architecture
 */

process.env.VK_ACCESS_TOKEN = 'test_token';

import { describe, it, expect, jest, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { loadMethods, classifyMethod, resolveConfig } from './src/schema-loader.js';
import { convertParam, buildInputSchema } from './src/param-converter.js';
import { VKClient } from './src/vk-client.js';
import { buildTools, buildHandler } from './src/tool-registry.js';

global.fetch = jest.fn();

describe('classifyMethod', () => {
  it('classifies get methods as read', () => {
    expect(classifyMethod('users.get')).toBe('read');
    expect(classifyMethod('wall.get')).toBe('read');
    expect(classifyMethod('photos.getAll')).toBe('read');
  });

  it('classifies search methods as read', () => {
    expect(classifyMethod('wall.search')).toBe('read');
    expect(classifyMethod('users.search')).toBe('read');
  });

  it('classifies is/are methods as read', () => {
    expect(classifyMethod('users.isAppUser')).toBe('read');
    expect(classifyMethod('friends.areFriends')).toBe('read');
  });

  it('classifies check/resolve methods as read', () => {
    expect(classifyMethod('utils.checkLink')).toBe('read');
    expect(classifyMethod('utils.resolveScreenName')).toBe('read');
  });

  it('classifies write methods correctly', () => {
    expect(classifyMethod('wall.post')).toBe('write');
    expect(classifyMethod('wall.edit')).toBe('write');
    expect(classifyMethod('wall.delete')).toBe('write');
    expect(classifyMethod('messages.send')).toBe('write');
    expect(classifyMethod('likes.add')).toBe('write');
  });

  it('classifies execute as write', () => {
    expect(classifyMethod('execute')).toBe('write');
  });

  it('classifies streaming.getServerUrl as read', () => {
    expect(classifyMethod('streaming.getServerUrl')).toBe('read');
  });

  it('classifies money section methods as money', () => {
    expect(classifyMethod('ads.getAccounts')).toBe('money');
    expect(classifyMethod('votes.get')).toBe('money');
  });

  it('classifies read overrides in money sections as read', () => {
    expect(classifyMethod('market.get')).toBe('read');
    expect(classifyMethod('market.search')).toBe('read');
    expect(classifyMethod('orders.get')).toBe('read');
    expect(classifyMethod('orders.getById')).toBe('read');
  });

  it('classifies secure money methods as money', () => {
    expect(classifyMethod('secure.getAppBalance')).toBe('money');
    expect(classifyMethod('secure.getTransactionsHistory')).toBe('money');
    expect(classifyMethod('secure.withdrawVotes')).toBe('money');
  });
});

describe('loadMethods', () => {
  it('loads methods from all schema sections', async () => {
    const methods = await loadMethods();
    expect(methods.length).toBeGreaterThan(0);
    expect(methods.some(m => m.section === 'users')).toBe(true);
    expect(methods.some(m => m.section === 'wall')).toBe(true);
  });

  it('adds section and mode metadata', async () => {
    const methods = await loadMethods();
    const usersGet = methods.find(m => m.name === 'users.get');
    expect(usersGet).toBeDefined();
    expect(usersGet.section).toBe('users');
    expect(usersGet.access).toBe('read');
  });

  it('filters by VK_MCP_INCLUDE_SECTIONS', async () => {
    const original = process.env.VK_MCP_INCLUDE_SECTIONS;
    process.env.VK_MCP_INCLUDE_SECTIONS = 'users';
    const methods = await loadMethods();
    expect(methods.every(m => m.section === 'users')).toBe(true);
    if (original === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = original;
  });

  it('filters by VK_MCP_EXCLUDE_SECTIONS', async () => {
    const original = process.env.VK_MCP_EXCLUDE_SECTIONS;
    process.env.VK_MCP_EXCLUDE_SECTIONS = 'wall';
    const methods = await loadMethods();
    expect(methods.some(m => m.section === 'wall')).toBe(false);
    if (original === undefined) delete process.env.VK_MCP_EXCLUDE_SECTIONS;
    else process.env.VK_MCP_EXCLUDE_SECTIONS = original;
  });

  it('filters by VK_MCP_MODE=read', async () => {
    const original = process.env.VK_MCP_MODE;
    process.env.VK_MCP_MODE = 'read';
    const methods = await loadMethods();
    expect(methods.every(m => m.access === 'read')).toBe(true);
    expect(methods.some(m => m.name === 'wall.post')).toBe(false);
    if (original === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = original;
  });

  it('filters by VK_MCP_MODE=write', async () => {
    const original = process.env.VK_MCP_MODE;
    process.env.VK_MCP_MODE = 'write';
    const methods = await loadMethods();
    expect(methods.some(m => m.access === 'write')).toBe(true);
    expect(methods.some(m => m.name === 'users.get')).toBe(true);
    expect(methods.some(m => m.access === 'money')).toBe(false);
    if (original === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = original;
  });

  it('filters by VK_MCP_INCLUDE_METHODS', async () => {
    const originalInclude = process.env.VK_MCP_INCLUDE_METHODS;
    const originalSections = process.env.VK_MCP_INCLUDE_SECTIONS;
    process.env.VK_MCP_INCLUDE_METHODS = 'users.get,wall.get';
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    const methods = await loadMethods();
    expect(methods.length).toBe(2);
    expect(methods.map(m => m.name)).toContain('users.get');
    expect(methods.map(m => m.name)).toContain('wall.get');
    if (originalInclude === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalInclude;
    if (originalSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalSections;
  });

  it('allows explicit include methods to bypass default excludes', async () => {
    const originalInclude = process.env.VK_MCP_INCLUDE_METHODS;
    const originalSections = process.env.VK_MCP_INCLUDE_SECTIONS;
    const originalProfile = process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    process.env.VK_MCP_INCLUDE_METHODS = 'secure.checkToken';
    const methods = await loadMethods();
    expect(methods.map(m => m.name)).toContain('secure.checkToken');
    if (originalInclude === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalInclude;
    if (originalSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalSections;
    if (originalProfile === undefined) delete process.env.VK_MCP_PROFILE;
    else process.env.VK_MCP_PROFILE = originalProfile;
  });

  it('filters by VK_MCP_EXCLUDE_METHODS', async () => {
    const original = process.env.VK_MCP_EXCLUDE_METHODS;
    process.env.VK_MCP_EXCLUDE_METHODS = 'users.get,wall.get';
    const methods = await loadMethods();
    expect(methods.some(m => m.name === 'users.get')).toBe(false);
    expect(methods.some(m => m.name === 'wall.get')).toBe(false);
    if (original === undefined) delete process.env.VK_MCP_EXCLUDE_METHODS;
    else process.env.VK_MCP_EXCLUDE_METHODS = original;
  });

  it('limits tools by VK_MCP_MAX_TOOLS', async () => {
    const original = process.env.VK_MCP_MAX_TOOLS;
    process.env.VK_MCP_MAX_TOOLS = '5';
    const methods = await loadMethods();
    expect(methods.length).toBeLessThanOrEqual(5);
    if (original === undefined) delete process.env.VK_MCP_MAX_TOOLS;
    else process.env.VK_MCP_MAX_TOOLS = original;
  });

  it('uses safe defaults when no explicit filters', async () => {
    const originalIncludeSections = process.env.VK_MCP_INCLUDE_SECTIONS;
    const originalIncludeMethods = process.env.VK_MCP_INCLUDE_METHODS;
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    delete process.env.VK_MCP_INCLUDE_METHODS;
    const methods = await loadMethods();
    expect(methods.every(m => ['users', 'groups', 'wall', 'friends', 'photos'].includes(m.section))).toBe(true);
    if (originalIncludeSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalIncludeSections;
    if (originalIncludeMethods === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalIncludeMethods;
  });

  it('loads ads profile with read helpers', async () => {
    const originalProfile = process.env.VK_MCP_PROFILE;
    const originalMode = process.env.VK_MCP_MODE;
    const originalIncludeSections = process.env.VK_MCP_INCLUDE_SECTIONS;
    const originalIncludeMethods = process.env.VK_MCP_INCLUDE_METHODS;
    process.env.VK_MCP_PROFILE = 'ads';
    delete process.env.VK_MCP_MODE;
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    delete process.env.VK_MCP_INCLUDE_METHODS;
    const methods = await loadMethods();
    const names = methods.map(m => m.name);
    expect(names).toContain('users.get');
    expect(names).toContain('groups.get');
    expect(names).toContain('ads.getAccounts');
    if (originalProfile === undefined) delete process.env.VK_MCP_PROFILE;
    else process.env.VK_MCP_PROFILE = originalProfile;
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
    if (originalIncludeSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalIncludeSections;
    if (originalIncludeMethods === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalIncludeMethods;
  });

  it('search profile does not include messages.search', async () => {
    const originalProfile = process.env.VK_MCP_PROFILE;
    const originalMode = process.env.VK_MCP_MODE;
    const originalIncludeSections = process.env.VK_MCP_INCLUDE_SECTIONS;
    const originalIncludeMethods = process.env.VK_MCP_INCLUDE_METHODS;
    process.env.VK_MCP_PROFILE = 'search';
    delete process.env.VK_MCP_MODE;
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    delete process.env.VK_MCP_INCLUDE_METHODS;
    const methods = await loadMethods();
    const names = methods.map(m => m.name);
    expect(names).not.toContain('messages.search');
    if (originalProfile === undefined) delete process.env.VK_MCP_PROFILE;
    else process.env.VK_MCP_PROFILE = originalProfile;
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
    if (originalIncludeSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalIncludeSections;
    if (originalIncludeMethods === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalIncludeMethods;
  });

  it('default mode without profile excludes messages and execute', async () => {
    const originalProfile = process.env.VK_MCP_PROFILE;
    const originalMode = process.env.VK_MCP_MODE;
    const originalIncludeSections = process.env.VK_MCP_INCLUDE_SECTIONS;
    const originalIncludeMethods = process.env.VK_MCP_INCLUDE_METHODS;
    delete process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_MODE;
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    delete process.env.VK_MCP_INCLUDE_METHODS;
    const methods = await loadMethods();
    const names = methods.map(m => m.name);
    expect(names.some(n => n.startsWith('messages.'))).toBe(false);
    expect(names).not.toContain('execute');
    if (originalProfile === undefined) delete process.env.VK_MCP_PROFILE;
    else process.env.VK_MCP_PROFILE = originalProfile;
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
    if (originalIncludeSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalIncludeSections;
    if (originalIncludeMethods === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalIncludeMethods;
  });
});

describe('convertParam', () => {
  it('converts string parameter', () => {
    const result = convertParam({ name: 'q', type: 'string', description: 'Query' });
    expect(result.type).toBe('string');
    expect(result.description).toBe('Query');
  });

  it('converts integer parameter with constraints', () => {
    const result = convertParam({ name: 'count', type: 'integer', minimum: 0, maximum: 100 });
    expect(result.type).toBe('integer');
    expect(result.minimum).toBe(0);
    expect(result.maximum).toBe(100);
  });

  it('converts boolean parameter', () => {
    const result = convertParam({ name: 'extended', type: 'boolean' });
    expect(result.type).toBe('boolean');
  });

  it('converts array parameter', () => {
    const result = convertParam({
      name: 'fields',
      type: 'array',
      items: { type: 'string' },
    });
    expect(result.type).toBe('array');
    expect(result.items).toBeDefined();
  });

  it('preserves enum values', () => {
    const result = convertParam({ name: 'type', type: 'string', enum: ['a', 'b'] });
    expect(result.enum).toEqual(['a', 'b']);
  });

  it('handles union types as string', () => {
    const result = convertParam({ name: 'id', type: ['integer', 'string'] });
    expect(result.type).toBe('string');
  });

  it('handles $ref without type as string', () => {
    const result = convertParam({ name: 'ref', $ref: '../base/objects.json#/definitions/foo' });
    expect(result.type).toBe('string');
  });

  it('preserves default value', () => {
    const result = convertParam({ name: 'count', type: 'integer', default: 20 });
    expect(result.default).toBe(20);
  });

  it('handles string with min/max length', () => {
    const result = convertParam({ name: 'q', type: 'string', minLength: 1, maxLength: 100 });
    expect(result.minLength).toBe(1);
    expect(result.maxLength).toBe(100);
  });
});

describe('buildInputSchema', () => {
  it('returns empty schema for no parameters', () => {
    const result = buildInputSchema([]);
    expect(result.type).toBe('object');
    expect(result.properties).toEqual({});
  });

  it('returns empty schema for undefined parameters', () => {
    const result = buildInputSchema(undefined);
    expect(result.type).toBe('object');
    expect(result.properties).toEqual({});
  });

  it('collects required fields', () => {
    const result = buildInputSchema([
      { name: 'user_id', type: 'integer', required: true },
      { name: 'optional', type: 'string' },
    ]);
    expect(result.required).toContain('user_id');
    expect(result.required).not.toContain('optional');
  });
});

describe('VKClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes boolean to 0/1', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ response: {} })),
    });

    const client = new VKClient('test_token');
    await client.call('test.method', { flag: true, other: false });

    const body = global.fetch.mock.calls[0][1].body;
    expect(body).toContain('flag=1');
    expect(body).toContain('other=0');
  });

  it('normalizes array to comma-separated string', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ response: {} })),
    });

    const client = new VKClient('test_token');
    await client.call('test.method', { ids: [1, 2, 3] });

    const body = global.fetch.mock.calls[0][1].body;
    expect(body).toContain('ids=1%2C2%2C3');
  });

  it('skips undefined and null values', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ response: {} })),
    });

    const client = new VKClient('test_token');
    await client.call('test.method', { a: undefined, b: null, c: 'value' });

    const body = global.fetch.mock.calls[0][1].body;
    expect(body).not.toContain('a=');
    expect(body).not.toContain('b=');
    expect(body).toContain('c=value');
  });

  it('throws on VK API error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({
        error: { error_code: 5, error_msg: 'Auth failed' },
      })),
    });

    const client = new VKClient('test_token');
    await expect(client.call('test.method', {})).rejects.toThrow('VK API Error 5: Auth failed');
  });

  it('uses correct API version and base URL', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ response: {} })),
    });

    const client = new VKClient('test_token');
    await client.call('users.get', {});

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.vk.com/method/users.get',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );

    const body = global.fetch.mock.calls[0][1].body;
    expect(body).toContain('access_token=test_token');
    expect(body).toContain('v=5.199');
  });
});

describe('buildTools', () => {
  it('generates tools with vk_ prefix', () => {
    const methods = [{ name: 'users.get', description: 'Get users', parameters: [] }];
    const tools = buildTools(methods);
    expect(tools[0].name).toBe('vk_users_get');
  });

  it('converts camelCase to snake_case', () => {
    const methods = [{ name: 'users.getFollowers', description: 'Get followers', parameters: [] }];
    const tools = buildTools(methods);
    expect(tools[0].name).toBe('vk_users_get_followers');
  });

  it('converts mixed case correctly', () => {
    const methods = [{ name: 'messages.getConversations', description: 'Get conversations', parameters: [] }];
    const tools = buildTools(methods);
    expect(tools[0].name).toBe('vk_messages_get_conversations');
  });

  it('uses method name as fallback description', () => {
    const methods = [{ name: 'test.method', parameters: [] }];
    const tools = buildTools(methods);
    expect(tools[0].description).toBe('test.method');
  });

  it('generates inputSchema for each tool', () => {
    const methods = [
      {
        name: 'users.get',
        description: 'Get users',
        parameters: [{ name: 'user_ids', type: 'string' }],
      },
    ];
    const tools = buildTools(methods);
    expect(tools[0].inputSchema.type).toBe('object');
    expect(tools[0].inputSchema.properties.user_ids).toBeDefined();
  });
});

describe('buildHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns error for unknown tool', async () => {
    const handler = buildHandler([], null);
    const result = await handler({ name: 'vk_unknown', arguments: {} });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Unknown tool');
  });

  it('calls VK API for known tool', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ response: { id: 1 } })),
    });

    const methods = [{ name: 'users.get', parameters: [] }];
    const client = new VKClient('test_token');
    const handler = buildHandler(methods, client);

    const result = await handler({ name: 'vk_users_get', arguments: { user_ids: '1' } });
    expect(result.content[0].text).toContain('"id": 1');
    expect(result.isError).toBeUndefined();
  });

  it('returns error on VK API failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({
        error: { error_code: 5, error_msg: 'Auth failed' },
      })),
    });

    const methods = [{ name: 'users.get', parameters: [] }];
    const client = new VKClient('test_token');
    const handler = buildHandler(methods, client);

    const result = await handler({ name: 'vk_users_get', arguments: {} });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Auth failed');
  });
});

describe('Integration: schema to tools', () => {
  const originalMode = process.env.VK_MCP_MODE;
  beforeAll(() => { process.env.VK_MCP_MODE = 'all'; });
  afterAll(() => {
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
  });

  it('produces more than 100 tools from real schema', async () => {
    const methods = await loadMethods();
    const tools = buildTools(methods);
    expect(tools.length).toBeGreaterThan(100);
  });

  it('includes essential tools', async () => {
    const methods = await loadMethods();
    const tools = buildTools(methods);
    const toolNames = tools.map(t => t.name);
    expect(toolNames).toContain('vk_users_get');
    expect(toolNames).toContain('vk_wall_get');
    expect(toolNames).toContain('vk_wall_post');
    expect(toolNames).toContain('vk_wall_edit');
    expect(toolNames).toContain('vk_wall_delete');
    expect(toolNames).toContain('vk_groups_get');
    expect(toolNames).toContain('vk_friends_get');
    expect(toolNames).toContain('vk_photos_get');
  });

  it('has correct naming convention for all tools', async () => {
    const methods = await loadMethods();
    const tools = buildTools(methods);
    tools.forEach((tool) => {
      expect(tool.name).toMatch(/^vk_[a-z_]+$/);
    });
  });

  it('has description for all tools', async () => {
    const methods = await loadMethods();
    const tools = buildTools(methods);
    tools.forEach((tool) => {
      expect(tool.description).toBeDefined();
      expect(tool.description.length).toBeGreaterThan(0);
    });
  });

  it('has object inputSchema for all tools', async () => {
    const methods = await loadMethods();
    const tools = buildTools(methods);
    tools.forEach((tool) => {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
    });
  });
});

describe('Edge cases', () => {
  const originalMode = process.env.VK_MCP_MODE;
  beforeAll(() => { process.env.VK_MCP_MODE = 'all'; });
  afterAll(() => {
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
  });

  it('handles methods with no parameters', async () => {
    const originalInclude = process.env.VK_MCP_INCLUDE_METHODS;
    process.env.VK_MCP_INCLUDE_METHODS = 'execute';
    const methods = await loadMethods();
    const execute = methods.find(m => m.name === 'execute');
    expect(execute).toBeDefined();
    const tools = buildTools([execute]);
    expect(tools[0].inputSchema.properties).toEqual({});
    if (originalInclude === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalInclude;
  });

  it('handles methods without description', () => {
    const methods = [{ name: 'test.unknown', parameters: [] }];
    const tools = buildTools(methods);
    expect(tools[0].description).toBe('test.unknown');
  });

  it('filters deprecated methods', async () => {
    const methods = await loadMethods();
    const deprecated = methods.find(m => m.deprecated_from_version);
    expect(deprecated).toBeUndefined();
  });
});

describe('resolveConfig', () => {
  const originalProfile = process.env.VK_MCP_PROFILE;
  const originalMode = process.env.VK_MCP_MODE;
  const originalIncludeSections = process.env.VK_MCP_INCLUDE_SECTIONS;
  const originalIncludeMethods = process.env.VK_MCP_INCLUDE_METHODS;
  const originalExcludeSections = process.env.VK_MCP_EXCLUDE_SECTIONS;
  const originalExcludeMethods = process.env.VK_MCP_EXCLUDE_METHODS;

  afterEach(() => {
    if (originalProfile === undefined) delete process.env.VK_MCP_PROFILE;
    else process.env.VK_MCP_PROFILE = originalProfile;
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
    if (originalIncludeSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalIncludeSections;
    if (originalIncludeMethods === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalIncludeMethods;
    if (originalExcludeSections === undefined) delete process.env.VK_MCP_EXCLUDE_SECTIONS;
    else process.env.VK_MCP_EXCLUDE_SECTIONS = originalExcludeSections;
    if (originalExcludeMethods === undefined) delete process.env.VK_MCP_EXCLUDE_METHODS;
    else process.env.VK_MCP_EXCLUDE_METHODS = originalExcludeMethods;
  });

  it('loads minimal profile correctly', () => {
    process.env.VK_MCP_PROFILE = 'minimal';
    const config = resolveConfig();
    expect(config.profileName).toBe('minimal');
    expect(config.mode).toBe('read');
    expect(config.methods).toContain('users.get');
    expect(config.sections).toBeNull();
  });

  it('env overrides profile mode', () => {
    process.env.VK_MCP_PROFILE = 'minimal';
    process.env.VK_MCP_MODE = 'all';
    const config = resolveConfig();
    expect(config.mode).toBe('all');
  });

  it('env extends profile sections', () => {
    process.env.VK_MCP_PROFILE = 'social';
    process.env.VK_MCP_INCLUDE_SECTIONS = 'wall';
    const config = resolveConfig();
    expect(config.sections).toContain('users');
    expect(config.sections).toContain('friends');
    expect(config.sections).toContain('wall');
  });

  it('throws on unknown profile', () => {
    process.env.VK_MCP_PROFILE = 'nonexistent';
    expect(() => resolveConfig()).toThrow(/Unknown profile/);
  });

  it('uses default exclude sections when no profile', () => {
    delete process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_EXCLUDE_SECTIONS;
    const config = resolveConfig();
    expect(config.excludeSections).toContain('ads');
    expect(config.excludeSections).toContain('secure');
  });

  it('does not apply default excludes when profile is active', () => {
    process.env.VK_MCP_PROFILE = 'ads';
    delete process.env.VK_MCP_EXCLUDE_SECTIONS;
    const config = resolveConfig();
    expect(config.excludeSections).not.toContain('ads');
  });

  it('does not apply default excludes when env includes are present', () => {
    delete process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_EXCLUDE_SECTIONS;
    process.env.VK_MCP_INCLUDE_METHODS = 'ads.getAccounts';
    const config = resolveConfig();
    expect(config.excludeSections).not.toContain('ads');
  });

  it('does not apply default excludes when env include sections are present', () => {
    delete process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_EXCLUDE_SECTIONS;
    process.env.VK_MCP_INCLUDE_SECTIONS = 'ads';
    const config = resolveConfig();
    expect(config.excludeSections).not.toContain('ads');
  });

  it('money mode without profile includes secure methods', () => {
    delete process.env.VK_MCP_PROFILE;
    delete process.env.VK_MCP_INCLUDE_SECTIONS;
    delete process.env.VK_MCP_INCLUDE_METHODS;
    process.env.VK_MCP_MODE = 'money';
    const config = resolveConfig();
    expect(config.mode).toBe('money');
    expect(config.sections).toContain('ads');
    expect(config.sections).toContain('votes');
    expect(config.methods).toContain('secure.getAppBalance');
    expect(config.methods).toContain('secure.withdrawVotes');
  });
});

describe('Profiles', () => {
  const originalProfile = process.env.VK_MCP_PROFILE;
  const originalMode = process.env.VK_MCP_MODE;
  const originalIncludeSections = process.env.VK_MCP_INCLUDE_SECTIONS;
  const originalIncludeMethods = process.env.VK_MCP_INCLUDE_METHODS;

  afterEach(() => {
    if (originalProfile === undefined) delete process.env.VK_MCP_PROFILE;
    else process.env.VK_MCP_PROFILE = originalProfile;
    if (originalMode === undefined) delete process.env.VK_MCP_MODE;
    else process.env.VK_MCP_MODE = originalMode;
    if (originalIncludeSections === undefined) delete process.env.VK_MCP_INCLUDE_SECTIONS;
    else process.env.VK_MCP_INCLUDE_SECTIONS = originalIncludeSections;
    if (originalIncludeMethods === undefined) delete process.env.VK_MCP_INCLUDE_METHODS;
    else process.env.VK_MCP_INCLUDE_METHODS = originalIncludeMethods;
  });

  it('each profile returns non-zero methods', async () => {
    const profiles = ['minimal', 'social', 'content_read', 'content_publish', 'community_manager', 'messenger', 'analytics', 'ads', 'market', 'commerce', 'money', 'search', 'full_read', 'full'];
    for (const name of profiles) {
      process.env.VK_MCP_PROFILE = name;
      delete process.env.VK_MCP_MODE;
      delete process.env.VK_MCP_INCLUDE_SECTIONS;
      delete process.env.VK_MCP_INCLUDE_METHODS;
      const methods = await loadMethods();
      expect(methods.length).toBeGreaterThan(0);
    }
  });

  it('full_read returns only read methods', async () => {
    process.env.VK_MCP_PROFILE = 'full_read';
    delete process.env.VK_MCP_MODE;
    const methods = await loadMethods();
    expect(methods.every(m => m.access === 'read')).toBe(true);
    expect(methods.some(m => m.section === 'ads')).toBe(false);
    expect(methods.some(m => m.section === 'secure')).toBe(false);
  });

  it('minimal contains expected methods', async () => {
    process.env.VK_MCP_PROFILE = 'minimal';
    delete process.env.VK_MCP_MODE;
    const methods = await loadMethods();
    const names = methods.map(m => m.name);
    expect(names).toContain('users.get');
    expect(names).toContain('friends.get');
    expect(names).toContain('wall.get');
    expect(names).toContain('groups.get');
  });

  it('minimal does not include messages methods', async () => {
    process.env.VK_MCP_PROFILE = 'minimal';
    delete process.env.VK_MCP_MODE;
    const methods = await loadMethods();
    const names = methods.map(m => m.name);
    expect(names.some(n => n.startsWith('messages.'))).toBe(false);
  });

  it('social does not include messages methods', async () => {
    process.env.VK_MCP_PROFILE = 'social';
    delete process.env.VK_MCP_MODE;
    const methods = await loadMethods();
    const names = methods.map(m => m.name);
    expect(names.some(n => n.startsWith('messages.'))).toBe(false);
  });
});
