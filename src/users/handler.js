const decode = require('jwt-claims');

const Handler = require('./users');

const users = new Handler(process.env.USERS_TABLE_NAME);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

module.exports.create = (event, context, callback) => {
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

  if (event.body !== null && event.body !== undefined) {
    const body = JSON.parse(event.body);
    const params = {
      ...body,
      possessor: claims['cognito:username'],
    };
    users
      .create(params)
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

module.exports.get = (event, context, callback) => {
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));
  const possessor = claims['cognito:username'];

  const params = {
    id: event.pathParameters.id,
    possessor,
  };

  users
    .get(params)
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

module.exports.getAll = (event, context, callback) => {
  // const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

  users
    .getByClientId({ clientId: event.pathParameters.clientId })
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

module.exports.getUserId = (event, context, callback) => {
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

  users
    .getUser({ possessor: claims['cognito:username'] })
    .then((response) => {
      callback(null, {
        statusCode: 201,
        headers,
        body: JSON.stringify(
          response.map((item) => {
            return { userId: item.userId };
          })[0],
        ),
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

module.exports.update = (event, context, callback) => {
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

  const params = {
    ...JSON.parse(event.body),
    userId: event.pathParameters.id,
    possessor: claims['cognito:username'],
  };

  users
    .update(params)
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
    id: event.pathParameters.id,
    possessor,
  };

  users
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
