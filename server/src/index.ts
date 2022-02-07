import Koa from 'koa';
import Router from 'koa-router';
import Pino from 'koa-pino-logger';
import Cors from '@koa/cors';
import koaBody from 'koa-body';

import session from 'koa-session';

import './setup/atlas'; // connect Atlas mongoDB
import './setup/aws'; // connect aws S3

import fileRouter from './file';
import bubbleRouter from './bubble';

import {
  handleErrorMiddleware, isProduction, logger, logStreams,
} from './utils';

// Router
const router = new Router();

// Root (not used)
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
});

// Files
router.use('/file', fileRouter.routes());
// Bubble (for demo)
router.use('/bubble', bubbleRouter.routes());

// local / production config
const origin = (isProduction ? 'https://team-na.com' : '*');
const port = (isProduction ? 3884 : 3885);

// Koa app
const app = new Koa();
app.use(Pino(logger, logStreams));
app.use(koaBody({
  multipart: true,
  formidable: { keepExtensions: true },
}));
app.use(Cors({
  origin,
  credentials: true,
}));

// we might want to keep this key secret
app.keys = ['exNFlUxpSphOJL3zzNIHRy39pzxsdrLmXEFoiXYQcFp3DW3xc41gHyS8rh7ZcOY6'];
app.use(session({}, app));

app.use(handleErrorMiddleware);
app.use(router.routes()).use(router.allowedMethods());

if (isProduction) {
  app.listen(port);
} else {
  app.listen(port, '0.0.0.0');
}
