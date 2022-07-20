import { env } from '../util/env';
import { CurrencyService } from './service/currency';
import { CurrencyUseCase } from './useCase/currency';

import { ContainerConfig, Container } from '../types/core';

export function createContainer(config: ContainerConfig): Container {
  const serviceContext = {
    currencyRepository: config.currencyRepository,
  };

  const useCaseContext = {
    currencyService: new CurrencyService(serviceContext),
  };

  return {
    currencyUseCase: new CurrencyUseCase(useCaseContext),
  };
}
