import Router from 'koa-router';

import Cate from '../models/cate';
import Gory from '../models/gory';
import Guide from '../models/guide';
import { isAdmin, checkAdminMiddleware } from "../utils";
import createHttpError from 'http-errors';

const router = new Router();


// Get list of Cates
router.get('/', async (ctx) => {
  const query = Cate.find({}).select('index name gories');
  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get list of Gories
router.get('/:index(\\d+)', async (ctx) => {
  const index = ctx.params.index;

  let filter: any = (isAdmin(ctx) ? {} : { isPublic: true }); // show all for admin
  filter.cate = index; // TODO parse to number

  const cateName = await getCateName(index);
  const query = Gory.find(filter).select('index name guides');

  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => {
      ctx.body = { name: cateName, gories: docs }
    });
});

// Get list of Guides
router.get('/:cindex(\\d+)/:gindex', async (ctx) => {
  const gindex: string = ctx.params.gindex;
  const cindex: number = +ctx.params.cindex;

  try {
    const cateName = await getCateName(cindex);
    const goryName = await getGoryName(gindex);

    const docs = await getGuides(isAdmin(ctx), gindex, cindex);
    
    ctx.body = { cateName: cateName, goryName: goryName, guides: docs };
  } catch(e) {
    ctx.throw(500, e);
  }
});

router.get('/:gindex', async (ctx) => {
  const gindex: string = ctx.params.gindex;

  try {
    const goryName = await getGoryName(gindex);
    // TODO get cateName?
    const docs = await getGuides(isAdmin(ctx), gindex);

    ctx.body = { goryName: goryName, guides: docs };
  } catch(e) {
    ctx.throw(500, e);
  }
});


async function getCateName(index: number) {
  const nameQuery = Cate.findOne({index: index}).select('name');
  const doc = await nameQuery.exec();
  if(!doc) throw createHttpError(404, "Cate not found");
  return doc?.name;
}

async function getGoryName(index: string) {
  const nameQuery = Gory.findOne({index: index}).select('name');
  const doc = await nameQuery.exec();
  if(!doc) throw createHttpError(404, "Gory not found");
  return doc?.name;
}

async function getGuides(isAdmin: boolean, gindex: string, cindex?: number) {
  let filter: any = {gory: gindex};
  if (cindex) filter.cate = cindex;
  if (isAdmin) filter.isPublic = true;

  const query = Guide.find(filter).select('index name authors priority createDate');
  return await query.exec();
}

export default router;
