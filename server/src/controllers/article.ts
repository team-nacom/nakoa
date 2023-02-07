import Router from 'koa-router';
import {
  ArticleModel, ClassicArticleModel, BasicCellArticleModel
} from '#/models/article';
import { logger } from '../utils';

const router = new Router();

router.get('/get-list', async function getArticleList(ctx){
    const query = ArticleModel.find({ 'metadata.visibility': {$gte: 1} });
    const articles = await query.exec();

    console.log(articles);

    ctx.body = {
        result: 'found',
        articles
    };
});

router.get('/get/:index', async function getArticle(ctx){
    const index = ctx.params.index; // TODO: idxtype
    const query = ArticleModel.findOne({ index, 'metadata.visibility': {$gte: 1} });
    const article = await query.exec();

    if(article === null){
        ctx.status = 404;
        ctx.body = {
            result: 'not found'
        }
        return;
    }

    ctx.body = article;
});

router.post('/post', async function postArticle(ctx){
    const body = ctx.request.body;

    // let article;
    // if(body['mode'] === 'classic'){
    //     article = new ClassicArticleModel(body);
    // } else{
    //     article = new BasicCellArticleModel(body);
    // }
    const article = new ArticleModel(body);
    await article.save();

    if(article.index === undefined){
        ctx.status = 500;
        ctx.body = {
            result: 'failure'
        };
        return;
    }

    ctx.body = {
        result: 'success',
        index: article.index,
        createDate: article.createDate
    };
});

router.put('/update/:index', async function putArticle(ctx){
    const index: string = ctx.params.index;
    const body = ctx.request.body;

    let res;
    if(body['mode'] === 'classic'){
        res = await ClassicArticleModel.updateOne({index}, { $set: body });
    } else{
        res = await BasicCellArticleModel.updateOne({index}, {$set: body});
    }
    // const query = ArticleModel.updateOne({index}, { $set: body });  // TODO : authentication
    // let res = await query.exec();

    if(!res.ok){
    // if(a === undefined) {
        ctx.status = 500;
        ctx.body = {
            result: 'failure'
        };
        return;
    }

    ctx.body = {
        result: 'success',
    };
});

router.delete('/remove/:index', async (ctx) => {
    const index = ctx.params.index;
    const query = ArticleModel.deleteOne({index}); // TODO : authentication
    let res = await query.exec();

    if(!res.ok){
        ctx.status = 500;
        ctx.body = {
            result: 'failure'
        };
        return;
    }

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
