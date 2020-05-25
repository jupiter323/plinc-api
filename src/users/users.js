/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const Dynamo = require('../dynamo');

const schema = {
  Possessor: 'S',
  UserId: 'S',
  Email: 'S',
  Password: 'S',
  Number: 'S',
  ClientId: 'S',
  Birthday: 'S',
  FirstName: 'S',
  LastName: 'S',
  Description: 'S',
  Website: 'S',
  Country: 'S',
  Language: 'S',
  Sex: 'S',
  Avatar: 'S',
};

const pack = Dynamo.pack(schema);
const unpack = Dynamo.unpack(schema);
function removeEmptyStringElements(obj) {
  for (const prop in obj) {
    if (obj[prop] === '' || obj[prop] === null) {
      // delete elements that are empty strings
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      // dive deeper in
      removeEmptyStringElements(obj[prop]);
    }
  }
  return obj;
}

class Users {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new Dynamo();
  }

  user(props) {
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  async create(params) {
    const salt = 10;
    const userId = uuid.v4();
    const encrypted = await bcrypt.hash(params.password, salt);
    params.password = encrypted;
    const user = this.user({
      ...params,
      userId,
    });
    await this.dynamodb.put(user);
    return { userId };
  }

  async update(params) {
    const user = this.user({
      ...removeEmptyStringElements(params),
    });
    await this.dynamodb.put(user);
    return unpack(user.Item);
  }

  async get(params) {
    const query = {
      Key: {
        UserId: {
          S: params.id,
        },
        Possessor: {
          S: params.possessor,
        },
      },
      TableName: this.tableName,
    };

    const response = await this.dynamodb.get(query);
    return unpack(response.Item);
  }

  async getUser(params) {
    const query = {
      TableName: this.tableName,
      KeyConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: params.possessor },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    const response = await this.dynamodb.query(query);
    return response.Items.map(unpack);
  }

  async getByEmail(params) {
    const query = {
      TableName: this.tableName,
      FilterExpression: 'Email = :email',
      ExpressionAttributeValues: {
        ':email': { S: params.email },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    const response = await this.dynamodb.scan(query);
    return response.Items.map(unpack).map((item) => {
      return { userId: item.userId };
    });
  }

  async getByClientId(params) {
    const query = {
      TableName: this.tableName,
      FilterExpression: 'ClientId = :clientId',
      ExpressionAttributeValues: {
        ':clientId': { S: params.clientId },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    const response = await this.dynamodb.scan(query);
    return response.Items.map(unpack);
  }

  async delete(params) {
    const q = {
      TableName: this.tableName,
      Key: {
        UserId: { S: params.id },
        Possessor: { S: params.possessor },
      },
      ConditionExpression: 'Possessor = :possessor',
      ExpressionAttributeValues: {
        ':possessor': { S: params.possessor },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    };

    const response = await this.dynamodb.delete(q);
    return response;
  }
}

module.exports = Users;
