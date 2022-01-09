import { customAlphabet } from 'nanoid';
import Koa from 'koa';
import { HttpError } from 'http-errors';
import Pino from 'pino';

// base64+1
const base64url = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_=';
export function baseid(count: number): string {
  const nanoid = customAlphabet(base64url, count);
  return nanoid();
}

// wrapping middleware for unified error logging
export async function handleErrorMiddleware(ctx: Koa.Context, next: Koa.Next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      if (err instanceof HttpError) {
        ctx.status = err.status;
      } else {
        ctx.status = 500;
      }
      ctx.body = err.message;
    } else {
      ctx.status = 500;
      ctx.body = 'Unknown Error';
    }
    ctx.app.emit('error', err, ctx);
  }
}

export const logger = Pino();
