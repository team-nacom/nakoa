import Router from 'koa-router';
import Flat from '../models/flat';
import { logger } from '../utils';

const router = new Router();

router.post('/', async (ctx) => {
  const flatObj = ctx.request.body;
  const flat = new Flat({
    title: flatObj.title,
    author: flatObj.author,
    content: flatObj.content,
  });
  await flat.save();
  ctx.body = flat;
});

router.get('/author/:author', async (ctx) => {
  const author: string = ctx.params.author;
  const query = Flat.find({author, hidden: false})
    .sort({ createDate: -1 })
    .select('index title author createDate');
  const docs = await query.exec();
  ctx.body = docs;
})

router.get('/view/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Flat.findOne({index});
  const doc = await query.exec();
  ctx.body = doc;
})

router.put('/hide/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Flat.updateOne({index}, {$set: {'hidden': true}});
  const doc = await query.exec();
  ctx.body = 'Success';
})

router.put('/unhide/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Flat.updateOne({index}, {$set: {'hidden': false}});
  const doc = await query.exec();
  ctx.body = 'Success';
})

// internal APIs for convenience

router.get('/debug', async (ctx) => {
  const query = Flat.find({});
  const docs = await query.exec();
  ctx.body = docs;
})

router.delete('/delete/:index', async (ctx) => {
  const index: string = ctx.params.index;
  const query = Flat.deleteOne({index});
  const doc = await query.exec();
  ctx.body = 'Success';
})


export default router;
