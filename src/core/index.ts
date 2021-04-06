import koa from 'koa';
import koaQs from 'koa-qs';
import { requestLogger } from './logger';
import responseTime from 'koa-response-time';
import bodyParser from 'koa-bodyparser';
import { v4 as uuid } from 'uuid';
import koaHelmet from 'koa-helmet';

export function installMiddleware(server: koa<koa.DefaultState, koa.DefaultContext>) {

  koaQs(server);

  server.use(async (ctx, next) => {
    ctx.logger = requestLogger;
    await next();
  });

  server.use(async (ctx, next) => {
    ctx.logger.info(`-> ${ctx.method} ${ctx.url}`);

    await next();

    ctx.logger.info(
      `<- ${ctx.method} ${ctx.status} (${ctx.response.get('X-Response-Time')}) ${ctx.url}`,
    );
  });

  server.use(responseTime());

  server.use(bodyParser());

  server.use(koaHelmet());

  server.use(async (ctx, next) => {
    const header = 'x-request-id';
    if (!ctx.headers[header]) {
      const id = uuid();
      ctx.headers[header] = id;
      ctx.state.requestId = id;
    }
    await next();
  });

}