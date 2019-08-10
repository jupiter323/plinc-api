const AWS = require('aws-sdk');

const toCamelCase = (str) => {
  return str
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
};

class Dynamo {
  constructor() {
    this.dynamodb = new AWS.DynamoDB();
  }

  static pack(schema) {
    return (params) => {
      return Object.keys(schema).reduce((acc, curr) => {
        if (params[toCamelCase(curr)]) {
          const value = {};
          value[schema[curr]] = params[toCamelCase(curr)];
          acc[curr] = value;
        }
        return acc;
      }, {});
    };
  }

  static unpack(schema) {
    return (params) => {
      return Object.keys(params).reduce((acc, curr) => {
        if (schema[curr]) {
          acc[toCamelCase(curr)] = params[curr][schema[curr]];
        }
        return acc;
      }, {});
    };
  }

  async put(params) {
    return this.dynamodb.putItem(params).promise();
  }

  async query(params) {
    return this.dynamodb.query(params).promise();
  }

  async get(params) {
    return this.dynamodb.getItem(params).promise();
  }

  async update(params) {
    return this.dynamodb.updateItem(params).promise();
  }
}

module.exports = Dynamo;
