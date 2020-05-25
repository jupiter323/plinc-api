const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const Lists = require('../../lists/lists');
const Lambda = require('../stream');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

const event = {
  Records: [
    {
      eventName: 'REMOVE',
      eventSource: 'aws:dynamodb',
      dynamodb: {
        OldImage: {
          Possessor: { S: 'nural3' },
        },
      },
    },
  ],
};

Lambda.handler(event, {}, () => {
  console.log('DONE!');

  lists
    .getAll({ possessor: 'nural3' })
    .then((response) => {
      console.log('Found', response);
    })
    .catch((err) => {
      console.log('Error', err);
    });
});
