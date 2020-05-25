const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Follows = require('../follows');

const follows = new Follows(process.env.FOLLOWS_TABLE_NAME);

follows
  .delete({
    possessor: '013',
    followUser: 'testFollow',
  })
  .then((response) => {
    console.log('Deleted', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
