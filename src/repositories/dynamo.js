const AWS = require('aws-sdk');

class Dynamo {
  constructor() {
    this.dynamodb = new AWS.DynamoDB();
  }

  async put(item) {
    return this.dynamodb.putItem(item).promise();
  }

  async query(params) {
    return this.dynamodb.query(params).promise();
  }

  async get(params) {
    return this.dynamodb.getItem(params).promise();
  }
}

module.exports = Dynamo;
