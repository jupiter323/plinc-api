module.exports = {
  hooks: {
    'pre-commit': 'pretty-quick --staged && npm run lint && npm run api:validate',
  },
};
