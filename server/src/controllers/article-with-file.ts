import fs from 'fs';
import Router from 'koa-router';
import { RateLimit } from 'koa2-ratelimit';

import { PAGE_SIZE, FILE_SIZE_LIMIT_MB } from '#/common/consts';

import {
  ArticleModel, ClassicArticleModel, BasicCellArticleModel
} from '#/models/article';
import { getBucket } from '#/setup/atlas';

import { File } from 'formidable';

export function indexAsDir(publicIndex: string){ return `article_${publicIndex}`; }

// checks total file size and upload files
// note: this function DROPS all previous files before uploading new ones.
async function uploadFiles(dir: string, files: File | File[] = [], filePaths: string[] = []){
    const bucket = getBucket(dir);
    if(!Array.isArray(files)){ files = [files]; }

    let totalSize = 0;
    for(let file of files){
        totalSize += file.size;
    }
    if(totalSize > FILE_SIZE_LIMIT_MB * 1024 * 1024){
        throw new Error("file size too large");
    }

    // let streams = await Promise.all(files.map((file, i) => {
    //     if(file.size > 0) return fs.createReadStream(file.path);

    //     // zero-sized file to indicate no modification for this file.
    //     return bucket.openDownloadStreamByName(filePaths[i]);
    // }))

    // bocket.drop( callback ) ????

    // todo: currently no zero-size file indication: just reupload the whole file for now.
    return new Promise<void>((resolve, reject) => {
        bucket.drop(() => { // first drop the directory. every files should be reuploaded.
            if(!Array.isArray(files)){ files = [files]; }
            Promise.all(files.map((file, i) => {
                return new Promise<void>((resolve2, reject2) => {
                    fs.createReadStream(file.path)
                        .pipe(bucket.openUploadStream(filePaths[i] ?? 'lost', {
                            contentType: file.type ?? undefined,
                            metadata: {
                                contentType: file.type // not necessary I suppose..
                            }
                        }))
                        .on('error', reject2)
                        .on('finish', resolve2)
                });
            }))
                .catch(reject)
                .then(() => { resolve() });
        })
    })

    // await Promise.all(files.map((file, i) => {
    //     return new Promise<void>((resolve, reject) => {
    //         if(file.size === 0){ // zero-sized file to indicate no modification for this file.
    //             fs.rmSync(file.path); // remove zero-sized dummy file
    //             resolve();
    //             return;
    //         }

    //         fs.createReadStream(file.path)
    //             .pipe(bucket.openUploadStream(filePaths[i] ?? 'lost'))
    //             .on('error', reject)
    //             .on('finish', () => {
    //                 // console.log(`file ${filePaths[i]} uploaded`);

    //                 // at least remove previous file

    //                 bucket.find({}, {
    //                     limit: 1,
    //                     skip: 1,
    //                     sort: { uploadDate: -1 }
    //                 }); // should be equivalent to { revision : -2 }

    //                 resolve();
    //             });
    //     });
    // }));
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

router.get('/get-list/:page', async function getArticlePage(ctx){
    const pgstr = ctx.params.page;
    const page = Math.abs(+(pgstr || 0));

    // localIndices are used as verification tokens, so remove them
    const query = ArticleModel.find(
        { 'metadata.visibility': {$gte: 1} },
        {_id: false, __v: false, localIndex: false},
        {skip: page * PAGE_SIZE, limit: PAGE_SIZE}
    );
    const articles = await query.exec();

    ctx.body = {
        result: 'found',
        articles
    };
});

router.get('/get-count', async function getArticleCount(ctx){
    // localIndices are used as verification tokens, so remove them
    const query = ArticleModel.countDocuments(
        { 'metadata.visibility': {$gte: 1} }
    );
    const count = await query.exec();

    ctx.body = {
        result: 'found',
        count
    };
});

// get article body. attachments not included.
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

router.post('/post', RateLimit.middleware({ // limit request up to 1 per minute
    interval: 60 * 1000, // 1min
    // timeWait: 1000, // 1s
    max: 1,
}), async function postArticle(ctx){
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
    try {
        await uploadFiles(
            indexAsDir(publicIndex),
            ctx.request.files?.files,
            article.filePaths
        );
    } catch (err) { // file size too large
        ctx.status = 413;
        ctx.body = {
            result: 'failure',
            reason: `Attachments exceeded size limit (${FILE_SIZE_LIMIT_MB}MB)`
        };
        return;
    }
    

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
    try {
        await uploadFiles(
            indexAsDir(publicIndex),
            ctx.request.files?.files,
            articleBody.filePaths
        );
    } catch (err) { // file size too large
        ctx.status = 413;
        ctx.body = {
            result: 'failure',
            reason: `Attachments exceeded size limit (${FILE_SIZE_LIMIT_MB}MB)`
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

    // drop bucket
    const bucket = getBucket(indexAsDir(publicIndex));
    bucket.drop(); // todo: use promise version, by upgrading into mongodb@5.x and mongoose@7.x

    ctx.body = {
        result: 'success'
    };
});

export default router;
