import Router from 'koa-router';
import {
  ArticleModel, ClassicArticleModel, BasicCellArticleModel
} from '#/models/article';
import { logger } from '../utils';

const router = new Router();

router.get('/get/:index', async function getArticle(ctx){
    const index = ctx.params.index; // TODO: idxtype
    const query = ArticleModel.findOne({ index, 'metadata.visibility': {$gte: 1} });
    const doc = await query.exec();

    if(doc === null){
        ctx.status = 404;
        ctx.body = {
            result: 'not found'
        }
        return;
    }

    ctx.body = doc;
});

router.post('/post', async function postArticle(ctx){
    const article = ctx.request.body;
    const articleInstance = new ArticleModel(article);
    await articleInstance.save();

    if(articleInstance.index === undefined){
        ctx.status = 500;
        ctx.body = {
            result: 'failure'
        };
        return;
    }

    ctx.body = {
        result: 'success',
        index: articleInstance.index,
        createDate: articleInstance.createDate
    };
});

router.put('/update/:index', async (ctx) => {
    const index: string = ctx.params.index;
    const article = ctx.request.body;
    const query = ArticleModel.updateOne({index}, article);
    await query.exec();

    ctx.body = {
        result: 'success'
    };
});

router.delete('/remove/:index', async (ctx) => {
    const index = ctx.params.index;
    const query = ArticleModel.deleteOne({index}); // TODO : authentication
    await query.exec();
    ctx.body = {
        result: 'success'
    };
});

// router.get('/author/:author', async (ctx) => {
//     const author: string = ctx.params.author;
//     const query = Flat.find({author, hidden: false})
//       .sort({ createDate: -1 })
//       .select('index title author createDate');
//     const docs = await query.exec();
//     ctx.body = docs;
// })

// router.put('/hide/:index', async (ctx) => {
//   const index: string = ctx.params.index;
//   const query = Flat.updateOne({index}, {$set: {'hidden': true}});
//   const doc = await query.exec();
//   ctx.body = 'Success';
// })

// router.put('/unhide/:index', async (ctx) => {
//   const index: string = ctx.params.index;
//   const query = Flat.updateOne({index}, {$set: {'hidden': false}});
//   const doc = await query.exec();
//   ctx.body = 'Success';
// })

// internal APIs for convenience

router.get('/debug', async (ctx) => {
  const query = ArticleModel.find({});
  const docs = await query.exec();
  ctx.body = docs;
})

export default router;
