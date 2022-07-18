import {
  connect,
  Channel,
  ConfirmChannel,
  Connection,
  Options,
} from 'amqplib';
import R from 'ramda';

import { env } from './env';

// TODO handle channel close
// TODO handle reconnection

const config: Options.Connect = {
  protocol: env.amqpProtocol,
  hostname: env.amqpHostname,
  port: env.amqpPort,
  username: env.amqpUsername,
  password: env.amqpPassword,
};

const connection: { [key: string]: Connection } = {};

const _getConnection = async (vHost: string) => {
  if (!connection[vHost]) {
    const newConn = await connect(R.assoc('vhost', vHost, config));
    connection[vHost] = newConn;
  }

  return connection;
};

async function getChannel(vHost: string): Promise<Channel> {
  const conn = await _getConnection(vHost);
  const channel = await conn[vHost].createChannel();

  return channel;
}

async function getConfirmChannel(vHost: string): Promise<ConfirmChannel> {
  const conn = await _getConnection(vHost);
  const channel = await conn[vHost].createConfirmChannel();

  return channel;
}

export {
  getChannel,
  getConfirmChannel,
};
