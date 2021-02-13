import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import session from 'koa-session';
import passport from 'koa-passport';

import './models/atlas'; // connect Atlas mongoDB
import './models/aws'; // connect aws S3
import './user/setup'; // set up passportJS

import challRouter from './chall';
import quizRouter from './quiz';
import userRouter from './user';

import { handleError } from "./utils";


// Router
const router = new Router();

// Root (not used)
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
});

// Challenges
router.use('/chall', challRouter.routes());
// Quizzes
router.use('/quiz', quizRouter.routes());
// Users
router.use('/user', userRouter.routes());


// Koa app
const app = new Koa();
app.use(Logger());
app.use(bodyParser());
app.use(Cors());

// we might want to keep this key secret
app.keys = ['exNFlUxpSphOJL3zzNIHRy39pzxsdrLmXEFoiXYQcFp3DW3xc41gHyS8rh7ZcOY6']
app.use(session({}, app));
app.use(passport.initialize());
app.use(passport.session());

app.use(handleError);
app.use(router.routes()).use(router.allowedMethods());

app.listen(3885);