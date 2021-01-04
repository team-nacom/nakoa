import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import mongoose from 'mongoose';

import chall from './chall';

// connect to local mongoDB
mongoose.connect('mongodb://localhost/nacom', {
  useNewUrlParser: true,   // new parser (old parser is deprecated)
  useUnifiedTopology: true // new connection management engine
}).then(res => {
  console.log("Successfully connected to mongodb on localhost/nacom");
}).catch(err => {
  console.error(err);
  throw err;
});


// Router
const router = new Router();

// Root (not used)
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
});

// Challenges
router.use('/chall', chall.routes());


// Koa app
const app = new Koa();
app.use(Logger());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3885);