import { env } from '../util/env';
import { MessageService } from './service/message';
import { MessageUseCase } from './useCase/message';

import { ContainerConfig, Container } from '../types/core';

export function createContainer(config: ContainerConfig): Container {
  const serviceContext = {
    messageRepository: config.messageRepository,
  };

  const useCaseContext = {
    messageService: new MessageService(serviceContext),
  };

  return {
    messageUseCase: new MessageUseCase(useCaseContext),
  };
}
