import { ICurrencyService, ICurrencyUseCase } from './currency';
import { Container as infraContainer } from './infrastructure';

export type SecurityGatewayConfig = {
  active: boolean;
  username: string;
  password: string;
  clientId: string;
};

export type Container = {
  currencyUseCase: ICurrencyUseCase;
};

export type ContainerConfig = {
  currencyRepository: infraContainer['currencyRepository'];
};

export type ServiceContext = {
  currencyRepository: ContainerConfig['currencyRepository'];
};

export type UseCaseContext = {
  currencyService: ICurrencyService;
};
