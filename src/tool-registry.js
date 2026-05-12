import { buildInputSchema } from './param-converter.js';

function getToolName(methodName) {
  return `vk_${methodName
    .replace(/\./g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()}`;
}

function cleanDescription(desc, methodName) {
  if (!desc) return methodName;
  return desc
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000);
}

export function buildTools(methods) {
  return methods.map(method => ({
    name: getToolName(method.name),
    description: cleanDescription(method.description, method.name),
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
