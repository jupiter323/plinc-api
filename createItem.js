const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const Items = require('./src/repositories/items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

items
  .create({
    possessor: 'HarryPotter',
    listId: 'd047cc01-d29c-4066-8b25-195521ee11b2',
    description: 'my item',
  })
  .then((response) => {
    console.log('Created', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
