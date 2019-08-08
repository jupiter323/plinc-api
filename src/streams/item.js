module.exports.handler = function(event, context, callback) {
  console.log('receiving event');
  console.log(event);
  callback(null, 'done');
};
