import Router from 'koa-router';
import Cell from '../models/cell';
import { logger } from '../utils';

const router = new Router();

router.post('/', async (ctx) => {
  const cellObj = ctx.request.body;
  const cell = new Cell({
    title: cellObj.title,
    author: cellObj.author,
    content: cellObj.content,
  });
  await cell.save();
  ctx.body = cell;
});

router.get('/author/:author', async (ctx) => {
  const author: string = ctx.params.author;
  const query = Cell.find({author, hidden: false})
    .sort({ createDate: -1 })
    .select('index title author createDate');
  const docs = await query.exec();
  ctx.body = docs;
})

router.get('/view/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Cell.findOne({index});
  const doc = await query.exec();
  ctx.body = doc;
})

router.put('/hide/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Cell.updateOne({index}, {$set: {'hidden': true}});
  const doc = await query.exec();
  ctx.body = 'Success';
})

router.put('/unhide/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Cell.updateOne({index}, {$set: {'hidden': false}});
  const doc = await query.exec();
  ctx.body = 'Success';
})

// internal APIs for convenience

router.get('/debug', async (ctx) => {
  const query = Cell.find({});
  const docs = await query.exec();
  ctx.body = docs;
})

router.delete('/delete/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Cell.deleteOne({index});
  const doc = await query.exec();
  ctx.body = 'Success';
})


export default router;
