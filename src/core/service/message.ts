import R from 'ramda';
import { Message } from 'venom-bot';

import { ServiceContext } from '../../types/core';
import { IMessageService } from '../../types/message';

export class MessageService implements IMessageService {
  private messageRepository: ServiceContext['messageRepository'];

  constructor(context: ServiceContext) {
    this.messageRepository = context.messageRepository;
  }

  sendMessage(params: {
    message: string;
    from: string;
    to: string;
  }): Promise<boolean> {
    return this.messageRepository.sendMessage(params);
  }

  // eslint-disable-next-line class-methods-use-this
  public async getMessage(): Promise<string> {
    return this.messageRepository.getMessage();
  }
}
