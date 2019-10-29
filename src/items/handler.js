const decode = require('jwt-claims');

const Items = require('./items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

module.exports.create = (event, context, callback) => {
  if (event.body !== null && event.body !== undefined) {
    const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

    const body = JSON.parse(event.body);

    console.log('body:', body);

    body.possessor = claims['cognito:username'];

    items
      .create(body)
      .then((response) => {
        callback(null, {
          statusCode: 201,
          headers,
          body: JSON.stringify(response),
        });
      })
      .catch((err) => {
        callback(err, {
          statusCode: 500,
          headers,
          body: JSON.stringify(err),
        });
      });
  }
};

module.exports.getAll = (event, context, callback) => {
  const params = {
    listId: event.pathParameters.listId,
  };

  items
    .getAll(params)
    .then((response) => {
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(response),
      });
    })
    .catch((err) => {
      callback(err, {
        statusCode: 500,
        headers,
        body: JSON.stringify(err),
      });
    });
};

module.exports.delete = (event, context, callback) => {
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));
  const possessor = claims['cognito:username'];

  const params = {
    listId: event.pathParameters.listId,
    itemId: event.pathParameters.itemId,
    possessor,
  };

  items
    .delete(params)
    .then((response) => {
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(response),
      });
    })
    .catch((err) => {
      callback(err, {
        statusCode: 500,
        headers,
        body: JSON.stringify(err),
      });
    });
};
