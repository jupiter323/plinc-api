module.exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
    body: JSON.stringify({'message': 'Hello from API!!!'})
  });
};
