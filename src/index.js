const Lists = require('./lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

const headers = { 'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                  'Access-Control-Allow-Methods': '*',
                  'Access-Control-Allow-Headers': '*' };

module.exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers,
    body: JSON.stringify({'message': 'Hello from API'})
  });
};

module.exports.create = (event, context, callback) => {
  if (event.body !== null && event.body !== undefined) {
    let body = JSON.parse(event.body);

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
  const params = { id: event['pathParameters']['id'], owner: event['pathParameters']['owner'] };

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
