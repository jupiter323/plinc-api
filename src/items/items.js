const uuid = require('uuid');
const Dynamo = require('../dynamo');

const schema = {
  ListId: 'S',
  ItemId: 'S',
  Possessor: 'S',
  Description: 'S',
  Price: 'N',
  Image: 'S',
  Brand: 'S',
  Date: 'S',
  OutOfStock: 'BOOL',
  OnSale: 'BOOL',
  NumberOfLikes: 'N',
  Liked: 'BOOL',
  Url: 'S',
  LargeImage: 'S',
  CatId: 'S',
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
    const item = this.item({ itemId, ...params });
    await this.dynamodb.put(item);
    return { itemId: params.itemId || itemId };
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

  async delete(params) {
    const q = {
      TableName: this.tableName,
      Key: {
        ListId: { S: params.listId },
        ItemId: { S: params.itemId },
      },
      ConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: params.possessor },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    };
    const response = await this.dynamodb.delete(q);
    return { response };
  }
}

module.exports = Items;
