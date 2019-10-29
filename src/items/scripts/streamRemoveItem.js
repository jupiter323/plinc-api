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
        Keys: {
          ListId: { S: 'd047cc01-d29c-4066-8b25-195521ee11b2' },
        },
        NewImage: {
          Possessor: { S: 'HarryPotter' },
          Price: { N: '9.99' },
        },
      },
    },
  ],
};

Lambda.handler(event, {}, () => {
  console.log('DONE!');

  lists
    .get({ possessor: 'HarryPotter', id: 'd047cc01-d29c-4066-8b25-195521ee11b2' })
    .then((response) => {
      console.log('Found', response);
    })
    .catch((err) => {
      console.log('Error', err);
    });
});
