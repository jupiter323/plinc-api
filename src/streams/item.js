module.exports.handler = function(event, context, callback) {
  console.log('receiving event');
  console.log(event);
  console.log('dynamodb');
  console.log(JSON.stringify(event.dynamodb));
  callback(null, 'done');
};
