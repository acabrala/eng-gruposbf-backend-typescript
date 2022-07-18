import { HttpAdapter } from './adapter/http';
import { MessageRepository } from './repository/entry';

import {
  ContainerConfig,
  Container,
} from '../types/infrastructure';

export function createContainer(config: ContainerConfig): Container {
  return {
    messageRepository: new MessageRepository({
      config,
      httpAdapter: HttpAdapter,
    }),
  };
}
