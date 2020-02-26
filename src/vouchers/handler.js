const Handler = require('./vouchers');

const vouchers = new Handler(process.env.VOUCHERS_TABLE_NAME);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

module.exports.create = (event, context, callback) => {
  if (event.body !== null && event.body !== undefined) {
    const body = { id: '222', advertiserID: '222' };
    vouchers
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

module.exports.get = (event, context, callback) => {
  const advertiserID = '612219';
  const params = {
    id: event.pathParameters.id,
    advertiserID,
  };

  vouchers
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
  const advertiserID = '612219';
  vouchers
    .getAll({ advertiserID })
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
