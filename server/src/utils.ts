import Count from "./models/count";
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