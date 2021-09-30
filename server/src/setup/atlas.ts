import mongoose from 'mongoose';

const connectionString = process.env.DB_CONN;
if(!connectionString){
  throw new Error("DB_CONN missing in the .env file.");
}

// Connect to db
mongoose.connect(connectionString, {
  useNewUrlParser: true,    // new parser (old parser is deprecated)
  useUnifiedTopology: true, // new connection management engine,
  useFindAndModify: false,  // refer to https://mongoosejs.com/docs/deprecations.html#findandmodify 
  useCreateIndex: true,     // refer to https://mongoosejs.com/docs/deprecations.html#ensureindex
}).then(() => {
  console.log(`Successfully connected to mongodb on ${mongoose.connection.host}`);
}).catch(err => {
  console.error(`Failed to connect.`);
  console.error(err)
});
