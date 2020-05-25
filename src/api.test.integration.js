/* eslint-disable import/no-extraneous-dependencies */

const test = require('tape');
const axios = require('axios');
// const cognito = require('./cognito');

axios.defaults.headers.post['Content-Type'] = 'application/json';

const { API_URL } = process.env;

test('UnAuthenticated', (t) => {
  t.plan(2);

  axios.get(`${API_URL}/lists/id`).catch((err) => {
    t.equal(err.response.status, 401, 'should be 401');
    t.equal(err.response.data.message, 'Unauthorized', 'message should be Unauthorized');
  });
});

// const withLoggedInUser = (fn, done, error) => {
//   cognito.generateUser().then(({ user, token }) => {
//     fn(user, token)
//       .then(() => {
//         cognito.deleteUser({ Username: user.username }).then(() => {
//           done();
//         });
//       })
//       .catch((err) => {
//         cognito.deleteUser({ Username: user.username }).then(() => {
//           error(err);
//         });
//       });
//   });
// };

// const createList = (token) => () =>
//   axios({
//     method: 'POST',
//     url: `${API_URL}/lists`,
//     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//     data: {
//       title: 'Test',
//       description: 'Integration Test List',
//       category: 'Integration',
//       public: true,
//     },
//   });

// const createItem = (token) => (listId) => (price) =>
//   axios({
//     method: 'POST',
//     url: `${API_URL}/items`,
//     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//     data: {
//       listId,
//       price,
//       description: 'Integration Test Item',
//     },
//   });

// const deleteItem = (token) => (listId) => (itemId) =>
//   axios({
//     method: 'DELETE',
//     url: `${API_URL}/list/${listId}/items/${itemId}`,
//     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//   });

// const deleteList = (token) => (listId) =>
//   axios({
//     method: 'DELETE',
//     url: `${API_URL}/lists/${listId}`,
//     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//   });

// test('Create & Retrieve List', (t) => {
//   t.plan(11);

//   withLoggedInUser(
//     (user, token) => {
//       return createList(token)().then((res) => {
//         t.equal(res.status, 201, 'should be 201');
//         t.equal(res.statusText, 'Created', 'should be Created');
//         t.ok(res.data.listId, 'has list id');

//         axios({
//           method: 'GET',
//           url: `${API_URL}/lists/${res.data.listId}`,
//           headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//         }).then((response) => {
//           t.equal(response.status, 200, 'should be 200');
//           t.equal(response.data.title, 'Test', 'Title should be set');
//           t.equal(response.data.description, 'Integration Test List', 'Description should be set');
//           t.equal(response.data.category, 'Integration', 'Category should be set');
//           t.equal(response.data.public, true, 'Public should be set');
//           t.equal(response.data.noOfItems, '0', 'No items should be added');
//           t.equal(response.data.price, '0', 'Price should be 0');
//         });
//       });
//     },
//     () => t.pass('DONE!'),
//     (err) => t.fail(err.response.statusText),
//   );
// });

// test('Retrieve all lists for user', (t) => {
//   t.plan(3);

//   withLoggedInUser(
//     (user, token) => {
//       const create = createList(token);
//       return Promise.all([create(), create(), create()]).then(() => {
//         axios({
//           method: 'GET',
//           url: `${API_URL}/lists`,
//           headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//         }).then((res) => {
//           t.equal(res.status, 200, 'should be 200');
//           t.equal(res.data.length, 3, 'should return all lists');
//         });
//       });
//     },
//     () => t.pass('DONE!'),
//     (err) => t.fail(err.response.statusText),
//   );
// });

// test('Add item to a list', (t) => {
//   t.plan(3);

//   withLoggedInUser(
//     (user, token) => {
//       return createList(token)().then((listResponse) => {
//         const create = createItem(token)(listResponse.data.listId);
//         Promise.all([create(12), create(12.5)]).then(() => {
//           setTimeout(() => {
//             axios({
//               method: 'GET',
//               url: `${API_URL}/lists/${listResponse.data.listId}`,
//               headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//             }).then((res) => {
//               t.equal(res.data.noOfItems, '2', 'Increments NoOfItems when new item created');
//               t.equal(
//                 res.data.price,
//                 '24.5',
//                 'Increments Price by item price when new item created',
//               );
//             });
//           }, 2000);
//         });
//       });
//     },
//     () => t.pass('DONE!'),
//     (err) => t.fail(err.response.statusText),
//   );
// });

// test('Add item to a list', (t) => {
//   t.plan(3);

//   withLoggedInUser(
//     (user, token) => {
//       return createList(token)().then((listResponse) => {
//         const create = createItem(token)(listResponse.data.listId);
//         Promise.all([create(12), create(12.5)]).then(() => {
//           setTimeout(() => {
//             axios({
//               method: 'GET',
//               url: `${API_URL}/lists/${listResponse.data.listId}`,
//               headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//             }).then((res) => {
//               t.equal(res.data.noOfItems, '2', 'Increments NoOfItems when new item created');
//               t.equal(
//                 res.data.price,
//                 '24.5',
//                 'Increments Price by item price when new item created',
//               );
//             });
//           }, 2000);
//         });
//       });
//     },
//     () => t.pass('DONE!'),
//     (err) => t.fail(err.response.statusText),
//   );
// });

// test('Remove item from a list', (t) => {
//   t.plan(3);

//   withLoggedInUser(
//     (user, token) => {
//       return createList(token)().then((listResponse) => {
//         const { listId } = listResponse.data;
//         const create = createItem(token)(listId);
//         Promise.all([create(12), create(12)]).then((createResponse) => {
//           const { itemId } = createResponse[0].data;
//           setTimeout(() => {
//             Promise.all([deleteItem(token)(listId)(itemId)])
//               .then(() => {
//                 setTimeout(() => {
//                   axios({
//                     method: 'GET',
//                     url: `${API_URL}/lists/${listResponse.data.listId}`,
//                     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//                   }).then((res) => {
//                     t.equal(res.data.noOfItems, '1', 'Decrements NoOfItems when item deleted');
//                     t.equal(
//                       res.data.price,
//                       '12',
//                       'Decrements Price by item price when new item deleted',
//                     );
//                   });
//                 }, 2000);
//               }, 2000)
//               .catch((err) => {
//                 console.log(err);
//               });
//           }, 2000);
//         });
//       });
//     },
//     () => t.pass('DONE!'),
//     (err) => t.fail(err),
//   );
// });

// test('Remove list', (t) => {
//   t.plan(3);

//   withLoggedInUser(
//     (user, token) => {
//       return createList(token)().then((listResponse) => {
//         const { listId } = listResponse.data;
//         const create = createItem(token)(listId);
//         Promise.all([create(12), create(12)]).then(() => {
//           setTimeout(() => {
//             Promise.all([deleteList(token)(listId)])
//               .then(() => {
//                 setTimeout(() => {
//                   axios({
//                     method: 'GET',
//                     url: `${API_URL}/lists/${listId}`,
//                     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//                   }).then((res) => {
//                     t.looseEqual(res.data, {}, 'No list found');
//                   });
//                 }, 2000);

//                 setTimeout(() => {
//                   axios({
//                     method: 'GET',
//                     url: `${API_URL}/list/${listId}/items`,
//                     headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
//                   }).then((res) => {
//                     t.looseEqual(res.data, {}, 'No item found');
//                   });
//                 }, 2000);
//               }, 2000)
//               .catch((err) => {
//                 console.log(err);
//               });
//           }, 2000);
//         });
//       });
//     },
//     () => t.pass('DONE!'),
//     (err) => t.fail(err),
//   );
// });
