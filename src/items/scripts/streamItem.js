const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const Lists = require('../../lists/lists');
const Lambda = require('../stream');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

const event = {
  Records: [
    {
      eventName: 'INSERT',
      eventSource: 'aws:dynamodb',
      dynamodb: {
        Keys: {
          ListId: { S: '238b0daa-adc0-4abd-b51e-206313cb5f3d' },
        },
        NewImage: {
          Possessor: { S: 'HarryPotter' },
        },
      },
    },
  ],
};

Lambda.handler(event, {}, () => {
  console.log('DONE!');

  lists
    .get({ possessor: 'HarryPotter', id: '238b0daa-adc0-4abd-b51e-206313cb5f3d' })
    .then((response) => {
      console.log('Found', response);
    })
    .catch((err) => {
      console.log('Error', err);
    });
});
