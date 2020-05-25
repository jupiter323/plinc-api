const uuid = require('uuid');
const Dynamo = require('../dynamo');

const schema = {
  Possessor: 'S',
  DownVoteId: 'S',
};

const pack = Dynamo.pack(schema);
const unpack = Dynamo.unpack(schema);

class DownVotes {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new Dynamo();
  }

  downVote(props) {
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  async create(params) {
    const downVoteId = uuid.v4();
    const downVote = this.downVote({
      downVoteId,
      ...params,
    });
    await this.dynamodb.put(downVote);
    return { downVoteId: params.downVoteId || downVoteId };
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

  async delete(params) {
    const q = {
      TableName: this.tableName,
      Key: {
        DownVoteId: { S: params.id },
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

module.exports = DownVotes;
