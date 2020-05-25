const decode = require('jwt-claims');

const Handler = require('./follows');

const follows = new Handler(process.env.FOLLOWS_TABLE_NAME);

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

    body.possessor = claims['cognito:username'];

    follows
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
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));
  const { possessor } = event.pathParameters || {};
  follows
    .getAll({ possessor: possessor || claims['cognito:username'] })
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

module.exports.getFollowers = (event, context, callback) => {
  const { followUser } = event.pathParameters;
  follows
    .getByFollowUser({ followUser })
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
    followUser: event.pathParameters.followUser,
    possessor,
  };

  follows
    .delete(params)
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
};
