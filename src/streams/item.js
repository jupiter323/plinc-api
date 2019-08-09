const Lists = require('../repositories/lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

module.exports.handler = (event, context, callback) => {
  if (event.body !== null && event.body !== undefined) {
    event.body.Records.forEach(async (record) => {
      if (record.eventName === 'INSERT' && record.eventSource === 'aws:dynamodb') {
        const listId = record.dynamodb.Keys.ListId.S;
        const possessor = record.dynamodb.NewImage.Possessor.S;

        const list = await lists.get({ possessor, id: listId });

        list.noOfItems = `${parseInt(list.noOfItems || 0) + 1}`;

        await lists.update(list);
      }
    });
  }

  callback(null, 'done');
};
