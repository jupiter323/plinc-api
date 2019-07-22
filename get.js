const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const Lists = require('./src/lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists.get({ owner: "013", id: "376a0966-be7e-4110-ac72-7dbeb7818661" }).then(response => {
  console.log('Found', response);
}).catch(err => {
  console.log('Error', err);
});

