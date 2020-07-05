const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('@koa/router');
const router = new Router();

const subscribers = new Set();

router.get('/subscribe', async (ctx, next) => {
  const subscriber = new Promise((resolve, reject) => {
    subscribers.add(resolve);

    app.on('error', (err) => {
      subscribers.delete(resolve);
      reject(err);
    });
  });

  try {
    const message = await subscriber;

    ctx.response.status = 200;
    ctx.response.body = message;
  } catch (e) {
    throw e;
  }
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    subscribers.forEach((subscriber) => {
      subscriber(message);
    });

    subscribers.clear();

    ctx.response.status = 200;
    ctx.response.body = message;
  }
});

app.use(router.routes());

module.exports = app;
