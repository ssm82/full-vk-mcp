import { readdir, readFile, access, writeFile, rename, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';
import { PROFILES, getProfileNames } from './profiles.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, '..', 'vk-api-schema');
const SCHEMA_ZIP_URL = 'https://github.com/VKCOM/vk-api-schema/archive/refs/heads/master.zip';
const TEMP_ZIP = join(__dirname, '..', 'vk-api-schema-master.zip');

const READ_PREFIXES = ['get', 'search', 'is', 'are', 'check', 'resolve', 'find', 'count', 'lookup', 'list'];

const SPECIAL_CASES = {
  'execute': 'write',
  'streaming.getServerUrl': 'read',
};

const MODES = ['read', 'write', 'money', 'all'];

const MONEY_SECTIONS = [
  'ads',
  'market',
  'orders',
  'store',
  'gifts',
  'donut',
  'votes',
];

const MONEY_METHODS = [
  'secure.getAppBalance',
  'secure.getTransactionsHistory',
  'secure.withdrawVotes',
];

const MONEY_SECTION_READ_OVERRIDES = [
  'market.search',
  'market.searchItems',
  'market.searchItemsBasic',
  'market.get',
  'market.getById',
  'market.getCategories',
  'market.getAlbums',
  'market.getAlbumById',
  'market.getComments',
  'market.getOrders',
  'market.getGroupOrders',
  'market.getOrderById',
  'market.getOrderItems',
  'market.getProperties',
  'market.getFavesForAttach',
  'market.filterCategories',
  'orders.get',
  'orders.getById',
  'orders.getAmount',
  'orders.getUserSubscriptions',
  'orders.getUserSubscriptionById',
  'store.getProducts',
  'store.getFavoriteStickers',
  'store.getStickersKeywords',
  'gifts.get',
  'donut.getFriends',
  'donut.getSubscription',
  'donut.getSubscriptions',
  'donut.isDon',
];

const DEFAULT_EXCLUDE_SECTIONS = ['ads', 'secure', 'market', 'orders', 'store', 'gifts', 'donut', 'votes'];
const DEFAULT_SECTIONS = ['users', 'groups', 'wall', 'friends', 'photos'];

function parseList(envVar) {
  if (!envVar || envVar === 'undefined') return [];
  return envVar.split(',').map(s => s.trim()).filter(Boolean);
}

async function schemaExists() {
  try {
    await access(join(SCHEMA_DIR, 'users', 'methods.json'));
    return true;
  } catch {
    return false;
  }
}

async function ensureSchema() {
  if (await schemaExists()) return;

  console.error('[VK MCP] VK API schema not found. Downloading from GitHub...');

  try {
    await rm(TEMP_ZIP, { force: true });
    await rm(join(__dirname, '..', 'vk-api-schema-master'), { recursive: true, force: true });

    const response = await fetch(SCHEMA_ZIP_URL);
    if (!response.ok) {
      throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(TEMP_ZIP, buffer);

    const zip = new AdmZip(TEMP_ZIP);
    zip.extractAllTo(join(__dirname, '..'), true);

    const extractedDir = join(__dirname, '..', 'vk-api-schema-master');
    await rm(SCHEMA_DIR, { recursive: true, force: true });
    await rename(extractedDir, SCHEMA_DIR);

    console.error('[VK MCP] VK API schema downloaded successfully.');
  } finally {
    await rm(TEMP_ZIP, { force: true });
  }
}

function isMoneyMethod(methodName) {
  const section = methodName.split('.')[0];
  if (MONEY_SECTIONS.includes(section)) {
    return true;
  }
  if (MONEY_METHODS.includes(methodName)) {
    return true;
  }
  return false;
}

function isMethodAllowedByMode(config, methodAccess, methodName) {
  if (config.mode === 'all') return true;
  if (methodAccess === config.mode) return true;
  if (config.mode === 'write' && methodAccess === 'read') return true;
  if (config.mode === 'money' && methodAccess === 'read' && isMoneyMethod(methodName)) return true;
  if (config.methods?.includes(methodName)) {
    if (methodAccess === 'money') return config.mode === 'money';
    return true;
  }
  return false;
}

export function classifyMethod(methodName) {
  if (SPECIAL_CASES[methodName] !== undefined) {
    return SPECIAL_CASES[methodName];
  }
  if (MONEY_SECTION_READ_OVERRIDES.includes(methodName)) {
    return 'read';
  }
  if (isMoneyMethod(methodName)) {
    return 'money';
  }
  const action = methodName.split('.').pop();
  const prefix = action.match(/^[a-z]+/)?.[0].toLowerCase();
  if (prefix && READ_PREFIXES.includes(prefix)) {
    return 'read';
  }
  return 'write';
}

export function resolveConfig() {
  const profileName = process.env.VK_MCP_PROFILE;
  let profile = {};
  if (profileName) {
    profile = PROFILES[profileName];
    if (!profile) {
      throw new Error(`Unknown profile "${profileName}". Available profiles: ${getProfileNames().join(', ')}`);
    }
  }

  const mode = MODES.includes(process.env.VK_MCP_MODE)
    ? process.env.VK_MCP_MODE
    : (profile.mode || 'read');

  const envIncludeSections = parseList(process.env.VK_MCP_INCLUDE_SECTIONS);
  const envIncludeMethods = parseList(process.env.VK_MCP_INCLUDE_METHODS);
  const envExcludeSections = parseList(process.env.VK_MCP_EXCLUDE_SECTIONS);
  const envExcludeMethods = parseList(process.env.VK_MCP_EXCLUDE_METHODS);

  const hasEnvIncludes = envIncludeSections.length > 0 || envIncludeMethods.length > 0;

  const sections = [
    ...(profile.sections || []),
    ...envIncludeSections,
  ];

  let methods = [
    ...(profile.methods || []),
    ...envIncludeMethods,
  ];

  if (!profileName && !hasEnvIncludes && mode === 'money') {
    sections.push(...MONEY_SECTIONS);
    methods.push(...MONEY_METHODS);
  }

  const profileExcludeSections = profile.excludeSections || [];
  let excludeSections = [...profileExcludeSections, ...envExcludeSections];

  if (!profileName && envExcludeSections.length === 0 && !hasEnvIncludes && mode !== 'money' && mode !== 'all') {
    excludeSections.push(...DEFAULT_EXCLUDE_SECTIONS);
  }

  const excludeMethods = [
    ...(profile.excludeMethods || []),
    ...envExcludeMethods,
  ];

  return {
    profileName: profileName || null,
    mode,
    sections: sections.length > 0 ? [...new Set(sections)] : null,
    methods: methods.length > 0 ? [...new Set(methods)] : null,
    excludeSections: [...new Set(excludeSections)],
    excludeMethods: [...new Set(excludeMethods)],
    hasEnvIncludes,
  };
}

export async function loadMethods() {
  await ensureSchema();

  const config = resolveConfig();

  const entries = await readdir(SCHEMA_DIR, { withFileTypes: true });
  const allSections = entries.filter(e => e.isDirectory()).map(e => e.name);

  const sectionsToLoad = new Set(allSections);

  for (const s of config.excludeSections) {
    sectionsToLoad.delete(s);
  }

  if (config.sections) {
    const neededSections = new Set(config.sections);
    if (config.methods) {
      for (const m of config.methods) {
        const section = m.split('.')[0];
        if (section) neededSections.add(section);
      }
    }
    for (const s of sectionsToLoad) {
      if (!neededSections.has(s)) sectionsToLoad.delete(s);
    }
  }

  let allMethods = [];

  for (const section of sectionsToLoad) {
    const methodsPath = join(SCHEMA_DIR, section, 'methods.json');
    try {
      const content = await readFile(methodsPath, 'utf-8');
      const data = JSON.parse(content);
      if (!Array.isArray(data.methods)) continue;

      for (const method of data.methods) {
        if (method.deprecated_from_version) continue;

        const methodAccess = classifyMethod(method.name);
        if (!isMethodAllowedByMode(config, methodAccess, method.name)) continue;

        const inWhitelistedSection = config.sections?.includes(section);
        const inWhitelistedMethods = config.methods?.includes(method.name);

        const hasSectionWhitelist = config.sections && config.sections.length > 0;
        const hasMethodWhitelist = config.methods && config.methods.length > 0;

        if (hasSectionWhitelist && hasMethodWhitelist) {
          if (!inWhitelistedSection && !inWhitelistedMethods) continue;
        } else if (hasSectionWhitelist) {
          if (!inWhitelistedSection) continue;
        } else if (hasMethodWhitelist) {
          if (!inWhitelistedMethods) continue;
        }

        allMethods.push({
          ...method,
          section,
          access: methodAccess,
        });
      }
    } catch {
      // Skip sections without methods.json or with parse errors
    }
  }

  if (config.excludeMethods.length > 0) {
    allMethods = allMethods.filter(m => !config.excludeMethods.includes(m.name));
  }

  if (!config.profileName && !config.hasEnvIncludes) {
    if (config.mode === 'money') {
      allMethods = allMethods.filter(m => MONEY_SECTIONS.includes(m.section) || MONEY_METHODS.includes(m.name));
    } else if (config.mode !== 'all') {
      allMethods = allMethods.filter(m => DEFAULT_SECTIONS.includes(m.section));
    }
  }

  const maxTools = parseInt(process.env.VK_MCP_MAX_TOOLS, 10);
  if (Number.isFinite(maxTools) && allMethods.length > maxTools) {
    console.error(`[VK MCP] Limiting tools: ${allMethods.length} -> ${maxTools}`);
    allMethods = allMethods.slice(0, maxTools);
  }

  return allMethods;
}
