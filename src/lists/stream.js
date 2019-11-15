const Items = require('../items/items');

const items = new Items(process.env.ITEMS_TABLE_NAME);

module.exports.handler = (event, context, callback) => {
  try {
    event.Records.forEach(async (record) => {
      if (record.eventName === 'REMOVE' && record.eventSource === 'aws:dynamodb') {
        const listId = record.dynamodb.Keys.ListId.S;
        const possessor = record.dynamodb.OldImage.Possessor.S;
        const itemsToDelete = await items.getAll({ listId });

        itemsToDelete.forEach(async (item) => {
          const { itemId } = item;
          await items.delete({ possessor, listId, itemId });
        });
      }
    });
    callback(null, 'done');
  } catch (err) {
    callback(err, 'done');
  }
};
