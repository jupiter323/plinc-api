const uuid = require('uuid');
const AWS = require('aws-sdk');
const utils = require('./dynamo.utils');

const schema = {
  "Owner": "S",
  "ListId": "S",
  "Title": "S",
  "Description": "S",
  "Category": "S",
  "Public": "BOOL"
};

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
        "Owner": {
          S: params.owner
        }
      },
      TableName: this.tableName
    };

    return new Promise((resolve, reject) => {
      this.dynamodb.getItem(query).promise().then((response) => {
        resolve(utils.unpack(schema, response["Item"]));
      }).catch(err => {
        reject({'error': err});
      });
    });
  }
}

module.exports = Lists;
