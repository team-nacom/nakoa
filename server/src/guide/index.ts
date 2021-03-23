import Router from 'koa-router';
import fs from "fs";

import Guide from '../models/guide';
import { checkAdmin } from "../utils";
import { postOneGuide } from "./poster";
//import asyncBusboy from 'async-busboy';
import createHttpError from 'http-errors';

const router = new Router();

// Post a guide (manual)
router.post('/', checkAdmin);
router.post('/', async (ctx) => {
  await postOneGuide({
    ...ctx.request.body,
    authors: [ctx.state.user.nickname],
  });
  ctx.body = "Success";
});

// Upload in bulk with zipped file
// router.post('/zip', checkAdmin);
// router.post('/zip', async (ctx, next) => {
//   const {files, fields} = await asyncBusboy(ctx.req);
//   if(files === undefined)
//     throw createHttpError(400, "No files given");
  
//   const st = fs.createWriteStream('test.zip');
//   files[0].pipe(st);
//   console.log(files);
//   console.log(fields);
//   ctx.body = "Got it";
// });

// NOTE: exclude _id from projection?
// Get list of guides
router.get('/', async (ctx) => {
  const query = Guide.find().select('index name priority createDate');
  await query.lean().
    catch(err => ctx.throw(500, err)).
    then(docs => ctx.body = docs);
});

// Get specific guide with given index
router.get('/:index(\\d+)', async (ctx) => {
  const index = ctx.params.index;

  const filter = { index: index };
  const query = Guide.find(filter);

  await query.findOne().
    catch(err => ctx.throw(500, err)).
    then(doc => {
      if(!doc) ctx.throw(404, "Document Not Found");
      ctx.body = doc;
    });
});


export default router;
