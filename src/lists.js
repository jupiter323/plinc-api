const uuid = require('uuid');
const AWS = require('aws-sdk');
const utils = require('./dynamo.utils');

const schema = {
  "User": "S",
  "ListId": "S",
  "Title": "S",
  "Description": "S",
  "Category": "S",
  "Public": "BOOL"
};

const unpack = utils.unpack(schema);

class Lists {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new AWS.DynamoDB();
  }

  list (props) {
    return {
      "TableName": this.tableName,
      "Item": utils.pack(schema, props),
      "ReturnConsumedCapacity": "TOTAL"
    };
  }

  create(params) {
    params.listid = uuid.v4();
    return new Promise((resolve, reject) => {
      this.dynamodb.putItem(this.list(params)).promise().then(() => {
        resolve({'listId': params.listid});
      }).catch(err => {
        reject({'error': err});
      });
    });
  }

  get(params) {
    const query = {
      Key: {
        "ListId": {
          S: params.id
        },
        "User": {
          S: params.user
        }
      },
      TableName: this.tableName
    };

    return new Promise((resolve, reject) => {
      this.dynamodb.getItem(query).promise().then((response) => {
        resolve(unpack(response["Item"]));
      }).catch(err => {
        reject({'error': err});
      });
    });
  }

  getAll(params) {
    const query = {
      TableName: this.tableName,
      KeyConditionExpression: "User = :user",
      ExpressionAttributeValues:{
        ":user": { S: params.user }
      },
      ReturnConsumedCapacity: "TOTAL"
    };

    return new Promise((resolve, reject) => {
      this.dynamodb.query(query).promise().then((response) => {
        resolve(response.items.map(unpack));
      }).catch(err => {
        reject({'error': err});
      });
    });
  }
}

module.exports = Lists;
