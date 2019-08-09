const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const Items = require('./src/repositories/items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

items
  .getAll({ possessor: 'HarryPotter', listId: '238b0daa-adc0-4abd-b51e-206313cb5f3d' })
  .then((response) => {
    console.log('Response', response);
    console.log('Found', response.length);
  })
  .catch((err) => {
    console.log('Error', err);
  });
