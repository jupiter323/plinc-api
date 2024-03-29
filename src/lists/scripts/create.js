const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Lists = require('../lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists
  .create({ possessor: '013', title: 'Test Test Test', description: 'Test Test Test' })
  .then((response) => {
    console.log('Created :', response);
  })
  .catch((err) => {
    console.log('Error :', err);
  });
