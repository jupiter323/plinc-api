const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Users = require('../users');

const users = new Users(process.env.USERS_TABLE_NAME);

users
  .getByClientId({ clientId: '6p82c0vqgur6c9f2q9vp1a3pub' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
