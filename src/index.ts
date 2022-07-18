import './util/apm';

import { createContainer } from './interface/container';
import { env } from './util/env';
import { Logger } from './util/logger';

type AppConfig = {
  http?: boolean;
  amqp?: boolean;
  cli?: boolean;
  cron?: boolean;
};

export class App {
  private _http?: boolean;
  private _amqp?: boolean;
  private _cron?: boolean;

  constructor({ http, amqp, cron }: AppConfig) {
    this._http = http;
    this._amqp = amqp;
    this._cron = cron;
  }

  run() {
    const interfaceContainer = createContainer({
      env,
      init: {
        http: this._http,
        amqp: this._amqp,
        cron: this._cron,
      },
    });

    if (this._http) {
      interfaceContainer.httpInterface?.serve();
    }
  }
}

const app = new App({
  http: env.httpActive,
  amqp: env.amqpActive,
  cron: env.cronActive,
});

setImmediate(() => {
  app.run();
  Logger.debug('app initialized');
});
