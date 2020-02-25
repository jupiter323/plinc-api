const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const Vouchers = require('../vouchers');

const vouchers = new Vouchers(process.env.VOUCHERS_TABLE_NAME);

vouchers
  .create({ id: '013', advertiserID: '23232' })
  .then((response) => {
    console.log('Created', response);
  })
  .catch((err) => {
    console.log('Error', err);
  });
