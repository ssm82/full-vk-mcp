export function convertParam(param) {
  const schema = {};

  if (param.description) {
    schema.description = param.description;
  }

  if (param.default !== undefined) {
    schema.default = param.default;
  }

  const vkType = Array.isArray(param.type)
    ? (param.type.includes('string') ? 'string' : param.type[0])
    : param.type;

  if (param.enum !== undefined && Array.isArray(param.enum)) {
    schema.enum = param.enum.map(item => {
      if (item && typeof item === 'object' && 'value' in item) {
        return item.value;
      }
      return item;
    });
  }

  switch (vkType) {
    case 'string':
      schema.type = 'string';
      if (param.minLength !== undefined) schema.minLength = param.minLength;
      if (param.maxLength !== undefined) schema.maxLength = param.maxLength;
      if (param.pattern !== undefined) schema.pattern = param.pattern;
      break;
    case 'integer':
      schema.type = 'integer';
      if (param.minimum !== undefined) schema.minimum = param.minimum;
      if (param.maximum !== undefined) schema.maximum = param.maximum;
      break;
    case 'number':
      schema.type = 'number';
      if (param.minimum !== undefined) schema.minimum = param.minimum;
      if (param.maximum !== undefined) schema.maximum = param.maximum;
      break;
    case 'boolean':
      schema.type = 'boolean';
      break;
    case 'array':
      schema.type = 'array';
      schema.items = param.items ? convertParam(param.items) : {};
      if (param.maxItems !== undefined) schema.maxItems = param.maxItems;
      if (param.minItems !== undefined) schema.minItems = param.minItems;
      break;
    case 'object':
      schema.type = 'object';
      if (param.properties) {
        schema.properties = {};
        for (const [k, v] of Object.entries(param.properties)) {
          schema.properties[k] = convertParam(v);
        }
      }
      schema.additionalProperties = param.additionalProperties ?? true;
      break;
    default:
      // $ref without explicit type, union types, or unknown types
      schema.type = 'string';
      break;
  }

  return schema;
}

export function buildInputSchema(parameters) {
  if (!parameters || parameters.length === 0) {
    return {
      type: 'object',
      properties: {},
      additionalProperties: false,
    };
  }

  const properties = {};
  const required = [];

  for (const param of parameters) {
    properties[param.name] = convertParam(param);
    if (param.required === true) {
      required.push(param.name);
    }
  }

  const schema = {
    type: 'object',
    properties,
    additionalProperties: false,
  };

  if (required.length > 0) {
    schema.required = required;
  }

  return schema;
}
