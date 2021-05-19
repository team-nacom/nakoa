import Router from 'koa-router';

import Guide from '../models/guide';
import { isAdmin, checkAdminMiddleware } from "../utils";
import { postOneGuide, updateOneGuide } from "./poster";
import createHttpError from 'http-errors';

const router = new Router();

// Post a guide (manual)
router.post('/', checkAdminMiddleware, async (ctx) => {
  const guide = await postOneGuide(ctx.request.body);
  ctx.body = {
    index: guide.index,
  };
});

// Update an existing guide
router.put('/:index(\\d+)', checkAdminMiddleware, async (ctx) => {
  const index: number = Number.parseInt(ctx.params.index);
  const guideObj = ctx.request.body;
  if(!isAdmin(ctx) && "authors" in guideObj) throw createHttpError(401, "Only admin can change authors");
  await updateOneGuide(ctx.request.body, index);
  ctx.body = "Success";
});

// Get list of guides
router.get('/', async (ctx) => {
  const filter = (isAdmin(ctx) ? {} : { isPublic: true }); // show all for admin
  const query = Guide.find(filter).select('index name category section priority');
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
router.delete('/:index(\\d+)', checkAdminMiddleware, async (ctx) => {
  const index = ctx.params.index;
  await Guide.deleteOne({ index });
  ctx.body = "Success";
})


export default router;
