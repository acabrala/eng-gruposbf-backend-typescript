import {
  createContainer as createCoreContainer,
} from '../core/container';
import {
  createContainer as createInfraContainer,
} from '../infrastructure/container';
import { HttpInterface } from './http';

import {
  IHttpInterface,
  ICliInterface,
  ICronInterface,
} from '../types/interface';

type ContainerConfig = {
  env: typeof import('../util/env').env;
  init: {
    http?: boolean;
    amqp?: boolean;
    cli?: boolean;
    cron?: boolean;
  };
};

type Container = {
  httpInterface?: IHttpInterface;
  cliInterface?: ICliInterface;
  cronInterface?: ICronInterface;
};

export function createContainer(config: ContainerConfig): Container {
  const container: Container = {};

  const infraContainer = createInfraContainer(config.env);

  const coreContainer = createCoreContainer(infraContainer);

  if (config.init.http) {
    container.httpInterface = new HttpInterface({
      env: config.env,
      coreContainer,
    });
  }

  return container;
}
