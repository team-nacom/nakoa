import Router from 'koa-router';

const chall = new Router();

chall.get('/', async (ctx, next) => {
  ctx.body = {
    "status": "success",
    "json": {
      "id": "ASD"
    }
  };
  await next();
});

export default chall;