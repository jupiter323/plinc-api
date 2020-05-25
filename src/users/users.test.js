const test = require('tape');
const Dynamo = require('../dynamo');
const Users = require('./users');

const usersRepository = new Users('UsersTable');

test('Create', async (t) => {
  t.plan(1);

  Dynamo.prototype.put = (user) => {
    t.deepEqual(
      user,
      {
        TableName: 'UsersTable',
        Item: {
          Possessor: { S: 'Possessor' },
          UserId: user.Item.UserId,
          Email: { S: 'Email' },
          Password: user.Item.Password,
          Number: { S: 'Number' },
          ClientId: { S: 'ClientId' },
        },
        ReturnConsumedCapacity: 'TOTAL',
      },
      'List Saved to Dynamo',
    );
  };

  await usersRepository.create({
    possessor: 'Possessor',
    email: 'Email',
    password: 'Password',
    number: 'Number',
    clientId: 'ClientId',
  });
});

test('Get', async (t) => {
  t.plan(2);

  Dynamo.prototype.get = (query) => {
    t.deepEqual(
      query,
      {
        Key: { UserId: { S: 'UserId' }, Possessor: { S: 'Possessor' } },
        TableName: 'UsersTable',
      },
      'Query and returns Item from Dynamo',
    );

    return {
      Item: {
        Possessor: { S: 'Possessor' },
        UserId: { S: 'UserId' },
        Email: { S: 'Email' },
        Password: { S: 'Password' },
        Number: { S: 'Number' },
        ClientId: { S: 'ClientId' },
      },
    };
  };

  const response = await usersRepository.get({
    possessor: 'Possessor',
    id: 'UserId',
  });

  t.deepEqual(
    response,
    {
      possessor: 'Possessor',
      email: 'Email',
      password: 'Password',
      number: 'Number',
      clientId: 'ClientId',
      userId: 'UserId',
    },
    'Maps Dynamo Response to App Response',
  );
});

test('Delete', async (t) => {
  t.plan(1);

  Dynamo.prototype.delete = (user) => {
    t.deepEqual(user, {
      TableName: 'UsersTable',
      Key: {
        UserId: { S: 'UserId' },
        Possessor: { S: 'Possessor' },
      },
      ConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: 'Possessor' },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    });
  };

  await usersRepository.delete({
    possessor: 'Possessor',
    id: 'UserId',
  });
});
