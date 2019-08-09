const AWS = require('aws-sdk');

class Dynamo {
  constructor() {
    this.dynamodb = new AWS.DynamoDB();
  }

  async put(item) {
    return await this.dynamodb.putItem(item).promise();
  }

  async query(params) {
    return await this.dynamodb.query(params).promise();
  }

  async get(params) {
    return await this.dynamodb.getItem(params).promise();
  }
}

module.exports = Dynamo;
