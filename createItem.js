const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const Items = require('./src/repositories/items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

items
  .create(
    JSON.stringify({
      possessor: 'HarryPotter',
      listId: '238b0daa-adc0-4abd-b51e-206313cb5f3d',
      description: 'my item',
    }),
  )
  .then((response) => {
    console.log('Created', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
