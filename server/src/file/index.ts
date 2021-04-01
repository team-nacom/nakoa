import Router from 'koa-router';

import File, { uploadFileToS3 } from '../models/file';
import { checkAdminMiddleware } from "../utils";

import fs from "fs";
import pathlib from "path";
import { customAlphabet } from "nanoid";
import createHttpError from 'http-errors';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);

const router = new Router();

router.post('/upload', checkAdminMiddleware);
router.post('/upload', async (ctx) => {

    const folder = ctx.request.body.folder;
    //@ts-ignore
    const file: any = ctx.request.files?.file;

    if(!folder || !file){
        throw createHttpError(400);
    }

    const randomKey = nanoid();
    const extname = pathlib.extname(file.path);
    const s3Path = pathlib.join(folder, randomKey + extname);

    const fileStream = fs.readFileSync(file.path);

    await uploadFileToS3(s3Path, fileStream, file.type);

    const doc = new File({ path: s3Path, mime: file.type });
    await doc.save();

    console.log(`Successfully uploaded ${file.path} of type ${file.type} to ${s3Path}`);
    ctx.body = s3Path;
});

export default router;