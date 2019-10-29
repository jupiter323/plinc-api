const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Lists = require('../lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists
  .get({ possessor: 'HarryPotter', id: '19135a40-a4e6-470a-b7da-ec370bd4e90b' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
