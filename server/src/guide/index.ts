import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

import Guide, {GuideDocument} from '../models/guide';
import { checkAdmin } from "../utils";
import { postOneGuide } from "./poster";

const router = new Router();

// Post a guide (manual)
router.post('/', checkAdmin);
router.post('/', async (ctx) => {
  await postOneGuide(ctx.request.body);
  ctx.body = "Success";
});

// NOTE: exclude _id from projection?
// Get list of guides
router.get('/', async (ctx) => {
  const query = Guide.find().select('index name priority createDate');
  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific guide with given index
router.get('/:index', async (ctx) => {
  const index = ctx.params.index;

  const filter = { index: index };
  const query = Guide.find(filter);

  await query.findOne().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});


export default router;