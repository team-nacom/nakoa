import Router from 'koa-router';

import Guide from '../models/guide';
import Gory from '../models/gory';
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
  const nickname = ctx.state.user.nickname;
  if(!(isAdmin(ctx) || ("authors" in guideObj && guideObj.authors[0] === nickname)))
    throw createHttpError(401, "Only admin and the author can change authors");
  await updateOneGuide(ctx.request.body, index, ctx.state.user);
  ctx.body = "Success";
});

// Get list of guides
router.get('/', async (ctx) => {
  // TODO: show drafts of their own, and hide if not
  const name: string = ctx.state.user.nickname ?? null;

  const filter = (isAdmin(ctx) ? {} : {$or: [{isPublic: true}, {authors:{$elemMatch: {$eq: name}}}]}); 
  const query = Guide.find(filter).select('index name cate gory priority');
  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific guide with given index
router.get('/:index(\\d+)', async (ctx) => {
  const index = ctx.params.index;
  const name: string = ctx.state.user.nickname ?? null;

  let filter: any = (isAdmin(ctx) ? {} : {$or: [{isPublic: true}, {authors:{$elemMatch: {$eq: name}}}]});
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
router.delete('/:index(\\d+)', isVerifiedMiddleware, async (ctx) => {
  const index = ctx.params.index;
  const doc = await Guide.findOne({ index: index });
  if(doc != null){
    await Guide.deleteOne({ index: index });
    //@ts-ignore
    await Gory.onDeleteGuide(doc);
  }
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
