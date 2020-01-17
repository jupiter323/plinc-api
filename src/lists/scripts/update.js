const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Lists = require('../lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists
  .update({
    possessor: 'HarryPotter',
    title: 'Test Update Again',
    description: 'Test Update',
    listId: '07e20f2a-2621-4e8c-8e28-1aaa77890cf6',
  })
  .then((response) => {
    console.log('Deleted', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
