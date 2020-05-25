const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Users = require('../users');

const users = new Users(process.env.USERS_TABLE_NAME);

users
  .get({ possessor: 'testuser1', id: '53407c5c-910f-4017-afe9-e24ab66324a4' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
