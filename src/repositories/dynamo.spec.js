const test = require('tape');
const Dynamo = require('./dynamo');

test('Pack', (t) => {
  const schema = {
    ListId: 'S',
    ItemId: 'S',
    Description: 'S',
  };

  t.plan(1);

  t.deepEqual(
    Dynamo.pack(schema)({
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
    Dynamo.unpack(schema)({
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
