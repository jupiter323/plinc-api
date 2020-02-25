const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Vouchers = require('../vouchers');

const vouchers = new Vouchers(process.env.VOUCHERS_TABLE_NAME);

vouchers
  .getAll({ advertiserID: '612219' })
  .then((response) => {
    console.log('Found', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
