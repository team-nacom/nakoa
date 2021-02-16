import Router from 'koa-router';

import Guide from '../models/guide';
import { checkAdmin } from "../utils";

const router = new Router();

// Currently, guides = crypto project posts

// Post a guide
router.post('/', checkAdmin);
router.post('/', async (ctx) => {
  type GuidePost = {
    index?: number,
    name: string,
    content: string,
    priority: number,
    createDate: number
  };

  // type guard
  function isGuidePost(obj: any): obj is GuidePost{
    const quiz = obj as GuidePost;
    const keys = ['name', 'content', 'priority'];
    // TODO check types, not only undefined
    let result: boolean = keys.every((val: string) => (val in quiz));
    return result;
  }

  const guideObj = ctx.request.body;
  guideObj.index ??= -1;

  if(await Guide.exists({ index: guideObj.index })){
    ctx.throw(400, `Guide with index ${guideObj.index} already exists`);
  }
  else if(!isGuidePost(guideObj)){
    ctx.throw(400, "Guide is ill-formed");
  }
  else {
    const guide = new Guide(guideObj);
    
    await guide.save()
      .then(doc => { console.log(`Guide upload "${guideObj.name}" successful`); ctx.body = guideObj; })
      .catch(err => { console.error(err); ctx.throw(500); });
  }
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