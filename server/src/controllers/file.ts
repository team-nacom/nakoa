import Router from 'koa-router';
// import { getMimeType } from 'stream-mime-type';

import { getBucket } from '#/setup/atlas';
import { logger } from '../utils';

import {
    indexAsDir
} from './article-with-file';

// https://stackoverflow.com/questions/46145738/stream-response-into-http-response

const router = new Router();

router.get('/:publicIndex/:path', async function getFile(ctx){
    const { publicIndex, path } = ctx.params;

    const bucket = getBucket(indexAsDir(publicIndex));

    // get mime type manually. seriously?
    const fileData = (await bucket.find({ filename: path }).toArray())[0];
    if(!fileData){
        ctx.status = 404;
        return;
    }
    ctx.set('content-type', fileData.contentType);

    const stream = bucket.openDownloadStreamByName(path); //.setEncoding('binary');
    stream.on('error', (err) => {
            stream.emit('end');

            ctx.status = 500;
            // ctx.body = new Blob();
        })
        // .on('data', (data) => {
        //     ctx.body = data;
        // })
    
    // const { mime } = await getMimeType(stream);
    // console.log(mime);

    // URGENT : set encoding on server side

    ctx.body = stream;
    
    // ctx.body = bucket.openDownloadStreamByName(path);
});

// router.get('/bar', async function getFoo(ctx){
//     const body = ctx.request.body;

//     console.log(body);

//     ctx.body = {
//         result: 'ok'
//     };
// });

export default router;