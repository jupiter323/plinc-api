const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Users = require('../users');

const users = new Users(process.env.USERS_TABLE_NAME);

users
  .delete({
    possessor: 'testuser1',
    id: 'a939533f-298d-4362-8482-3eb9b8c81510',
  })
  .then((response) => {
    console.log('Deleted', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
