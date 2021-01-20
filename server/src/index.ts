import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import mongoose from 'mongoose';
import './models/aws';

import challRouter from './chall';
import quizRouter from './quiz';

// Check env
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const useLocal = process.env.DOTENV_CONFIG_LOCALDB;
if(!useLocal && (!dbUser || !dbPass)){
  throw new Error("No DB_USER or DB_PASS in .env file.");
}

// Choose between atlas and local
const atlasConn = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhrs.mongodb.net/nacom?retryWrites=true&w=majority`;
const localConn = 'mongodb://localhost/nacom';
const connectionString = useLocal ? localConn : atlasConn;

// Connect to db
mongoose.connect(connectionString, {
  useNewUrlParser: true,   // new parser (old parser is deprecated)
  useUnifiedTopology: true // new connection management engine
}).then(res => {
  console.log(`Successfully connected to mongodb on ${mongoose.connection.host}`);
}).catch(err => {
  console.error(`Failed to connect to ${mongoose.connection.host}`);
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
router.use('/chall', challRouter.routes());
// Quizzes
router.use('/quiz', quizRouter.routes());


// Koa app
const app = new Koa();
app.use(Logger());
app.use(Cors());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3885);