import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';

const app = new Koa();

// logger
const logger = new Logger();
app.use(logger);

// router
const router = new Router();
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
});

// main app
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);