import Router from 'koa-router';

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
    const stream = bucket.openDownloadStreamByName(path);
    stream.on('error', (err) => {
            console.log('filenotfound')

            ctx.body = new Blob();

            // stream.emit('end') // put this to make status 200
        })
        // .on('data', (data) => {
        //     ctx.body = data;
        // })
    
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