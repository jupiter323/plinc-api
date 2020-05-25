const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');

mergeImages(
  [
    {
      src:
        'https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Ajohnlewis.scene7.com%2Fis%2Fimage%2FJohnLewis%2F000384739alt3%3F%24fash_product%24&feedId=1203&k=5e4d047c4ee0e25070b417c2a271867397320d9f',
      x: 0,
      y: 0,
    },
    {
      src:
        'https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Ajohnlewis.scene7.com%2Fis%2Fimage%2FJohnLewis%2F000384739alt3%3F%24fash_product%24&feedId=1203&k=5e4d047c4ee0e25070b417c2a271867397320d9f',
      x: 204,
      y: 0,
    },
  ],
  { Canvas, Image, width: 404, height: 200 },
)
  .then((src) => console.log('image 2 merged :', src))
  .catch((err) => console.log('image 2 merged :', err));
