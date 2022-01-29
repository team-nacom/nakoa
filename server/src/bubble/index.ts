import Router from 'koa-router';
import Bubble from '../models/bubble';
import { logger } from '../utils';

const router = new Router();

// Post a guide (manual)
router.post('/', async (ctx) => {
  const bubbleObj = ctx.request.body;
  const bubble = new Bubble({
    title: bubbleObj.title,
    author: bubbleObj.author,
    content: bubbleObj.content,
    tags: bubbleObj.tags,
  });
  await bubble.save();
  ctx.body = bubble;
});

router.get('/author/:author', async (ctx) => {
  const author: string = ctx.params.author;
  const query = Bubble.find({author, hidden: false})
    .sort({ createDate: -1 })
    .select('index title author tags createDate');
  const docs = await query.exec();
  ctx.body = docs;
})

router.get('/view/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Bubble.findOne({index});
  const doc = await query.exec();
  ctx.body = doc;
})

router.get('/debug', async (ctx) => {
  const query = Bubble.find({});
  const docs = await query.exec();
  ctx.body = docs;
})

router.put('/hide/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Bubble.updateOne({index}, {$set: {'hidden': true}});
  const doc = await query.exec();
  ctx.body = 'Success';
})

router.put('/unhide/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Bubble.updateOne({index}, {$set: {'hidden': false}});
  const doc = await query.exec();
  ctx.body = 'Success';
})

router.delete('/delete/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Bubble.deleteOne({index});
  const doc = await query.exec();
  ctx.body = 'Success';
})


export default router;
