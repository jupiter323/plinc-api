const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const DownVotes = require('../downVotes');

const downVotes = new DownVotes(process.env.DOWNVOTES_TABLE_NAME);

downVotes
  .create({ possessor: '013' })
  .then((response) => {
    console.log('Created :', response);
  })
  .catch((err) => {
    console.log('Error :', err);
  });
