const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const Lists = require('../lists/lists');
const Items = require('../items/items');

const lists = new Lists(process.env.LISTS_TABLE_NAME);
const items = new Items(process.env.ITEMS_TABLE_NAME);

module.exports.handler = (event, context, callback) => {
  try {
    event.Records.forEach(async (record) => {
      if (record.eventName === 'INSERT' && record.eventSource === 'aws:dynamodb') {
        const listId = record.dynamodb.Keys.ListId.S;
        const possessor = record.dynamodb.NewImage.Possessor.S;
        const price = record.dynamodb.NewImage.Price.N;

        try {
          await lists.increment({ possessor, id: listId, price });
        } catch {
          console.log('No List');
        }

        try {
          const list = await lists.get({ possessor, id: listId });
          const itemsByListId = await items.getAll({ listId });
          if (+list.noOfItems === 1) list.image = itemsByListId[0].largeImage;
          else if (+list.noOfItems === 2) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=152&h=225'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=144&h=225'),
                  x: 156,
                  y: 0,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          } else if (+list.noOfItems === 3) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=148&h=225'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=148&h=111'),
                  x: 152,
                  y: 0,
                },
                {
                  src: itemsByListId[2].image.concat('&w=148&h=110'),
                  x: 152,
                  y: 115,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          } else if (+list.noOfItems === 4) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=148&h=146'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=148&h=75'),
                  x: 0,
                  y: 150,
                },
                {
                  src: itemsByListId[2].image.concat('&w=148&h=84'),
                  x: 152,
                  y: 0,
                },
                {
                  src: itemsByListId[3].image.concat('&w=148&h=137'),
                  x: 152,
                  y: 88,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          } else if (+list.noOfItems === 6) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=96&h=135'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=96&h=86'),
                  x: 0,
                  y: 139,
                },
                {
                  src: itemsByListId[2].image.concat('&w=100&h=86'),
                  x: 100,
                  y: 0,
                },
                {
                  src: itemsByListId[3].image.concat('&w=100&h=135'),
                  x: 100,
                  y: 90,
                },
                {
                  src: itemsByListId[4].image.concat('&w=96&h=136'),
                  x: 204,
                  y: 0,
                },
                {
                  src: itemsByListId[5].image.concat('&w=96&h=85'),
                  x: 204,
                  y: 140,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          }
          await lists.update(list);
        } catch {
          console.log('Failed image mapping');
        }
      } else if (record.eventName === 'REMOVE' && record.eventSource === 'aws:dynamodb') {
        const listId = record.dynamodb.Keys.ListId.S;
        const possessor = record.dynamodb.OldImage.Possessor.S;
        const price = record.dynamodb.OldImage.Price.N;

        try {
          await lists.decrement({ possessor, id: listId, price });
        } catch {
          console.log('No List');
        }

        try {
          const list = await lists.get({ possessor, id: listId });
          const itemsByListId = await items.getAll({ listId });
          if (+list.noOfItems === 0) delete list.image;
          else if (+list.noOfItems === 1) list.image = itemsByListId[0].largeImage;
          else if (+list.noOfItems === 2) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=152&h=225'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=144&h=225'),
                  x: 156,
                  y: 0,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          } else if (+list.noOfItems === 3) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=148&h=225'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=148&h=111'),
                  x: 152,
                  y: 0,
                },
                {
                  src: itemsByListId[2].image.concat('&w=148&h=110'),
                  x: 152,
                  y: 115,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          } else if (+list.noOfItems === 5) {
            const mergedImage = await mergeImages(
              [
                {
                  src: itemsByListId[0].image.concat('&w=148&h=146'),
                  x: 0,
                  y: 0,
                },
                {
                  src: itemsByListId[1].image.concat('&w=148&h=75'),
                  x: 0,
                  y: 150,
                },
                {
                  src: itemsByListId[2].image.concat('&w=148&h=84'),
                  x: 152,
                  y: 0,
                },
                {
                  src: itemsByListId[3].image.concat('&w=148&h=137'),
                  x: 152,
                  y: 88,
                },
              ],
              { Canvas, Image, width: 300, height: 225 },
            );
            list.image = mergedImage;
          }
          await lists.update(list);
        } catch {
          console.log('Failed image mapping');
        }
      }
    });
    callback(null, 'done');
  } catch (err) {
    callback(err, 'done');
  }
};
