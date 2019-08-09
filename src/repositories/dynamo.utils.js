const toCamelCase = (str) => {
  return str
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
};

module.exports.pack = (schema) => (params) => {
  return Object.keys(schema).reduce((acc, curr) => {
    if (params[toCamelCase(curr)]) {
      const value = {};
      value[schema[curr]] = params[toCamelCase(curr)];
      acc[curr] = value;
    }
    return acc;
  }, {});
};

module.exports.unpack = (schema) => (params) => {
  return Object.keys(params).reduce((acc, curr) => {
    if (schema[curr]) {
      acc[toCamelCase(curr)] = params[curr][schema[curr]];
    }
    return acc;
  }, {});
};
