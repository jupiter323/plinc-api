const AWS = require('aws-sdk');
const uuid = require('uuid');

class Lists {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamodb = new AWS.DynamoDB();
  }

  list (props) {
    const item = {
      "Owner": {"S": props.owner},
      "ListId": {"S": props.listId},
    };

    if(props.title) {
      item["Title"] = { "S": props.title };
    }

    if(props.description) {
      item["Description"] = { "S": props.description };
    }

    if(props.category) {
      item["Category"] = { "S": props.category };
    }

    if(!!props.public) {
      item["public"] = { "BOOL": props.public };
    }

    return {
      "TableName": this.tableName,
      "Item": item,
      "ReturnConsumedCapacity": "TOTAL"
    };
  }

  create(params) {
    const listId = uuid.v4();
    return new Promise((resolve, reject) => {
      const createParams = {
        listId,
        owner: params.owner
      };

      console.log('createParams', createParams);
      this.dynamodb.putItem(this.list(createParams)).promise().then(() => {
        resolve(JSON.stringify({'listId': listId}));
      }).catch(err => {
        reject(JSON.stringify({'error': err}));
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
        response = response["Item"];

        const result = {};

        result["ListId"] = response["ListId"]["S"];
        result["Owner"] = response["Owner"]["S"];

        if(response["Title"]) {
          result["Title"] = response["Title"]["S"];
        }

        if(response["Description"]) {
          result["Description"] = response["Description"]["S"];
        }

        if(response["Public"]) {
          result["Public"] = response["Public"]["BOOL"];
        }

        if(response["Category"]) {
          result["Category"] = response["Category"]["S"];
        }

        resolve(JSON.stringify(result));
      }).catch(err => {
        reject(JSON.stringify({'error': err}));
      });
    });
  }
}

module.exports = Lists;
