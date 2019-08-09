const uuid = require('uuid');
const Dynamo = require('./dynamo');
const utils = require('./dynamo.utils');

const schema = {
  Possessor: 'S',
  ListId: 'S',
  Title: 'S',
  Description: 'S',
  Category: 'S',
  Public: 'BOOL',
  NoOfItems: 'N',
};

const pack = utils.pack(schema);
const unpack = utils.unpack(schema);

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
    const list = this.list({ ...params, listId });
    await this.dynamodb.put(list);
    return { listId };
  }

  async update(params) {
    const list = this.list(params);
    await this.dynamodb.put(list);
    return params;
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
