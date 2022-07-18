import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { ExpressLogger, Logger } from '../../util/logger';
import { MessageController } from './controller/message';
import { errorHandler } from './middleware/errorHandler';
import { validator } from './middleware/validator';

import { Container } from '../../types/core';
import { IHttpRoute, IHttpInterface, HttpControllerConfig } from '../../types/interface';

type Config = {
  env: typeof import('../../util/env').env;
  coreContainer: Container;
};

// eslint-disable-next-line import/no-mutable-exports

export class HttpInterface implements IHttpInterface {
  private app?: express.Application;
  private coreContainer: Config['coreContainer'];
  private env: Config['env'];

  constructor(config: Config) {
    Logger.debug({
      coreContainer: config.coreContainer !== undefined,
      env: config.env !== undefined,
    }, 'fun: HttpInterface.constructor');

    this.coreContainer = config.coreContainer;
    this.env = config.env;
  }

  // eslint-disable-next-line class-methods-use-this
  private _debug(info: object = {}, msg: string = '') {
    Logger.debug({
      class: 'HttpInterface',
      classType: 'Interface',
      ...info,
    }, msg);
  }

  async initApp() {
    this.app = express();

    this.app.use(
      helmet(),
      cors(),
      compression(),
      express.json({
        limit: this.env.httpBodyLimit,
      }),
      ExpressLogger.onSuccess.bind(ExpressLogger),
      ExpressLogger.onError.bind(ExpressLogger),
    );

    this.setupRoutes();
    this.setupNotFound();

    this.app.use(errorHandler);
  }

  setupRoutes() {
    [
      new MessageController({
        coreContainer: this.coreContainer,
        validator,
      }),
    ]
      .forEach((route: IHttpRoute) => {
        const router = express.Router({ mergeParams: true });
        route.register(router);
        this.app?.use(router);
      });

    this._debug({}, 'setupRoutes ended');
  }

  setupNotFound() {
    this.app?.use(
      '*',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        next(new Error('Page not found'));
      },
    );
  }

  serve(): void {
    this.initApp();

    this.app?.listen(this.env.httpPort);

    Logger.info({
      httpPort: this.env.httpPort,
    }, 'http interface listening');
    this._debug({}, 'http interface initialized');
  }
}
