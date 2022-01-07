import Router from 'koa-router';

import Guide, { GuideDocument } from '../models/guide';
import { postOneGuide } from "./poster";
import createHttpError from 'http-errors';

const router = new Router();

// Post a guide (manual)
router.post('/', async (ctx) => {
  const guide = await postOneGuide(ctx.request.body, ctx.state.user);
  ctx.body = {
    index: guide.index,
  };
});

// Get list of guides
router.get('/', async (ctx) => {
  // TODO: show drafts of their own, and hide if not
  const page: number = +ctx.query.page! || 1;
  const per: number = +ctx.query.per! || 20;
  const keyword = ctx.query.tag;
  const filter = {}
  const filter2 = (keyword ? {tags: keyword} : {});
  const query = Guide.find({
    $and:[filter, filter2]},
    null, {
    skip: (page - 1) * per,
    limit: per,
  })
  .sort({ createDate: -1 })
  .select('index name content authors tags createDate');

  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific guide with given index
router.get('/:index(\\d+)', async (ctx) => {
  const index = ctx.params.index;

  let filter: any = {}
  filter.index = index;

  const query = Guide.find(filter);

  await query.findOne().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});


export default router;
