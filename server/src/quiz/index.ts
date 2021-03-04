import Router from 'koa-router';

import Quiz from "../models/quiz";
import { checkAdmin } from "../utils";

const router = new Router();

// Post a quiz
router.post('/', checkAdmin, async (ctx) => {
  type QuizPost = {
    index?: number,
    name: string,
    description: string,
    choices: string[],
    answer: string,
    explanation: string
  };

  // type guard
  // TODO check types, not only undefined
  function isQuizPost(obj: any): obj is QuizPost{
    const keys = ['name', 'description', 'choices', 'answer', 'explanation'];

    return keys.every(val => val in obj);
  }

  const quizObj: QuizPost = ctx.request.body;
  quizObj.index ??= -1;

  if (!isQuizPost(quizObj)) {
    ctx.throw(400, "Quiz is ill-formed");
    return;
  }

  if (await Quiz.exists({ index: quizObj.index })) {
    ctx.throw(400, `Quiz with index ${quizObj.index} already exists`);
    return;
  }

  const quiz = new Quiz(quizObj);
  await quiz.save();
  
  ctx.body = quizObj;
  console.log(`Quiz upload "${quizObj.name}" successful`); 
});

// Get list of all quizzes
router.get('/', async (ctx) => {
  ctx.body = await Quiz.find();
});

// Get specific quiz with given index
router.get('/:index', async (ctx) => {
  const index: number = ctx.params.index!;

  const doc = await Quiz.findOne({ index });

  if (!doc) ctx.throw(404, "Document Not Found");
  else ctx.body = doc;
});

export default router;