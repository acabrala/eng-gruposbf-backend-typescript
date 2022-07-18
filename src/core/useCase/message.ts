import * as R from 'ramda';
import { Message } from 'venom-bot';

import {
  sendMessageSchema,
} from './schemas/message';
import { validateProperties } from './schemas/shared';

import { UseCaseContext } from '../../types/core';
import {
  IMessageUseCase,
} from '../../types/message';

export class MessageUseCase implements IMessageUseCase {
  private messageService: UseCaseContext['messageService'];

  constructor(ctx: UseCaseContext) {
    this.messageService = ctx.messageService;
  }

  public async sendMessage(params: {
    message: string;
    from: string;
    to: string;
  }): Promise<boolean> {
    validateProperties({
      schema: sendMessageSchema,
      params,
      errorMsg: 'Invalid properties to send an Message',
    });
    try {
      await this.messageService.sendMessage(params);

      return true;
    } catch (error) {
      throw new Error('Error');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async getMessage(): Promise<string> {
    try {
      return await this.messageService.getMessage();
    } catch (error) {
      throw new Error('Error');
    }
  }
}
