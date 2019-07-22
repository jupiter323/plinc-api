const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

const Lists = require('./src/lists');

const lists = new Lists(process.env.LISTS_TABLE_NAME);

lists.get({ owner: "003", id: "03439a54-163c-4f0c-a588-12c9a7a25fae" }).then(response => {
  console.log('Found', response);
}).catch(err => {
  console.log('Error', err);
});

