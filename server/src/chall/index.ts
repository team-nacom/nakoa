import Router from 'koa-router';

import Chall from '../models/chall';

const router = new Router();

// NOTE: exclude _id from projection?
// Get list of published challenges
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

// Get specific challenge with given index
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
    // TODO if chall is not found
  } catch (err) {
    return ctx.throw(500, err);
  }
  next();
});


export default router;