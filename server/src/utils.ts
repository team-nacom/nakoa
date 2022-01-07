import Count from "./models/count";
import Guide from "./models/guide";
import { customAlphabet } from 'nanoid'

// base64+1
const base64url = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_=';
export function baseid(count: number): string {
  const nanoid = customAlphabet(base64url, count);
  return nanoid();
}

// wrapping middleware for unified error logging
export async function handleErrorMiddleware(ctx :any, next :any) {
  try {
    await next();
  } catch (err) {
    //@ts-ignore
    ctx.status = err.status || 500;
    //@ts-ignore
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

// utility function for removing all documents and resetting a count of a collection
const collections = ["guide", "cate", "gory"];
export async function resetCollection(name :string) {
  if(!collections.includes(name)) throw Error("??");
  // currently supports only guide collection
  await Guide.deleteMany({}).exec();
  await Count.resetCount(name);
  console.log(`Deleting all documents and resetting count of collection ${name} was successful!`);
}