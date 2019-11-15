const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Items = require('../items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

items
  .getAll({ possessor: 'HarryPotter', listId: '01999c0c-781d-4432-8f86-66f08e9a59c6' })
  .then((response) => {
    console.log('Response', response);
    console.log('Found', response.length);
  })
  .catch((err) => {
    console.log('Error', err);
  });
