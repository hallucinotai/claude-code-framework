/**
 * Handlebars helpers for template rendering.
 * Provides case conversion, string manipulation, and conditional helpers.
 */

function camelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function pascalCase(str) {
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function kebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function snakeCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

function upperSnakeCase(str) {
  return snakeCase(str).toUpperCase();
}

function pluralize(str) {
  if (str.endsWith('y') && !/[aeiou]y$/i.test(str)) {
    return str.slice(0, -1) + 'ies';
  }
  if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
    return str + 'es';
  }
  return str + 's';
}

function singularize(str) {
  if (str.endsWith('ies')) {
    return str.slice(0, -3) + 'y';
  }
  if (str.endsWith('ses') || str.endsWith('xes') || str.endsWith('zes') || str.endsWith('ches') || str.endsWith('shes')) {
    return str.slice(0, -2);
  }
  if (str.endsWith('s') && !str.endsWith('ss')) {
    return str.slice(0, -1);
  }
  return str;
}

/**
 * Register all helpers on a Handlebars instance.
 */
function registerHelpers(Handlebars) {
  Handlebars.registerHelper('camelCase', (str) => camelCase(str || ''));
  Handlebars.registerHelper('PascalCase', (str) => pascalCase(str || ''));
  Handlebars.registerHelper('kebabCase', (str) => kebabCase(str || ''));
  Handlebars.registerHelper('snakeCase', (str) => snakeCase(str || ''));
  Handlebars.registerHelper('UPPER_SNAKE', (str) => upperSnakeCase(str || ''));

  Handlebars.registerHelper('pluralize', (str) => pluralize(str || ''));
  Handlebars.registerHelper('singularize', (str) => singularize(str || ''));

  Handlebars.registerHelper('lowercase', (str) => (str || '').toLowerCase());
  Handlebars.registerHelper('uppercase', (str) => (str || '').toUpperCase());

  // Inline comparison helpers (for use as subexpressions)
  Handlebars.registerHelper('eq', (a, b) => a === b);
  Handlebars.registerHelper('neq', (a, b) => a !== b);
  Handlebars.registerHelper('gt', (a, b) => a > b);
  Handlebars.registerHelper('gte', (a, b) => a >= b);
  Handlebars.registerHelper('lt', (a, b) => a < b);
  Handlebars.registerHelper('lte', (a, b) => a <= b);
  Handlebars.registerHelper('and', (a, b) => a && b);
  Handlebars.registerHelper('or', (a, b) => a || b);
  Handlebars.registerHelper('not', (a) => !a);
  Handlebars.registerHelper('includes', (arr, value) => {
    const list = Array.isArray(arr) ? arr : (arr || '').split(',');
    return list.includes(value);
  });

  // Block comparison helpers
  Handlebars.registerHelper('if_eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('if_neq', function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('if_includes', function (arr, value, options) {
    const list = Array.isArray(arr) ? arr : (arr || '').split(',');
    return list.includes(value) ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('json', (obj, indent) => {
    const spaces = typeof indent === 'number' ? indent : 2;
    return new Handlebars.SafeString(JSON.stringify(obj, null, spaces));
  });

  Handlebars.registerHelper('join', (arr, separator) => {
    const sep = typeof separator === 'string' ? separator : ', ';
    return Array.isArray(arr) ? arr.join(sep) : '';
  });

  Handlebars.registerHelper('raw', function (options) {
    return options.fn(this);
  });
}

module.exports = {
  camelCase,
  pascalCase,
  kebabCase,
  snakeCase,
  upperSnakeCase,
  pluralize,
  singularize,
  registerHelpers,
};
