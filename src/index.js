const decode = require('jwt-claims');

const Lists = require('./lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

const headers = { 'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                  'Access-Control-Allow-Methods': '*',
                  'Access-Control-Allow-Headers': '*' };

module.exports.create = (event, context, callback) => {
  if (event.body !== null && event.body !== undefined) {
    const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

    let body = JSON.parse(event.body);

    body.possessor = claims['cognito:username'];

    lists.create(body).then(response => {
      callback(null, {
        statusCode: 201,
        headers,
        body: JSON.stringify(response)
      });
    }).catch(err => {
      callback(err, {
        statusCode: 500,
        headers,
        body: JSON.stringify(err)
      });
    });
  }
};

module.exports.get = (event, context, callback) => {
  const params = { id: event['pathParameters']['id'], possessor: event['pathParameters']['possessor'] };

  lists.get(params).then(response => {
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    });
  }).catch(err => {
    callback(err, {
      statusCode: 500,
      headers,
      body: JSON.stringify(err)
    });
  });
};

module.exports.getAll = (event, context, callback) => {
  const claims = decode(event.headers.Authorization.replace('Bearer ', ''));

  console.log('BEFORE GET ALL');

  lists.getAll({ possessor: claims['cognito:username'] }).then(response => {
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    });
  }).catch(err => {
    callback(err, {
      statusCode: 500,
      headers,
      body: JSON.stringify(err)
    });
  });
};
