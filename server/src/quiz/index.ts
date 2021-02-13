import Router from 'koa-router';

import Quiz from "../models/quiz";

const router = new Router();

// Post a quiz
router.post('/', async (ctx) => {

  // @ts-ignore
  if(!ctx.isAuthenticated()){
    ctx.throw(401, "Should log in");
    return;
  } else {
    const user = ctx.state.user;
    if(user.email != "admin"){
      ctx.throw(401, "Should be admin");
      return;
    }
  }

  type QuizPost = {
    index?: number,
    name: string,
    description: string,
    choices: string[],
    answer: string,
    explanation: string
  };

  // type guard
  function isQuizPost(obj: any): obj is QuizPost{
    const quiz = obj as QuizPost;
    const keys = ['name', 'description', 'choices', 'answer', 'explanation'];
    // TODO check types, not only undefined
    let result: boolean = keys.every((val: string) => (val in quiz));
    return result;
  }

  const quizObj = ctx.request.body;
  quizObj.index ??= -1;

  if(await Quiz.exists({ index: quizObj.index })){
    console.error(`Quiz with index ${quizObj.index} already exists`);
    ctx.throw(400);
  }
  else if(!isQuizPost(quizObj)){
    console.error("Quiz is ill-formed");
    ctx.throw(400);
  }
  else {
    const quiz = new Quiz(quizObj);
    
    await quiz.save()
      .then(doc => { console.log(`Quiz upload "${quizObj.name}" successful`); ctx.body = quizObj; })
      .catch(err => { console.error(err); ctx.throw(500); });
  }
});

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