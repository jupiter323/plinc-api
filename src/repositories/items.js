const uuid = require('uuid');
const Dynamo = require('./dynamo');
const utils = require('./dynamo.utils');

const schema = {
  ListId: 'S',
  ItemId: 'S',
  Possessor: 'S',
  Description: 'S',
};

const pack = utils.pack(schema);
const unpack = utils.unpack(schema);

class Items {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new Dynamo();
  }

  item(props) {
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  async create(params) {
    const itemId = uuid.v4();
    const item = this.item({ ...params, itemId });
    await this.dynamodb.put(item);
    return { itemId };
  }

  async getAll(params) {
    const q = {
      TableName: this.tableName,
      KeyConditionExpression: 'ListId = :listId',
      ExpressionAttributeValues: {
        ':listId': { S: params.listId },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    const response = await this.dynamodb.query(q);
    return response.Items.map(unpack);
  }
}

module.exports = Items;
