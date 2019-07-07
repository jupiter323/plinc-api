var test = require('tape');

test('timing test', function (t) {
  console.log('URL:', process.env['API_URL']);

  t.plan(1);

  t.equal(1, 1);
});
