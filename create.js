const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const Lists = require('./src/lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists.create({ owner: "011", title: "Phoenix" }).then(response => {
  console.log('Created', response);
}).catch(err => {
  console.log('Error', err);
});

