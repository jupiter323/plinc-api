const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamodb = new AWS.DynamoDB();

const list = (props) => ({
    "TableName": process.env.LISTS_TABLE_NAME,
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
    headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
    body: JSON.stringify({'message': 'Hello from API'})
  });
};

module.exports.create = (event, context, callback) => {
  const listId = uuid.v4();
  dynamodb.putItem(list({
    owner: "003",
    listId,
    title: "Title",
    description: "Description",
    category: "Category",
    public: true
  })).promise().then((response) => {
    console.log('response: ', response);

    callback(null, {
      statusCode: 201,
      headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
      body: JSON.stringify({'listId': listId})
    });
  }).catch(err => {
    callback(err, {
      statusCode: 500,
      headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
      body: JSON.stringify({'error': err})
    });
  });
};

module.exports.get = (event, context, callback) => {
  var params = {
    Key: {
      "listId": {
        S: event['pathParameters']['listId']
      }
    },
    TableName: process.env.LISTS_TABLE_NAME
  };

  dynamodb.getItem(params).promise().then((response) => {
    console.log('response: ', response);

    callback(null, {
      statusCode: 200,
      headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
      body: JSON.stringify(response)
    });
  }).catch(err => {
    callback(err, {
      statusCode: 500,
      headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': true, 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*'},
      body: JSON.stringify({'error': err})
    });
  });
};
