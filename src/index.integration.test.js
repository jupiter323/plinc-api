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
  t.plan(4);

  cognito.generateUser().then(({user, token}) => {
    axios({
      method: 'POST',
      url: `${API_URL}/lists`,
      headers: {'Authorization': `Bearer ${token}`, 'accept': 'application/json' },
      data: {
        "title": "Title",
        "description": "Description",
        "category": "Category",
        "public": true
      }
    }).then(res => {
      t.equal(res.status, 201, 'should be 201');
      t.equal(res.statusText, 'Created', 'should be Created');
      t.ok(res.data.listId, 'has list id');

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
