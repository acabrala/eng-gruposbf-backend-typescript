import { Channel, Options } from 'amqplib';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import knex from 'knex';

import { ICurrencyRepository } from './currency';

/* Http Adapter */
export interface IHttpAdapterConstructs {
  new(config: AxiosRequestConfig): IHttpAdapter;
}

export interface IHttpAdapter {
  send(config: AxiosRequestConfig): Promise<AxiosResponse>;
}

/* MySQL Adapter */
export type MysqlDatabase = knex;

export type MysqlAdapterConfig = {
  dbConn: MysqlDatabase;
};

export interface IMysqlAdapter {
  db: knex.QueryBuilder;
  tableName: string;
}

/* Message Bus Adapter */
export type MessageBus = Channel;
export type MessageContent = unknown;
export type MessagePublishOptions = Options.Publish;

export interface IMessageBusAdapterConstructs {
  new(config?: MessageBusAdapterConfig): IMessageBusAdapter;
}

export enum MessageBusType {
  noConfirmation = 0,
  withConfirmation = 1,
}

export type GetInstanceOptions = {
  vHost: string;
};

export type MessageBusAdapterConfig = {
  messageBusType: MessageBusType;
};

export interface IMessageBusAdapter {
  publish(
    router: string,
    routingKey: string,
    vHost: string,
    content: MessageContent,
    options?: MessagePublishOptions,
  ): Promise<boolean>;
}

export interface ISendMessageAdapter {
  sendMessage(
    number: string,
    message: string,
  ): Promise<any>;
}

/* Infrastructure */
export type Container = {
  currencyRepository: ICurrencyRepository;
};

export type ContainerConfig = {
  itauFacadeUrl: string;
};
