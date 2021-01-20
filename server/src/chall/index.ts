import Router from 'koa-router';

import Chall from '../models/chall';

const router = new Router();

// Post a challenge
router.post('/', async (ctx) => {
  type ChallPost = {
    index?: number,
    name: string,
    // problemPdf: 
    // solutionPdf: 
    problemOpenDate?: number,
    solutionOpenDate?: number,
    isPublic?: boolean
  };

  // type guard
  function isChallPost(obj: any): obj is ChallPost{
    const quiz = obj as ChallPost;
    const keys = ['name']; // check pdfs
    // TODO check types, not only undefined
    let result: boolean = keys.every((val: string) => (val in quiz));
    return result;
  }

  const challObj = ctx.request.body;
  challObj.index ??= -1;
  challObj.problemUrl = "https://nacom-main-storage.s3.ap-northeast-2.amazonaws.com/challs/test.pdf";
  challObj.solutionPdf = "https://nacom-main-storage.s3.ap-northeast-2.amazonaws.com/challs/test.pdf";

  if(await Chall.exists({ index: challObj.index })){
    console.error(`Challenge with index ${challObj.index} already exists`);
    ctx.throw(400);
  }
  else if(!isChallPost(challObj)){
    console.error("Challenge is ill-formed");
    ctx.throw(400);
  }
  else {
    const chall = new Chall(challObj);
    
    await chall.save()
      .then(doc => { console.log(`Challenge upload "${challObj.name}" successful`); ctx.body = challObj; })
      .catch(err => { console.error(err); ctx.throw(500); });
  }
});


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

  await query.findOne().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});


export default router;