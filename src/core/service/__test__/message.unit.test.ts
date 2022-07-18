import Chance from 'chance';

import { MessageService } from '../message';

import { ServiceContext } from '../../../types/core';

describe('Message Service', () => {
  describe('#constructor', () => {
    it('doesn\'t construct without a ServiceContext object', () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const svc = new MessageService(undefined as unknown as ServiceContext);
        expect(svc).toBeUndefined();
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('TypeError');
        expect(error.message).toContain('\'messageRepository\' of undefined');
      }
    });

    it('constructs with an empty object', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const svc = new MessageService({} as ServiceContext);
      expect(svc).toBeDefined();
      expect(svc).toBeInstanceOf(MessageService);
      expect(svc).toHaveProperty('messageRepository', undefined);
    });
  });

  describe('#addLocalEntry', () => {
    it('should call send message with an message', async () => {
      const fakeRepo = {
        sendMessage: jest.fn(),
      };

      const svc = new MessageService({
        messageRepository: fakeRepo,
      } as unknown as ServiceContext);

      const message = {
        message: 'teste para enviar',
        from: '15465545',
        to: '15412545',
      };

      await svc.sendMessage(message);

      expect(fakeRepo.sendMessage).toHaveBeenCalledWith(message);
    });
  });
});
