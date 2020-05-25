const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Follows = require('../follows');

const follows = new Follows(process.env.FOLLOWS_TABLE_NAME);

follows
  .create({ possessor: 'B4', followUser: 'emily' })
  .then((response) => {
    console.log('Created :', response);
  })
  .catch((err) => {
    console.log('Error :', err);
  });
