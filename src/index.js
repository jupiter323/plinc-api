const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamodb = new AWS.DynamoDB();

const tableName = process.env.LISTS_TABLE_NAME;
const headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'};

const list = (props) => ({
    "TableName": tableName,
    "Item": {
      "Owner": {"S": props.owner},
      "ListId": {"S": props.listId},
      "Title": {"S": props.title},
      "Description": {"S": props.description},
      "Category": {"S": props.category},
      "Public": {"BOOL": props.public}
    },
    "ReturnConsumedCapacity": "TOTAL"
  });

module.exports.handler = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    headers,
    body: JSON.stringify({'message': 'Hello from API'})
  });
};

module.exports.create = (event, context, callback) => {
  if (event.body !== null && event.body !== undefined) {
    let body = JSON.parse(event.body);

    console.log('body');

    const listId = uuid.v4();
    dynamodb.putItem(list({
      listId,
      owner: body.owner,
      title: body.title,
      description: body.description || '',
      category: body.category || '',
      public: !!body.public || true
    })).promise().then(() => {
      callback(null, {
        statusCode: 201,
        headers,
        body: JSON.stringify({'listId': listId})
      });
    }).catch(err => {
      callback(err, {
        statusCode: 500,
        headers,
        body: JSON.stringify({'error': err})
      });
    });
  }
};

module.exports.get = (event, context, callback) => {
  const params = {
    Key: {
      "ListId": {
        S: event['pathParameters']['id']
      },
      "Owner": {
        S: event['pathParameters']['owner']
      }
    },
    TableName: tableName
  };

  dynamodb.getItem(params).promise().then((response) => {
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    });
  }).catch(err => {
    callback(err, {
      statusCode: 500,
      headers,
      body: JSON.stringify({'error': err})
    });
  });
};
