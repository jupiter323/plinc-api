const uuid = require('uuid');
const Dynamo = require('./dynamo');

const schema = {
  Possessor: 'S',
  ListId: 'S',
  Title: 'S',
  Description: 'S',
  Category: 'S',
  Public: 'BOOL',
  NoOfItems: 'N',
  Price: 'N',
};

const pack = Dynamo.pack(schema);
const unpack = Dynamo.unpack(schema);

class Lists {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new Dynamo();
  }

  list(props) {
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  async create(params) {
    const listId = uuid.v4();
    const list = this.list({
      ...params,
      listId,
      noOfItems: '0',
      price: '0.00',
    });
    await this.dynamodb.put(list);
    return { listId };
  }

  async increment(params) {
    const query = {
      TableName: this.tableName,
      Key: {
        ListId: {
          S: params.id,
        },
        Possessor: {
          S: params.possessor,
        },
      },
      UpdateExpression: 'SET NoOfItems = NoOfItems + :incr, Price = Price + :price',
      ExpressionAttributeValues: {
        ':incr': { N: '1' },
        ':price': { N: params.price },
      },
      ReturnValues: 'ALL_NEW',
    };

    const response = await this.dynamodb.update(query);
    return unpack(response.Attributes);
  }

  async decrement(params) {
    const query = {
      TableName: this.tableName,
      Key: {
        ListId: {
          S: params.id,
        },
        Possessor: {
          S: params.possessor,
        },
      },
      UpdateExpression: 'SET NoOfItems = NoOfItems - :decr, Price = Price - :price',
      ExpressionAttributeValues: {
        ':decr': { N: '1' },
        ':price': { N: params.price },
      },
      ReturnValues: 'ALL_NEW',
    };

    const response = await this.dynamodb.update(query);
    return unpack(response.Attributes);
  }

  async get(params) {
    const query = {
      Key: {
        ListId: {
          S: params.id,
        },
        Possessor: {
          S: params.possessor,
        },
      },
      TableName: this.tableName,
    };

    const response = await this.dynamodb.get(query);
    return unpack(response.Item);
  }

  async getAll(params) {
    const query = {
      TableName: this.tableName,
      KeyConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: params.possessor },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    const response = await this.dynamodb.query(query);
    return response.Items.map(unpack);
  }
}

module.exports = Lists;
