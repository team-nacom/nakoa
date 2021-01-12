import Router from 'koa-router';

import Quiz from "../models/quiz";

const router = new Router();

// Get list of all quizzes
router.get('/', async (ctx) => {
    try {
        ctx.body = await Quiz.find().exec();
    } catch (err) {
        return ctx.throw(500, err);
    }
});

// Get specific quiz with given index
router.get('/:index', async (ctx) => {
  const index = ctx.params.index;
  try {
    ctx.body = await Quiz.find({ index: index }).exec();
    // TODO if quiz is not found
  } catch (err) {
    return ctx.throw(500, err);
  }
});

export default router;