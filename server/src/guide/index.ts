import Router from 'koa-router';

import Guide from '../models/guide';
import { isAdmin, checkAdminMiddleware, isVerifiedMiddleware } from "../utils";
import { postOneGuide, updateOneGuide } from "./poster";
import createHttpError from 'http-errors';

const router = new Router();

// Post a guide (manual)
router.post('/', isVerifiedMiddleware, async (ctx) => {
  const guide = await postOneGuide(ctx.request.body);
  ctx.body = {
    index: guide.index,
  };
});

// Update an existing guide
router.put('/:index(\\d+)', isVerifiedMiddleware, async (ctx) => {
  const index: number = Number.parseInt(ctx.params.index);
  const guideObj = ctx.request.body;
  if(!isAdmin(ctx) && "authors" in guideObj) throw createHttpError(401, "Only admin can change authors");
  await updateOneGuide(ctx.request.body, index, ctx.state.user);
  ctx.body = "Success";
});

// Get list of guides
router.get('/', async (ctx) => {
  // TODO: show drafts of their own, and hide if not
  const filter = (isAdmin(ctx) ? {} : { isPublic: true }); // show all for admin
  const query = Guide.find(filter).select('index name cate gory priority');
  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific guide with given index
router.get('/:index(\\d+)', async (ctx) => {
  const index = ctx.params.index;

  let filter: any = (isAdmin(ctx) ? {} : { isPublic: true }); // show all for admin
  filter.index = index;

  const query = Guide.find(filter);

  await query.findOne().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});

// Delete a post with given index
// for now, only admin can erase
router.delete('/:index(\\d+)', checkAdminMiddleware, async (ctx) => {
  const index = ctx.params.index;
  await Guide.deleteOne({ index });
  ctx.body = "Success";
})

// Get list of all categories
router.get('/category', async (ctx) => {
  ctx.body = await Guide.distinct('cate');
});

// Get list of all sections in given category
router.get('/category/:name', async (ctx) => {
  ctx.body = await Guide.distinct('gory', { cate: ctx.params.name });
});


export default router;
