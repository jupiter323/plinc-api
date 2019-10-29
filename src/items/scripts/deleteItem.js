const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Items = require('../items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

items
  .delete({
    possessor: 'HarryPotter',
    itemId: '434a60b9-925f-4eba-8e28-f4efcdcbcd5b',
    listId: 'd047cc01-d29c-4066-8b25-195521ee11b2',
  })
  .then((response) => {
    console.log('Deleted', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
