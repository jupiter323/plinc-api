const test = require('tape');
const Dynamo = require('./dynamo');
const Items = require('./items');

const itemsRepository = new Items('ItemsTable');

test('Create', async (t) => {
  t.plan(1);

  Dynamo.prototype.put = (item) => {
    t.deepEqual(
      item,
      {
        TableName: 'ItemsTable',
        Item: {
          ListId: { S: 'ListId' },
          ItemId: item.Item.ItemId,
          Possessor: { S: 'Possessor' },
          Description: { S: 'Description' },
        },
        ReturnConsumedCapacity: 'TOTAL',
      },
      'Item Saved to Dynamo',
    );
  };

  await itemsRepository.create({
    possessor: 'Possessor',
    listId: 'ListId',
    description: 'Description',
  });
});

test('Get All', async (t) => {
  t.plan(2);

  Dynamo.prototype.query = (query) => {
    t.deepEqual(
      query,
      {
        TableName: 'ItemsTable',
        KeyConditionExpression: 'ListId = :listId',
        ExpressionAttributeValues: { ':listId': { S: 'ListId' } },
        ReturnConsumedCapacity: 'TOTAL',
      },
      'Query and returns Items from Dynamo',
    );

    return {
      Items: [
        {
          ItemId: { S: 'ItemId1' },
          ListId: { S: 'ListId' },
          Description: { S: 'Item 1' },
        },
        {
          ItemId: { S: 'ItemId2' },
          ListId: { S: 'ListId' },
          Description: { S: 'Item 2' },
        },
      ],
    };
  };

  const response = await itemsRepository.getAll({
    listId: 'ListId',
  });

  t.deepEqual(
    response,
    [
      {
        itemId: 'ItemId1',
        listId: 'ListId',
        description: 'Item 1',
      },
      {
        itemId: 'ItemId2',
        listId: 'ListId',
        description: 'Item 2',
      },
    ],
    'Maps Dynamo Response to App Response',
  );
});
