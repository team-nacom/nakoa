import { customAlphabet } from 'nanoid';
import Koa from 'koa';
import { HttpError } from 'http-errors';
import Pino from 'pino';
import pretty from 'pino-pretty';

// base64+1
const base64url = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789+-=';
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
    ctx.log.error(err);
    ctx.app.emit('error', err, ctx);
  }
}

export const isProduction = (process.env?.MODE === 'production');
export const isStaging = (process.env?.MODE === 'staging');
export const clientOrigin = (process.env?.CLIENT_ORIGIN ?? 'http://localhost:3000');
const logOptions = {};

function formatMessage(log: any, messageKey: string, levelLabel: string): string {
  const [req, res, rst] = [log.req, log.res, log.responseTime];
  if (req === undefined || res === undefined || rst === undefined) return log[messageKey] as string;

  const result = `${req.headers.host} "${req.method} ${req.url}" ${res.statusCode} ${res.headers['content-length']}B ${rst}ms',`;
  return result;
}

export const logStreams = Pino.multistream([
  {
    level: 'debug',
    stream: pretty({
      translateTime: true,
      hideObject: true,
      messageFormat: formatMessage,
    }),
  },
  { level: 'info', stream: Pino.destination('../nakoa.log') },
]);

export const logger = Pino(logOptions, logStreams);
