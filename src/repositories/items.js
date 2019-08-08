const uuid = require('uuid');
const AWS = require('aws-sdk');
const utils = require('../dynamo.utils');

const schema = {
  ListId: 'S',
  ItemId: 'S',
  Description: 'S',
};

const pack = utils.pack(schema);
const unpack = utils.unpack(schema);

class Items {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new AWS.DynamoDB();
  }

  item(props) {
    console.log('props', props);
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  create(params) {
    console.log('PARAMS', params);
    const itemId = uuid.v4();
    return new Promise((resolve, reject) => {
      const item = this.item({ ...JSON.parse(params), itemId });
      console.log('ITEM to create:', item);
      this.dynamodb
        .putItem(item)
        .promise()
        .then(() => {
          resolve({ itemId });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAll(params) {
    const query = {
      TableName: this.tableName,
      KeyConditionExpression: 'ListId = :listId',
      ExpressionAttributeValues: {
        ':listId': { S: params.listId },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    return new Promise((resolve, reject) => {
      this.dynamodb
        .query(query)
        .promise()
        .then((response) => {
          resolve(response.Items.map(unpack));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Items;
