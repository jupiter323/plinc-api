const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Users = require('../users');

const users = new Users(process.env.USERS_TABLE_NAME);

users
  .update({
    possessor: 'testuser1',
    email: 'test2@test2.com',
    password: 'Test!@345',
    number: 'NONE',
    clientId: '12345dfef',
    userId: 'b1250ac6-ed4c-4ef2-82bb-a4591d897656',
    description: '',
  })
  .then((response) => {
    console.log('Updated', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
