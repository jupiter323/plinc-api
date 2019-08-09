const test = require('tape');
const utils = require('./dynamo.utils');

test('Pack', (t) => {
  const schema = {
    ListId: 'S',
    ItemId: 'S',
    Description: 'S',
  };

  t.plan(1);

  t.deepEqual(
    utils.pack(schema)({
      listId: 'ID',
      itemId: 'ID',
      description: 'description',
    }),
    { ListId: { S: 'ID' }, ItemId: { S: 'ID' }, Description: { S: 'description' } },
    'Packs to Dynamo Query',
  );
});

test('Pack', (t) => {
  const schema = {
    ListId: 'S',
    ItemId: 'S',
    Description: 'S',
  };

  t.plan(1);

  t.deepEqual(
    utils.unpack(schema)({
      ListId: { S: 'ID' },
      ItemId: { S: 'ID' },
      Description: { S: 'description' },
    }),
    {
      listId: 'ID',
      itemId: 'ID',
      description: 'description',
    },
    'Unpacks from Dynamo Query',
  );
});
