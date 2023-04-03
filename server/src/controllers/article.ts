import Router from 'koa-router';
import {
  ArticleModel, ClassicArticleModel, BasicCellArticleModel
} from '#/models/article';
import { logger } from '../utils';


// localIndex is used as a verification token

// GET, DELETE method : HTTP Authentication header (LocalIndex <localIndex>)
// PUT method : in its body

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

router.get('/get/:publicIndex', async function getArticle(ctx){
    const publicIndex = ctx.params.publicIndex; // TODO: idxtype
    const query = ArticleModel.findOne({ publicIndex, 'metadata.visibility': {$gte: 1} }).lean();
    const article = await query.exec();

    if(article === null){
        ctx.status = 404;
        ctx.body = {
            result: 'not found'
        }
        return;
    }

    let clientLocalIndex: string | undefined = undefined;
    let auth = ctx.headers.authorization;
    if(auth){
        let splitted = auth.trim().split(/[ ]+/);
        if(splitted.length === 2 && splitted[0] === 'LocalIndex'){
            clientLocalIndex = splitted[1];
        }
    }

    if(clientLocalIndex !== article.localIndex){
        //unauthorized
        delete article.localIndex; // in order to make this work, `.lean()` should be applied to query
    }
    // otherwise don't remove localIndex so that the client knows they own the article

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

    // since ArticleModel is base(parent) scheme which don't have any children info(content type),
    // not setting overwrite: true will truncate contents

    console.log(body);

    // const query0 = ArticleModel.findOneAndUpdate({publicIndex, localIndex}, {$set: body}, {overwrite: true, returnDocument: 'after'});
    // let art = await query0.exec();

    // console.log(art);

    const query = ArticleModel.replaceOne({publicIndex, localIndex}, body);
    let res = await query.exec();

    console.log(res);

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
    let clientLocalIndex: string | undefined = undefined;
    let auth = ctx.headers.authorization;
    if(auth){
        let splitted = auth.trim().split(/[ ]+/);
        if(splitted.length === 2 && splitted[0] === 'LocalIndex'){
            clientLocalIndex = splitted[1];
        }
    }

    if(clientLocalIndex === undefined){
        ctx.status = 401;
        ctx.body = {
            result: 'failure',
            resaon: 'localIndex not given'
        };
        return;
    }

    const publicIndex = ctx.params.publicIndex;
    const query = ArticleModel.deleteOne({publicIndex, localIndex: clientLocalIndex});
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
