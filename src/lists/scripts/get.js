const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Lists = require('../lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists
  .get({ possessor: 'HarryPotter', id: '238b0daa-adc0-4abd-b51e-206313cb5f3d' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
