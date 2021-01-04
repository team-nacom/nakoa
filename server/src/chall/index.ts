import Router from 'koa-router';

import Chall from '../models/chall';

const router = new Router();

router.get('/', async (ctx) => {
  try {
    ctx.body = await Chall.find(
      { isPublic: true }, // return only public challs
      'index name'        // project index & name fields only
    ).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }
});

export default router;