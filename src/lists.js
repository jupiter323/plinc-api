const uuid = require('uuid');
const AWS = require('aws-sdk');
const utils = require('./dynamo.utils');

const schema = {
  Possessor: 'S',
  ListId: 'S',
  Title: 'S',
  Description: 'S',
  Category: 'S',
  Public: 'BOOL',
};

const unpack = utils.unpack(schema);

class Lists {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new AWS.DynamoDB();
  }

  list(props) {
    return {
      TableName: this.tableName,
      Item: utils.pack(schema, props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  create(params) {
    const listid = uuid.v4();
    return new Promise((resolve, reject) => {
      this.dynamodb
        .putItem(this.list({ ...params, listid }))
        .promise()
        .then(() => {
          resolve({ listid });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(params) {
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

    return new Promise((resolve, reject) => {
      this.dynamodb
        .getItem(query)
        .promise()
        .then((response) => {
          resolve(unpack(response.Item));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAll(params) {
    const query = {
      TableName: this.tableName,
      KeyConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: params.possessor },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    console.log('GET ALL', query);

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

module.exports = Lists;
