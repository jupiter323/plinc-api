const test = require('tape');
const Dynamo = require('./dynamo');

test('Pack', (t) => {
  const schema = {
    ListId: 'S',
    ItemId: 'S',
    Description: 'S',
    Price: 'N',
    Public: 'BOOL',
  };

  t.plan(1);

  t.deepEqual(
    Dynamo.pack(schema)({
      listId: 'ID',
      itemId: 'ID',
      description: 'description',
      public: false,
      price: 12.99,
    }),
    {
      ListId: { S: 'ID' },
      ItemId: { S: 'ID' },
      Description: { S: 'description' },
      Price: { N: '12.99' },
      Public: { BOOL: false },
    },
    'Packs to Dynamo Query',
  );
});

test('Unpack', (t) => {
  const schema = {
    ListId: 'S',
    ItemId: 'S',
    Description: 'S',
    Price: 'N',
    Public: 'BOOL',
  };

  t.plan(1);

  t.deepEqual(
    Dynamo.unpack(schema)({
      ListId: { S: 'ID' },
      ItemId: { S: 'ID' },
      Description: { S: 'description' },
      Price: { N: '105.67' },
      Public: { BOOL: true },
    }),
    {
      listId: 'ID',
      itemId: 'ID',
      description: 'description',
      price: '105.67',
      public: true,
    },
    'Unpacks from Dynamo Query',
  );
});
