import Router from 'koa-router';
import {
  ArticleModel, ClassicArticleModel, BasicCellArticleModel
} from '#/models/article';
import { logger } from '../utils';


const router = new Router();

router.get('/get-list', async function getArticleList(ctx){
    // localIndices are used as verification tokens, so remove them
    const query = ArticleModel.find({ 'metadata.visibility': {$gte: 1} }).select(['-localIndex']);
    const articles = await query.exec();

    ctx.body = {
        result: 'found',
        articles
    };
});

router.get('/get/:localIndex', async function getArticle(ctx){
    // localIndex is used as verification token, so remove it

    const localIndex = ctx.params.localIndex; // TODO: idxtype
    const query = ArticleModel.findOne({ localIndex, 'metadata.visibility': {$gte: 1} }).select(['-localIndex']);
    const article = await query.exec();

    if(article === null){
        ctx.status = 404;
        ctx.body = {
            result: 'not found'
        }
        return;
    }

    ctx.body = {
        result: 'found',
        article
    };
});

router.post('/post', async function postArticle(ctx){
    const body = ctx.request.body;
    if(body.localIndex === undefined){ // localIndex should've been defined.
        ctx.status = 400;
        ctx.body = {
            result: 'failure',
            reason: 'no localIndex provided'
        };
        return;
    }

    const prevIndex = body.publicIndex;
    if(prevIndex !== undefined){
        // if publicIndex has been defined,
        // then create a new article discarding publicIndex.
        // this is 'forking' behavior of the article distinguished by publicIndex.

        // todo: verify if prevIndex article is actually in db?
        delete body.publicIndex;
    }

    // let article;
    // if(body['mode'] === 'classic'){
    //     article = new ClassicArticleModel(body);
    // } else{
    //     article = new BasicCellArticleModel(body);
    // }
    const article = new ArticleModel(body);
    await article.save();

    // generating unique publicIndex depends on MongoDB's index creation.
    const index = article.publicIndex ?? ''; // '' should not happen

    // if(prevIndex !== undefined){
    //     // todo: we could make prevIndex -> index link somewhere
    // }

    ctx.body = {
        result: 'success',
        publicIndex: index,
        createDate: article.createDate
    };
});

router.put('/update/:publicIndex', async function putArticle(ctx){
    const publicIndex: string = ctx.params.publicIndex;
    const body = ctx.request.body;
    const localIndex: string | undefined = body.localIndex;

    if(localIndex === undefined){
        ctx.status = 401; // unauthorized
        ctx.body = {
            result: 'failure',
            reason: 'no localIndex provided'
        };
        return;
    }

    // let res;
    // if(body['mode'] === 'classic'){
    //     res = await ClassicArticleModel.updateOne({publicIndex, localIndex}, {$set: body});
    // } else{
    //     res = await BasicCellArticleModel.updateOne({publicIndex, localIndex}, {$set: body});
    // }
    const query = ArticleModel.updateOne({publicIndex, localIndex}, {$set: body});
    let res = await query.exec();

    // 
    if(res.nModified === 0){
        ctx.status = 401;
        ctx.body = {
            result: 'failure',
            resaon: 'publicIndex not found or localIndex mismatch'
        };
        return;
    }

    if(!res.ok){
        ctx.status = 500;
        ctx.body = {
            result: 'failure',
            reason: 'db error',
        };
        return;
    }

    ctx.body = {
        result: 'success',
    };
});

router.delete('/remove/:publicIndex', async (ctx) => {
    const publicIndex = ctx.params.publicIndex;
    const localIndex = ctx.request.body.localIndex;
    const query = ArticleModel.deleteOne({publicIndex, localIndex});
    let res = await query.exec();

    if(res.deletedCount === 0){
        ctx.status = 401;
        ctx.body = {
            result: 'failure',
            resaon: 'publicIndex not found or localIndex mismatch'
        };
        return;
    }

    if(!res.ok){
        ctx.status = 500;
        ctx.body = {
            result: 'failure',
            reason: 'db error',
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
//       .select('localIndex title author createDate');
//     const docs = await query.exec();
//     ctx.body = docs;
// })

// router.put('/hide/:localIndex', async (ctx) => {
//   const localIndex: string = ctx.params.localIndex;
//   const query = Flat.updateOne({localIndex}, {$set: {'hidden': true}});
//   const doc = await query.exec();
//   ctx.body = 'Success';
// })

// router.put('/unhide/:localIndex', async (ctx) => {
//   const localIndex: string = ctx.params.localIndex;
//   const query = Flat.updateOne({localIndex}, {$set: {'hidden': false}});
//   const doc = await query.exec();
//   ctx.body = 'Success';
// })

// internal APIs for convenience

// router.get('/debug', async (ctx) => {
//   const query = ArticleModel.find({});
//   const docs = await query.exec();
//   ctx.body = docs;
// });

export default router;
