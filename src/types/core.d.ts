import { Container as infraContainer } from './infrastructure';
import { IMessageService, ICurrencyUseCase } from './message';

export type SecurityGatewayConfig = {
  active: boolean;
  username: string;
  password: string;
  clientId: string;
};

export type Container = {
  currencyUseCase: IMessageUseCase;
};

export type ContainerConfig = {
  messageRepository: infraContainer['messageRepository'];
};

export type ServiceContext = {
  messageRepository: ContainerConfig['messageRepository'];
};

export type UseCaseContext = {
  messageService: IMessageService;
};
