import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import mongoose from 'mongoose';

import chall from './chall';

// connect to db
mongoose.connect('mongodb://localhost/nacom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(res => {
  console.log("Successfully connected to mongodb on localhost/nacom !");
})
.catch(err => {
  console.error(err);
});

// Koa app
const app = new Koa();
app.use(Logger());

// router
const router = new Router();
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
});
// Challenges
router.use('/chall', chall.routes());

// main app
app.use(router.routes()).use(router.allowedMethods());

app.listen(3885);