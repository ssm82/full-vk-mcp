import { buildInputSchema } from './param-converter.js';

export function getToolName(methodName) {
  return `vk_${methodName
    .replace(/\./g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()}`;
}

function cleanText(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDescription(method) {
  const toolName = getToolName(method.name);
  const originalDescription = cleanText(method.description);

  const metadata = [
    `VK API method: ${method.name}.`,
    `Tool name: ${toolName}.`,
    `Section: ${method.section}.`,
    `Access level: ${method.access}.`,
  ].join(' ');

  if (!originalDescription) {
    return method.name.slice(0, 1000);
  }

  return `${originalDescription} ${metadata}`.slice(0, 1000);
}

export function buildTools(methods) {
  return methods.map(method => ({
    name: getToolName(method.name),
    description: buildDescription(method),
    inputSchema: buildInputSchema(method.parameters),
  }));
}

export function buildHandler(methods, vkClient) {
  const methodMap = new Map();

  for (const method of methods) {
    methodMap.set(getToolName(method.name), method.name);
  }

  return async function handler(params) {
    const { name, arguments: args } = params;

    if (!methodMap.has(name)) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` }, null, 2),
          },
        ],
        isError: true,
      };
    }

    const vkMethod = methodMap.get(name);

    try {
      const result = await vkClient.call(vkMethod, args || {});
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2),
          },
        ],
        isError: true,
      };
    }
  };
}