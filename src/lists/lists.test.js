const test = require('tape');
const Dynamo = require('../dynamo');
const Lists = require('./lists');

const listsRepository = new Lists('ListsTable');

test('Create', async (t) => {
  t.plan(1);

  Dynamo.prototype.put = (list) => {
    t.deepEqual(
      list,
      {
        TableName: 'ListsTable',
        Item: {
          Possessor: { S: 'Possessor' },
          ListId: list.Item.ListId,
          Title: { S: 'Title' },
          Description: { S: 'Description' },
          NoOfItems: { N: '0' },
          Price: { N: '0.00' },
        },
        ReturnConsumedCapacity: 'TOTAL',
      },
      'List Saved to Dynamo',
    );
  };

  await listsRepository.create({
    possessor: 'Possessor',
    title: 'Title',
    description: 'Description',
  });
});

test('Get', async (t) => {
  t.plan(2);

  Dynamo.prototype.get = (query) => {
    t.deepEqual(
      query,
      {
        Key: { ListId: { S: 'ListId' }, Possessor: { S: 'Possessor' } },
        TableName: 'ListsTable',
      },
      'Query and returns Item from Dynamo',
    );

    return {
      Item: {
        Title: { S: 'Title' },
        Public: { BOOL: false },
        Description: { S: 'Description' },
        Possessor: { S: 'Possessor' },
        Category: { S: 'Category' },
        ListId: { S: 'ListId' },
        NoOfItems: { N: '0' },
        Price: { N: '0.00' },
      },
    };
  };

  const response = await listsRepository.get({
    possessor: 'Possessor',
    id: 'ListId',
  });

  t.deepEqual(
    response,
    {
      title: 'Title',
      public: false,
      description: 'Description',
      possessor: 'Possessor',
      category: 'Category',
      listId: 'ListId',
      noOfItems: '0',
      price: '0.00',
    },
    'Maps Dynamo Response to App Response',
  );
});

test('Get All', async (t) => {
  t.plan(2);

  Dynamo.prototype.query = (query) => {
    t.deepEqual(
      query,
      {
        TableName: 'ListsTable',
        KeyConditionExpression: 'Possessor = :possessor',
        ExpressionAttributeValues: { ':possessor': { S: 'Possessor' } },
        ReturnConsumedCapacity: 'TOTAL',
      },
      'Query and returns Items from Dynamo',
    );

    return {
      Items: [
        {
          Title: { S: 'Title 1' },
          Public: { BOOL: true },
          Description: { S: 'Description 1' },
          Possessor: { S: 'Possessor' },
          Category: { S: 'Category 1' },
          ListId: { S: 'ListId 1' },
          NoOfItems: { N: '0' },
          Price: { N: '0.00' },
        },
        {
          Title: { S: 'Title 2' },
          Description: { S: 'Description 2' },
          Possessor: { S: 'Possessor' },
          Category: { S: 'Category 2' },
          ListId: { S: 'ListId 2' },
          NoOfItems: { N: '0' },
          Price: { N: '0.00' },
        },
      ],
    };
  };

  const response = await listsRepository.getAll({
    possessor: 'Possessor',
  });

  t.deepEqual(
    response,
    [
      {
        title: 'Title 1',
        public: true,
        description: 'Description 1',
        possessor: 'Possessor',
        category: 'Category 1',
        listId: 'ListId 1',
        noOfItems: '0',
        price: '0.00',
      },
      {
        title: 'Title 2',
        description: 'Description 2',
        possessor: 'Possessor',
        category: 'Category 2',
        listId: 'ListId 2',
        noOfItems: '0',
        price: '0.00',
      },
    ],
    'Maps Dynamo Response to App Response',
  );
});

test('Increment', async (t) => {
  t.plan(2);

  Dynamo.prototype.update = (query) => {
    t.deepEqual(
      query,
      {
        TableName: 'ListsTable',
        Key: { ListId: { S: undefined }, Possessor: { S: 'Possessor' } },
        ConditionExpression: 'attribute_exists(ListId)',
        UpdateExpression: 'SET NoOfItems = NoOfItems + :incr, Price = Price + :price',
        ExpressionAttributeValues: { ':incr': { N: '1' }, ':price': { N: '10.99' } },
        ReturnValues: 'ALL_NEW',
      },
      'Updates and returns Items from Dynamo',
    );

    return {
      Attributes: {
        Title: { S: 'Title' },
        Public: { BOOL: true },
        Possessor: { S: 'Possessor' },
        Description: { S: 'Description' },
        NoOfItems: { N: '2' },
        Category: { S: 'Category' },
        ListId: { S: 'ListId' },
        Price: { N: '10.99' },
      },
    };
  };

  const response = await listsRepository.increment({
    listId: 'ListId',
    price: '10.99',
    possessor: 'Possessor',
  });

  t.deepEqual(
    response,
    {
      title: 'Title',
      public: true,
      possessor: 'Possessor',
      description: 'Description',
      noOfItems: '2',
      category: 'Category',
      listId: 'ListId',
      price: '10.99',
    },
    'Maps Dynamo Response to App Response',
  );
});

test('Decrement', async (t) => {
  t.plan(2);

  Dynamo.prototype.update = (query) => {
    t.deepEqual(
      query,
      {
        TableName: 'ListsTable',
        Key: { ListId: { S: undefined }, Possessor: { S: 'Possessor' } },
        ConditionExpression: 'attribute_exists(ListId)',
        UpdateExpression: 'SET NoOfItems = NoOfItems - :decr, Price = Price - :price',
        ExpressionAttributeValues: { ':decr': { N: '1' }, ':price': { N: '10.99' } },
        ReturnValues: 'ALL_NEW',
      },
      'Updates and returns Items from Dynamo',
    );

    return {
      Attributes: {
        Title: { S: 'Title' },
        Public: { BOOL: true },
        Possessor: { S: 'Possessor' },
        Description: { S: 'Description' },
        NoOfItems: { N: '1' },
        Category: { S: 'Category' },
        ListId: { S: 'ListId' },
        Price: { N: '10.99' },
      },
    };
  };

  const response = await listsRepository.decrement({
    listId: 'ListId',
    price: '10.99',
    possessor: 'Possessor',
  });

  t.deepEqual(
    response,
    {
      title: 'Title',
      public: true,
      possessor: 'Possessor',
      description: 'Description',
      noOfItems: '1',
      category: 'Category',
      listId: 'ListId',
      price: '10.99',
    },
    'Maps Dynamo Response to App Response',
  );
});

test('Delete', async (t) => {
  t.plan(1);

  Dynamo.prototype.delete = (list) => {
    t.deepEqual(list, {
      TableName: 'ListsTable',
      Key: {
        ListId: { S: 'ListId' },
        Possessor: { S: 'Possessor' },
      },
      ConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: 'Possessor' },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    });
  };

  await listsRepository.delete({
    possessor: 'Possessor',
    id: 'ListId',
  });
});
