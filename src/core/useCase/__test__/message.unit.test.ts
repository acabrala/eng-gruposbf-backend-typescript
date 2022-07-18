import * as Uuid from '@somosphi/uuid';
import Chance from 'chance';
import moment from 'moment-timezone';
import * as R from 'ramda';

import { MessageService } from '../../service/message';
import { MessageUseCase } from '../message';

import { UseCaseContext } from '../../../types/core';

const chance = new Chance();

describe('Message Use Case', () => {
  describe('#constructor', () => {
    it('explodes with undefined UseCaseContext', () => {
      try {
        const uc = new MessageUseCase(undefined as unknown as UseCaseContext);
        expect(uc).toBeUndefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('name', 'TypeError');
        expect(error.message).toContain('messageService\' of undefined');
      }
    });

    it('constructs with an empty UseCaseContext object', () => {
      const uc = new MessageUseCase({} as UseCaseContext);
      expect(uc).toBeInstanceOf(MessageUseCase);
      expect(uc).toHaveProperty('sendMessage');
    });
  });

  describe('#sendMessage', () => {
    it('should return a valid body', async () => {
      const params = {
        message: chance.string({ length: 8 }),
        from: chance.string({ length: 13 }),
        to: chance.string({ length: 13 }),
      };

      const ctx = {
        messageService: {
          sendMessage: jest.fn().mockResolvedValue(params),
        },
      } as unknown as UseCaseContext;

      const messageUseCase = new MessageUseCase(ctx);

      const result = await messageUseCase.sendMessage(params);

      expect(result).toEqual(true);
    });

    it('should throw an error if entry exists in same ispb and it is owned by different person', async () => {
      const params = {
        message: chance.string({ length: 8 }),
        from: chance.string({ length: 13 }),
        to: chance.string({ length: 13 }),
      };

      const ctx = {
        messageService: {
          sendMessage: jest.fn().mockRejectedValue(params),
        },
      } as unknown as UseCaseContext;

      const messageUseCase = new MessageUseCase(ctx);

      await expect(messageUseCase.sendMessage(params)).rejects.toThrowError('Error');
    });
  });
});
