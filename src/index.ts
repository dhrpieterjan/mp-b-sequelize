import koa from 'koa';
import config from 'config';
import { installMiddleware } from './core';
import { systemLogger } from './core/logger';

const PORT = config.get<number>('server.port');

(() => {
  const server = new koa();

  installMiddleware(server);

  server.use(async ctx => {
    ctx.body = {
      requestId: ctx.state.requestId,
    };
  });

  server.listen(PORT, () => {
    systemLogger.info(`Server listening on port: ${PORT}`);
  })
})();


