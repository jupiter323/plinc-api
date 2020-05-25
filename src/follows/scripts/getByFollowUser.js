const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Follows = require('../follows');

const follows = new Follows(process.env.FOLLOWS_TABLE_NAME);

follows
  .getByFollowUser({ followUser: 'adam_norbury' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
