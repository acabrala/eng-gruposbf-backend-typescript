import { Chance } from 'chance';

import { addCurrencySchema } from '../currency';

describe('Use case schema unit tests', () => {
  const chance = new Chance();

  describe('#addCurrency', () => {
    it('should accept as a valid schema', () => {
      const currency = {
        value: 5.23,
        name: 'EUR',
      };

      const { error } = addCurrencySchema.validate(currency);

      expect(error).toBeUndefined();
    });

    it('should throw when value is not provided', () => {
      const currency = {
        name: 'EUR',
      };

      const { error } = addCurrencySchema.validate(currency);

      expect(error?.message).toMatch('"value" is required');
    });

    it('should throw when name is not provided', () => {
      const currency = {
        value: 5.35,
      };

      const { error } = addCurrencySchema.validate(currency);
      expect(error?.message).toMatch('"name" is required');
    });
  });

  describe('#addCurrency', () => {
    it('should accept as a valid schema', () => {
      const currency = {
        value: 5.23,
        name: 'EUR',
      };

      const { error } = addCurrencySchema.validate(currency);

      expect(error).toBeUndefined();
    });

    it('should throw when value is not provided', () => {
      const currency = {
        name: 'EUR',
      };

      const { error } = addCurrencySchema.validate(currency);

      expect(error?.message).toMatch('"value" is required');
    });

    it('should throw when name is not provided', () => {
      const currency = {
        value: 5.35,
      };

      const { error } = addCurrencySchema.validate(currency);
      expect(error?.message).toMatch('"name" is required');
    });
  });
});
