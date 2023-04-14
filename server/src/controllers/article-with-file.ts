import fs from 'fs';

import Router from 'koa-router';

import {
  ArticleModel, ClassicArticleModel, BasicCellArticleModel
} from '#/models/article';
import { getBucket } from '#/setup/atlas';
import { logger } from '../utils';

import { File } from 'formidable';

export function indexAsDir(publicIndex: string){ return `article_${publicIndex}`; }

async function uploadFiles(dir: string, files: File | File[] = [], filePaths: string[] = []){
    const bucket = getBucket(dir);

    if(!Array.isArray(files)){ files = [files]; }

    await Promise.all(files.map((file, i) => {
        return new Promise<void>((resolve, reject) => {
            if(file.size === 0){ // no modification.
                fs.rmSync(file.path);
                resolve();
                return;
            }

            fs.createReadStream(file.path)
                .pipe(bucket.openUploadStream(filePaths[i] ?? 'lost'))
                .on('error', (err) => {
                    reject(err);
                })
                .on('finish', () => {
                    // todo: remove temp file
                    resolve();
                });
        });
    }));
}

// localIndex is used as a verification token

// GET, DELETE method : HTTP Authentication header (LocalIndex <localIndex>)
// PUT method : in its body

const router = new Router();

router.get('/get-list', async function getArticleList(ctx){
    // localIndices are used as verification tokens, so remove them
    const query = ArticleModel.find(
        { 'metadata.visibility': {$gte: 1} },
        {_id: false, __v: false, localIndex: false}
    );
    const articles = await query.exec();

    ctx.body = {
        result: 'found',
        articles
    };
});

router.get('/get/:publicIndex', async function getArticle(ctx){
    const publicIndex = ctx.params.publicIndex;
    const query = ArticleModel.findOne(
        { publicIndex, 'metadata.visibility': {$gte: 1} },
        {_id: false, __v: false} // remove _id and __v
    ).lean();
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
    const articleBody = JSON.parse(ctx.request.body.article);

    if(articleBody.localIndex === undefined){ // localIndex should've been defined.
        ctx.status = 400;
        ctx.body = {
            result: 'failure',
            reason: 'no localIndex provided'
        };
        return;
    }

    const prevIndex = articleBody.publicIndex;
    if(prevIndex !== undefined){
        // if publicIndex has been defined,
        // then create a new article discarding publicIndex.
        // this is 'forking' behavior of the article distinguished by publicIndex.

        // todo: copy file (or redirect) on fork

        // todo: verify if prevIndex article is actually in db?
        delete articleBody.publicIndex;
    }

    // let article;
    // if(body['mode'] === 'classic'){
    //     article = new ClassicArticleModel(body);
    // } else{
    //     article = new BasicCellArticleModel(body);
    // }
    const article = new ArticleModel(articleBody);
    await article.save();

    // generating unique publicIndex depends on MongoDB's index creation.
    const publicIndex = article.publicIndex ?? ''; // '' should not happen

    // if(prevIndex !== undefined){
    //     // todo: we could make prevIndex -> index link somewhere
    // }

    // storing files.
    await uploadFiles(
        indexAsDir(publicIndex),
        ctx.request.files?.files,
        article.filePaths
    );

    ctx.body = {
        result: 'success',
        publicIndex,
        createDate: article.createDate
    };
});

router.put('/update/:publicIndex', async function putArticle(ctx){
    const publicIndex: string = ctx.params.publicIndex;
    const articleBody = JSON.parse(ctx.request.body.article);
    const localIndex: string | undefined = articleBody.localIndex;

    if(localIndex === undefined){
        ctx.status = 401; // unauthorized
        ctx.body = {
            result: 'failure',
            reason: 'no localIndex provided'
        };
        return;
    }

    // since ArticleModel is base(parent) scheme which don't have any children info(content type),
    // not setting overwrite: true will truncate contents

    // const query0 = ArticleModel.findOneAndUpdate({publicIndex, localIndex}, {$set: body}, {overwrite: true, returnDocument: 'after'});
    // let article0 = await query0.exec();

    const query = ArticleModel.replaceOne({publicIndex, localIndex}, articleBody);
    let res = await query.exec();

    if(res.nModified === 0){
        ctx.status = 401;
        ctx.body = {
            result: 'failure',
            reason: 'publicIndex not found or localIndex mismatch'
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

    // storing files.
    await uploadFiles(
        indexAsDir(publicIndex),
        ctx.request.files?.files,
        articleBody.filePaths
    );

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
            reason: 'localIndex not given'
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
            reason: 'publicIndex not found or localIndex mismatch'
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

export default router;
