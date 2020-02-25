const uuid = require('uuid');
const Dynamo = require('../dynamo');

const schema = {
  PromotionID: 'S',
  AdvertiserID: 'S',
};

const pack = Dynamo.pack(schema);
const unpack = Dynamo.unpack(schema);

class Vouchers {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new Dynamo();
  }

  voucher(props) {
    return {
      TableName: this.tableName,
      Item: pack(props),
      ReturnConsumedCapacity: 'TOTAL',
    };
  }

  async create(params) {
    const PromotionID = uuid.v4();
    const AdvertiserID = '612219';
    const voucher = this.voucher({
      ...params,
      PromotionID,
      AdvertiserID,
    });
    await this.dynamodb.put(voucher);
    return { PromotionID };
  }

  async get(params) {
    const query = {
      Key: {
        PromotionID: {
          S: params.id,
        },
        AdvertiserID: {
          S: params.advertiserID,
        },
      },
      TableName: this.tableName,
    };

    const response = await this.dynamodb.get(query);
    return unpack(response.Item);
  }

  async getAll(params) {
    const query = {
      TableName: this.tableName,
      KeyConditionExpression: 'AdvertiserID = :advertiserID',
      ExpressionAttributeValues: {
        ':advertiserID': { S: params.advertiserID },
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    const response = await this.dynamodb.query(query);
    return response.Items.map(unpack);
  }
}

module.exports = Vouchers;
