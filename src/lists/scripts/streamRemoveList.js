const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const Items = require('../../items/items');
const Lambda = require('../stream');

const items = new Items(process.env.ITEMS_TABLE_NAME);

const event = {
  Records: [
    {
      eventName: 'REMOVE',
      eventSource: 'aws:dynamodb',
      dynamodb: {
        Keys: {
          ListId: { S: '19135a40-a4e6-470a-b7da-ec370bd4e90b' },
        },
        OldImage: {
          Possessor: { S: 'HarryPotter' },
        },
      },
    },
  ],
};

Lambda.handler(event, {}, () => {
  console.log('DONE!');

  items
    .getAll({ possessor: 'HarryPotter', listId: '19135a40-a4e6-470a-b7da-ec370bd4e90b' })
    .then((response) => {
      console.log('Found', response);
    })
    .catch((err) => {
      console.log('Error', err);
    });
});
