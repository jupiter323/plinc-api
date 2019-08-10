const test = require('tape');
const axios = require('axios');
const cognito = require('./cognito');

axios.defaults.headers.post['Content-Type'] = 'application/json';

const { API_URL } = process.env;

test('UnAuthenticated', (t) => {
  t.plan(2);

  axios.get(`${API_URL}/lists/possessor/id`).catch((err) => {
    t.equal(err.response.status, 401, 'should be 401');
    t.equal(err.response.data.message, 'Unauthorized', 'message should be Unauthorized');
  });
});

const withLoggedInUser = (fn, done, error) => {
  cognito.generateUser().then(({ user, token }) => {
    fn(user, token)
      .then(() => {
        cognito.deleteUser({ Username: user.username }).then(() => {
          done();
        });
      })
      .catch((err) => {
        cognito.deleteUser({ Username: user.username }).then(() => {
          error(err);
        });
      });
  });
};

const createList = (token) => () =>
  axios({
    method: 'POST',
    url: `${API_URL}/lists`,
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
    data: {
      title: 'Test',
      description: 'Integration Test List',
      category: 'Integration',
      public: true,
    },
  });

const createItem = (token) => (listId) =>
  axios({
    method: 'POST',
    url: `${API_URL}/items`,
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
    data: {
      listId,
      price: 12.5,
      description: 'Integration Test Item',
    },
  });

test('Create & Retrieve List', (t) => {
  t.plan(11);

  withLoggedInUser(
    (user, token) => {
      return createList(token)().then((res) => {
        t.equal(res.status, 201, 'should be 201');
        t.equal(res.statusText, 'Created', 'should be Created');
        t.ok(res.data.listId, 'has list id');

        axios({
          method: 'GET',
          url: `${API_URL}/lists/${user.username}/${res.data.listId}`,
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
        }).then((response) => {
          t.equal(response.status, 200, 'should be 200');
          t.equal(response.data.title, 'Test', 'Title should be set');
          t.equal(response.data.description, 'Integration Test List', 'Description should be set');
          t.equal(response.data.category, 'Integration', 'Category should be set');
          t.equal(response.data.public, true, 'Public should be set');
          t.equal(response.data.noOfItems, '0', 'No items should be added');
          t.equal(response.data.price, '0', 'Price should be 0');
        });
      });
    },
    () => t.pass('DONE!'),
    (err) => t.fail(err.response.statusText),
  );
});

test('Retrieve all lists for user', (t) => {
  t.plan(3);

  withLoggedInUser(
    (user, token) => {
      const create = createList(token);
      return Promise.all([create(), create(), create()]).then(() => {
        axios({
          method: 'GET',
          url: `${API_URL}/lists`,
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
        }).then((res) => {
          t.equal(res.status, 200, 'should be 200');
          t.equal(res.data.length, 3, 'should return all lists');
        });
      });
    },
    () => t.pass('DONE!'),
    (err) => t.fail(err.response.statusText),
  );
});

test('Add item to a list', (t) => {
  t.plan(2);

  withLoggedInUser(
    (user, token) => {
      return createList(token)().then((listResponse) => {
        createItem(token)(listResponse.data.listId).then(() => {
          setTimeout(() => {
            axios({
              method: 'GET',
              url: `${API_URL}/lists/${user.username}/${listResponse.data.listId}`,
              headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
            }).then((res) => {
              t.equal(res.data.noOfItems, '1', 'Increments NoOfItems when new item created');
            });
          }, 2000);
        });
      });
    },
    () => t.pass('DONE!'),
    (err) => t.fail(err.response.statusText),
  );
});
