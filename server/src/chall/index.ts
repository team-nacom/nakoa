import Router from 'koa-router';
import { idText } from 'typescript';

import Chall from '../models/chall';

const router = new Router();

// NOTE: exclude _id?
router.get('/', async (ctx) => {
  try {
    ctx.body = await Chall.find(
      { isPublic: true }, // return only public challs
      'index name'        // project index & name fields only
    ).exec();
  } catch (err) {
    return ctx.throw(500, err);
  }
});

router.get('/:index', async (ctx, next) => {
  const index = ctx.params.index;
  try {
    ctx.body = await Chall.find(
      {
        index: index,
        isPublic: true,
      },
      '-isPublic'
    ).exec();
  } catch (err) {
    return ctx.throw(500, err);
  }
  next();
});


export default router;