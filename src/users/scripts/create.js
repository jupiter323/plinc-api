const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Users = require('../users');

const users = new Users(process.env.USERS_TABLE_NAME);

users
  .create({
    possessor: 'testuser1',
    email: 'test@test.com',
    password: 'Test!@345',
    number: 'NONE',
    clientId: '12345dfef',
  })
  .then((response) => {
    console.log('Created :', response);
  })
  .catch((err) => {
    console.log('Error :', err);
  });
