import mongoose from 'mongoose';
import { logger } from '../utils';

const connectionString = process.env.DB_CONN;
if (!connectionString) {
  throw new Error('DB_CONN missing in the .env file.');
}

// Connect to db
mongoose.connect(connectionString, {
  useNewUrlParser: true, // new parser (old parser is deprecated)
  useUnifiedTopology: true, // new connection management engine,
  useFindAndModify: false, // refer to https://mongoosejs.com/docs/deprecations.html#findandmodify
  useCreateIndex: true, // refer to https://mongoosejs.com/docs/deprecations.html#ensureindex
}).then(() => {
  logger.info(`Successfully connected to mongodb on ${mongoose.connection.host}`);
}).catch((err) => {
  logger.error('Failed to connect.');
  logger.error(err);
});

mongoose.set('debug', true);