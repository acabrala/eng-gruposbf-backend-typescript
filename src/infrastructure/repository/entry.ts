import * as Uuid from '@somosphi/uuid';
import httpStatus from 'http-status-codes';
import R from 'ramda';

import {
  ContainerConfig,
  IHttpAdapter,
  IHttpAdapterConstructs,
} from '../../types/infrastructure';
import { IMessageRepository } from '../../types/message';

export type EntryRepositoryContext = {
  config: ContainerConfig;
  httpAdapter: IHttpAdapterConstructs;
};

export class MessageRepository implements IMessageRepository {
  private itauFacadeAdapter: IHttpAdapter;

  constructor({ config, httpAdapter }: EntryRepositoryContext) {
    // eslint-disable-next-line new-cap
    this.itauFacadeAdapter = new httpAdapter({
      baseURL: config.itauFacadeUrl,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async sendMessage(params: {
    message: string;
    from: string;
    to: string;
  }): Promise<boolean> {
    try {
      const { to, message } = params;
      if (to && message) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error('Unexpected error trying to add an entry at Itau');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async getMessage(): Promise<string> {
    try {
      return 'deu certo';
    // eslint-disable-next-line no-unreachable
    } catch (err) {
      throw new Error('New Error');
    }
  }
}
