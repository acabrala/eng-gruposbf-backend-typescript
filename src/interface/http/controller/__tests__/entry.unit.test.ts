import * as Uuid from '@somosphi/uuid';
import Chance from 'chance';
import httpStatus from 'http-status-codes';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import {
  InternalServerError,
  InvalidEntryToList,
  InvalidEntryToSearch,
  InvalidProperties,
  NotFoundError,
} from '../../../../util/error';
import { MessageController } from '../message';

import { Container } from '../../../../types/core';
import { HttpControllerConfig } from '../../../../types/interface';

const chance = new Chance();

describe('Message Controller', () => {
  describe('#constructor', () => {
    it('should construct with correct context', async () => {
      const coreContainer = {
        messageUseCase: {
          sendMessage: jest.fn(),
        },
      } as unknown as Container;
      const validator = jest.fn();

      const controller = new MessageController({ coreContainer, validator });

      expect(controller).toBeDefined();
      expect(controller.sendMessage).toBeInstanceOf(Function);
    });

    it('should explodes with empty context', async () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        new MessageController(); // eslint-disable-line no-new
      }).toThrow('Cannot destructure property');
    });
  });

  describe('#sendMessage', () => {
    it('should send an message with success', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const params = {
        message: 'test',
        from: '24524455',
        to: '54554565484',
      };

      const coreContainer = {
        messageUseCase: {
          sendMessage: jest.fn().mockReturnThis(),
        },
      } as unknown as Container;

      const controller = new MessageController({ coreContainer } as HttpControllerConfig);

      req.setBody(params);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.sendMessage(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(coreContainer.messageUseCase.sendMessage).toHaveBeenCalledWith({
        message: params.message,
        from: params.from,
        to: params.to,
      });
    });

    it('should call next function with empty core', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {} as unknown as Container;

      const controller = new MessageController({ coreContainer } as HttpControllerConfig);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.sendMessage(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('Cannot read property \'sendMessage\' of undefined'));
    });

    it('should call next function with an unexpected error in use case', async () => {
      const req = new Request();
      const res = new Response();
      const next = jest.fn();

      const coreContainer = {
        messageUseCase: {
          sendMessage: jest.fn(() => {
            throw new Error('some error');
          }),
        },
      } as unknown as Container;

      const controller = new MessageController({ coreContainer } as HttpControllerConfig);

      req.setBody('');

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await controller.sendMessage(req, res, next);

      expect(next).toHaveBeenCalledWith(new InternalServerError('some error'));
    });
  });
});
