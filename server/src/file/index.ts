import Router from 'koa-router';

import File, { uploadFileToS3 } from '../models/file';
import { isAdmin, checkAdminMiddleware } from "../utils";

import fs from "fs";
import pathlib from "path";
import { customAlphabet } from "nanoid";
import createHttpError from 'http-errors';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);

const router = new Router();

router.post('/upload', checkAdminMiddleware);
router.post('/upload', async (ctx) => {
    const DEMOTXT = "/home/diuven/Downloads/random.txt";

    const randomKey = nanoid();
    const s3Path = randomKey; // TODO join given path

    const file = fs.readFileSync(DEMOTXT);

    await uploadFileToS3(s3Path, file);

    const doc = new File({ path: s3Path, mime: 'text/plain' });
    await doc.save();

    console.log("Uploaded");
    ctx.body = s3Path;
});

export default router;