import mongoose from 'mongoose';

// Check env
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const useLocal = process.env.USE_LOCAL_DB;
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
