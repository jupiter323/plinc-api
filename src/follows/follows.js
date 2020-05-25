const Dynamo = require('../dynamo');

const schema = {
  Possessor: 'S',
  FollowUser: 'S',
};

const pack = Dynamo.pack(schema);
const unpack = Dynamo.unpack(schema);

class Follows {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new Dynamo();
  }

  follows(props) {
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  async create(params) {
    const follow = this.follows({
      ...params,
    });
    await this.dynamodb.put(follow);
    return { possessor: params.possessor };
  }

  async getAll(params) {
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

  async getByFollowUser(params) {
    const query = {
      TableName: this.tableName,
      FilterExpression: 'FollowUser = :followUser',
      ExpressionAttributeValues: {
        ':followUser': { S: params.followUser },
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
        FollowUser: { S: params.followUser },
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

module.exports = Follows;
