import { HttpAdapter } from './adapter/http';
import { MysqlAdapter } from './adapter/mysql';
import { CurrencyRepository } from './repository/currency';

import {
  ContainerConfig,
  Container,
} from '../types/infrastructure';

export function createContainer(config: ContainerConfig): Container {
  return {
    currencyRepository: new CurrencyRepository({
      config,
      mysqlAdapter: new MysqlAdapter(),
    }),
  };
}
