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
    const stream = bucket.openDownloadStreamByName(path); //.setEncoding('binary');
    stream.on('error', (err) => {
            console.log(`file ${publicIndex}/${path} not found`)

            ctx.body = new Blob();

            // stream.emit('end') // put this to make status 200
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