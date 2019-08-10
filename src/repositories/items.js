const uuid = require('uuid');
const Dynamo = require('./dynamo');

const schema = {
  ListId: 'S',
  ItemId: 'S',
  Possessor: 'S',
  Description: 'S',
  Price: 'N',
};

const pack = Dynamo.pack(schema);
const unpack = Dynamo.unpack(schema);

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
    console.log('item to put:', item);
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
