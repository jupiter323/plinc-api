const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Lists = require('../lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists
  .get({ possessor: 'HarryPotter', id: '07e20f2a-2621-4e8c-8e28-1aaa77890cf6' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
