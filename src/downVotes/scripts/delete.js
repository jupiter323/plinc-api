const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const DownVotes = require('../downVotes');

const downVotes = new DownVotes(process.env.DOWNVOTES_TABLE_NAME);

downVotes
  .delete({
    possessor: '013',
    id: '12312312',
  })
  .then((response) => {
    console.log('Deleted', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
