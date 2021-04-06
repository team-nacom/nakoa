import Router from 'koa-router';

import Guide from '../models/guide';
import { isAdmin, checkAdminMiddleware } from "../utils";
import { postOneGuide, updateOneGuide } from "./poster";
import createHttpError from 'http-errors';

const router = new Router();

// Post a guide (manual)
router.post('/', checkAdminMiddleware);
router.post('/', async (ctx) => {
  await postOneGuide(ctx.request.body);
  ctx.body = "Success";
});

// Update an existing guide
router.put('/:index(\\d+)', checkAdminMiddleware);
router.put('/:index(\\d+)', async (ctx) => {
  const index: number = Number.parseInt(ctx.params.index);
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

router.delete('/:index(\\d+)', async (ctx) => {
  if (!isAdmin(ctx)) {
    ctx.throw(401);
    return;
  }

  const index: number = ctx.params.index;
  await Guide.deleteOne({ isPublic: true, index });
  ctx.body = "Success";
})


export default router;
