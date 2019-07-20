module.exports = {
  hooks: {
    'pre-commit': 'npm run api:validate:no-schema',
  },
};
