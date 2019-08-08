module.exports.handler = function(event, context, callback) {
  console.log('receiving event');
  console.log(event);

  event.Records.forEach((record) => {
    console.log('dynamodb');
    console.log(JSON.stringify(record.dynamodb));
  });

  callback(null, 'done');
};
