const test = require('tape');
const request = require('request');

const API_URL = process.env['API_URL'];

const get = (path, fn) => request(`${API_URL}/${path}`, { json: true }, fn);

test('Authentication', function (t) {
  t.plan(2);

  get('hello', (err, res, body) => {
    t.equal(res.statusCode, 401, 'should be 401');
    t.equal(body.message, 'Unauthorized', 'message should be Unauthorized');
  });
});
