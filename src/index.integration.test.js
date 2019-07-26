const test = require('tape');
const request = require('request');
const axios = require('axios');
const cognito = require('./cognito');

axios.defaults.headers.post['Content-Type'] = 'application/json';

const API_URL = process.env['API_URL'];

const get = (path, fn) => request(`${API_URL}/${path}`, { json: true }, fn);

test('UnAuthentication', (t) => {
  t.plan(2);

  get('lists/owner/id', (err, res, body) => {
    t.equal(res.statusCode, 401, 'should be 401');
    t.equal(body.message, 'Unauthorized', 'message should be Unauthorized');
  });
});

test('Authenticated', (t) => {
  t.plan(9);

  cognito.generateUser().then(({user, token}) => {
    axios({
      method: 'POST',
      url: `${API_URL}/lists`,
      headers: {'Authorization': `Bearer ${token}`, 'accept': 'application/json' },
      data: {
        "title": "Test",
        "description": "Integration Test List",
        "category": "Integration",
        "public": true
      }
    }).then(res => {
      t.equal(res.status, 201, 'should be 201');
      t.equal(res.statusText, 'Created', 'should be Created');
      t.ok(res.data.listId, 'has list id');

      axios({
        method: 'GET',
        url: `${API_URL}/lists/${user.username}/${res.data.listId}`,
        headers: {'Authorization': `Bearer ${token}`, 'accept': 'application/json' }
      }).then(res => {
        t.equal(res.status, 200, 'should be 200');
        t.equal(res.data.Title, 'Test');
        t.equal(res.data.Description, 'Integration Test List');
        t.equal(res.data.Category, 'Integration');
        t.equal(res.data.Public, true);
      });

      cognito.deleteUser({ Username: user.username }).then(() => {
        t.pass('DONE!');
      });
    }).catch(err => {
      cognito.deleteUser({ Username: user.username }).then(() => {
        t.fail(err.response.statusText);
      });
    });
  });

});
