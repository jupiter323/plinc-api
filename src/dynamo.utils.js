module.exports.pack = (schema, params) => {
  return Object.keys(schema).reduce((acc, curr) => {
    if (params[curr.toLowerCase()]) {
      const value = {};
      value[schema[curr]] = params[curr.toLowerCase()];
      acc[curr] = value;
    }
    return acc;
  }, {});
};

module.exports.unpack = (schema) => (params) => {
  return Object.keys(params).reduce((acc, curr) => {
    if (schema[curr]) {
      acc[curr] = params[curr][schema[curr]];
    }
    return acc;
  }, {});
};
