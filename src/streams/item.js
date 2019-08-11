const Lists = require('../repositories/lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

module.exports.handler = (event, context, callback) => {
  try {
    event.Records.forEach(async (record) => {
      if (record.eventName === 'INSERT' && record.eventSource === 'aws:dynamodb') {
        const listId = record.dynamodb.Keys.ListId.S;
        const possessor = record.dynamodb.NewImage.Possessor.S;
        const price = record.dynamodb.NewImage.Price.N;

        console.log('KEYS', record.dynamodb.Keys);
        console.log('NEW IMAGE:', record.dynamodb.NewImage);

        await lists.increment({ possessor, id: listId, price });
      }
    });
    callback(null, 'done');
  } catch (err) {
    callback(err, 'done');
  }
};
