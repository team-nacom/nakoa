import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import mongoose from 'mongoose';

import dotenv from "dotenv";
dotenv.config();

import chall from './chall';

const atlasConn = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhrs.mongodb.net/nacom?retryWrites=true&w=majority`;
const localConn = 'mongodb://localhost/nacom';
const connectionString = process.env.DOTENV_CONFIG_LOCALDB ? localConn : atlasConn;

mongoose.connect(connectionString, {
  useNewUrlParser: true,   // new parser (old parser is deprecated)
  useUnifiedTopology: true // new connection management engine
}).then(res => {
  console.log(`Successfully connected to mongodb on ${mongoose.connection.host}`);
}).catch(err => {
  console.error(err);
  throw err;
});


// Router
const router = new Router();

// Root (not used)
router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
  await next();
});

// Challenges
router.use('/chall', chall.routes());


// Koa app
const app = new Koa();
app.use(Logger());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3885);