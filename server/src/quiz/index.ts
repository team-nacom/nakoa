import Router from 'koa-router';

import Quiz from "../models/quiz";

const router = new Router();

// Get list of all quizzes
router.get('/', async (ctx) => {
  await Quiz.find().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific quiz with given index
router.get('/:index', async (ctx) => {
  const index = ctx.params.index;

  const query = Quiz.find({ index: index });

  await query.findOne().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});

export default router;