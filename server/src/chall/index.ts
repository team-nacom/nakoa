import Router from 'koa-router';

import Chall from '../models/chall';

const router = new Router();

// NOTE: exclude _id from projection?
// Get list of published challenges
router.get('/', async (ctx) => {
  const query = Chall.find({ isPublic: true }).select('index name solveCount');
  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific challenge with given index
router.get('/:index', async (ctx) => {
  const index = ctx.params.index;

  const filter = {
    index: index,
    isPublic: true
  };
  const query = Chall.find(filter).select('-isPublic');

  await query.findOne().lean().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});


export default router;