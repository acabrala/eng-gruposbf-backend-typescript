import { Message } from 'venom-bot';

export interface IMessageRepository {
  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  sendMessage(params: {
    message: string;
    from: string;
    to: string;
  }): Promise<boolean>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  getMessage(): Promise<string>;

}

export interface IMessageService {
  /**
   * Remove entry in the direct participant
   * @param params
   */
  sendMessage(params: {
    message: string;
    from: string;
    to: string;
  }): Promise<boolean>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  getMessage(): Promise<string>;

}

export interface ICurrencyUseCase {
  /**
   * Remove entry in DICT
   * @param params
   */
  sendMessage(params: {
    message: string;
    from: string;
    to: string;
  }): Promise<boolean>;

  /**
   * Remove entry from Topazio direct participant
   * @param params
   */
  getMessage(): Promise<string>;

}
