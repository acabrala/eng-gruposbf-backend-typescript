import { Chance } from 'chance';

import {
  addEntrySchema,
  getEntry,
  searchEntrySchema,
  updateEntrySchema,
  listEntriesByBankAccount,
} from '../entry';

import {
  ActionReason,
  BankAccountType,
  DocumentType,
  KeyType,
} from '../../../../types/message';

const chance = new Chance();

describe('Entry schema unit tests', () => {
  describe('#searchEntry', () => {
    it
      .each(Object.values(KeyType))('should accept as a valid schema with %s key', (keyType) => {
        let keyValue;

        switch (keyType) {
          case KeyType.CPF: {
            keyValue = chance.cpf();
            break;
          }
          case KeyType.CNPJ: {
            keyValue = '25885475000133';
            break;
          }
          case KeyType.EMAIL: {
            keyValue = chance.email({ domain: 'example.com' });
            break;
          }
          case KeyType.PHONE: {
            keyValue = '5551999989898';
            break;
          }
          case KeyType.EVP: {
            keyValue = chance.guid({ version: 4 });
            break;
          }
          default: {
            keyValue = '';
          }
        }

        const data = {
          params: {
            ispb: chance.string({ numeric: true, length: 8 }),
          },
          query: {
            keyType,
            keyValue,
            document: chance.cpf({ formatted: true }),
          },
        };

        const { error } = searchEntrySchema.validate(data);

        expect(error).toBeUndefined();
      });

    it('throw error with empty query params', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        query: {},
      };

      const { error } = searchEntrySchema.validate(data);

      expect(error?.message).toMatch('"query.keyType" is required');
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 20 }),
        },
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
          document: chance.cpf({ formatted: true }),
        },
      };

      const { error } = searchEntrySchema.validate(data);

      expect(error?.message).toMatch('"params.ispb" length must be 8 characters long');
    });

    it('throw error with invalid document value', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
          document: chance.string({ numeric: true, length: 70 }),
        },
      };

      const { error } = searchEntrySchema.validate(data);

      expect(error?.message).toMatch('"query.document" failed custom validation because Document is invalid');
    });
  });

  describe('#getEntrySchema', () => {
    it('should accept as a valid schema', () => {
      const request = {
        params: {
          entryId: chance.guid({ version: 4 }),
        },
      };

      const { error } = getEntry.validate(request);

      expect(error).toBeUndefined();
    });

    it('should return error when entryId is invalid', () => {
      const request = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
          entryId: '123',
        },
      };

      const { error } = getEntry.validate(request);

      expect(error?.message).toMatch('"params.entryId" must be a valid GUID');
    });

    it('should return error when entryId is not provided', () => {
      const request = {
        params: {
        },
      };

      const { error } = getEntry.validate(request);

      expect(error?.message).toMatch('"params.entryId" is required');
    });

    it('should return error when the params are not provided', () => {
      const request = {
      };

      const { error } = getEntry.validate(request);

      expect(error?.message).toMatch('"params" is required');
    });
  });

  describe('#updateEntry', () => {
    it
      .each(Object.values(KeyType))('should accept as a valid schema with %s key', (keyType) => {
        let keyValue;

        switch (keyType) {
          case KeyType.CPF: {
            keyValue = chance.cpf();
            break;
          }
          case KeyType.CNPJ: {
            keyValue = '25885475000133';
            break;
          }
          case KeyType.EMAIL: {
            keyValue = chance.email({ domain: 'example.com' });
            break;
          }
          case KeyType.PHONE: {
            keyValue = '5551999989898';
            break;
          }
          case KeyType.EVP: {
            keyValue = chance.guid({ version: 4 });
            break;
          }
          default: {
            keyValue = '';
          }
        }

        const data = {
          params: {
            ispb: chance.string({ numeric: true, length: 8 }),
          },
          body: {
            reason: chance.pickone([
              ActionReason.USER_REQUESTED,
              ActionReason.TRANSFERRED_BANK_BRANCH,
              ActionReason.RECONCILIATION,
            ]),
            name: chance.name({ middle: true }),
            phone: chance.string({ numeric: true, length: 13 }),
            email: chance.email({ domain: 'example.com' }),
            document: {
              type: DocumentType.CPF,
              value: chance.cpf({ formatted: false }),
            },
            key: {
              type: keyType,
              value: keyValue,
            },
            bankAccount: {
              type: BankAccountType.CHECKING_ACCOUNT,
              branch: chance.string({ numeric: true, length: 4 }),
              number: chance.string({ numeric: true, length: 6 }),
              openingDate: chance.date().toISOString(),
            },

          },
        };

        const { error } = updateEntrySchema.validate(data);

        expect(error).toBeUndefined();
      });

    it('throw error with empty body params', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {},
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.reason" is required');
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 20 }),
        },
        body: {
          reason: chance.pickone(Object.values(ActionReason)),
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"params.ispb" length must be 8 characters long');
    });

    it('throw error with invalid reason', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: 'ANOTHER',
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.reason" must be one of [USER_REQUESTED, TRANSFERRED_BANK_BRANCH, RECONCILIATION');
    });

    it('throw error with invalid document value', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: ActionReason.USER_REQUESTED,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: '123',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.document.value" failed custom validation because CPF is invalid');
    });

    it('throw error with invalid key type', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: ActionReason.USER_REQUESTED,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: 'ANOTHER',
            value: chance.cpf({ formatted: false }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.key.type" must be one of [CPF, CNPJ, PHONE, EMAIL, EVP]');
    });

    it('throw error with invalid key value', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: ActionReason.USER_REQUESTED,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.CPF,
            value: '123',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.key.value" failed custom validation because CPF is invalid');
    });

    it('throw error with invalid CNPJ key value', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: ActionReason.USER_REQUESTED,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.CNPJ,
            value: '123',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.key.value" failed custom validation because CNPJ is invalid');
    });

    it('throw error when opening date is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: ActionReason.USER_REQUESTED,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message).toMatch('"body.bankAccount.openingDate" is required');
    });

    it('throw error when opening date is invalid', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          reason: ActionReason.USER_REQUESTED,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
            openingDate: 'quicachorrooquesocachorronao',
          },

        },
      };

      const { error } = updateEntrySchema.validate(data);

      expect(error?.message)
        .toMatch('"body.bankAccount.openingDate" failed custom validation because Account opening date is invalid');
    });
  });

  describe('#addEntry', () => {
    it('should accept as a valid schema', () => {
      const cpf = chance.cpf({ formatted: true });
      const entry = {
        body: {
          key: {
            type: KeyType.CPF,
            value: cpf,
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: cpf,
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);

      expect(error).toBeUndefined();
    });

    it('should accept as a valid schema (keytype email)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);

      expect(error).toBeUndefined();
    });

    it('should accept as a valid schema (keytype PHONE)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);

      expect(error).toBeUndefined();
    });

    it('should accept as a valid schema with key type evp and without value', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.EVP,
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);

      expect(error).toBeUndefined();
    });

    it('should throw when key is not provided', () => {
      const entry = {
        body: {
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);

      expect(error?.message).toMatch('"body.key" is required');
    });

    it('should throw when bankAccount is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.bankAccount" is required');
    });

    it('should throw when document is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.document" is required');
    });

    it('should throw when key.type is not provided', () => {
      const entry = {
        body: {
          key: {
            value: '+5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };
      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.key.type" is required');
    });

    it('should throw when key.value is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };
      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.key.value" is required');
    });

    it('should throw when bankAccount.branch is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.bankAccount.branch" is required');
    });

    it('should throw when bankAccount.number is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.bankAccount.number" is required');
    });

    it('should throw when name is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '+5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.name" is required');
    });

    it('should throw when document.type is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.document.type" is required');
    });

    it('should throw when person.document.value is not provided', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.PHONE,
            value: '5551999152514',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.document.value" is required');
    });

    it('should throw when key.value is invalid (EMAIL)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.EMAIL,
            value: '123',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.key.value" must be a valid email');
    });

    it('should throw when key is different from document (CNPJ)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.CNPJ,
            value: '6204825000015',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000',
          },
        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.key" must be equal document when key type is CNPJ');
    });

    it('should throw when key is different from document (CPF)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.CPF,
            value: '75892908070',
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: '7589290807',
          },
        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.key" must be equal document when key type is CPF');
    });

    it('should throw when document.value is invalid (CPF)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CPF,
            value: '123',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.document.value" failed custom validation because CPF is invalid');
    });

    it('should throw when document.value is invalid (CNPJ)', () => {
      const entry = {
        body: {
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          bankAccount: {
            type: BankAccountType.CHECKING_ACCOUNT,
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: chance.date().toISOString(),
          },
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          email: chance.email({ domain: 'example.com' }),
          document: {
            type: DocumentType.CNPJ,
            value: '123',
          },

        },
      };

      const { error } = addEntrySchema.validate(entry);
      expect(error?.message).toMatch('"body.document.value" failed custom validation because CNPJ is invalid');
    });
  });

  describe('#listEntriesByBankAccount', () => {
    it('throw error with invalid branch value', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        query: {
          branch: chance.string({ numeric: true, length: 24 }),
          number: chance.string({ numeric: true, length: 6 }),
        },
      };

      const { error } = listEntriesByBankAccount.validate(data);

      expect(error?.message).toMatch('"query.branch" length must be 4 characters long');
    });

    it('throw error without bank account number', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        query: {
          branch: chance.string({ numeric: true, length: 4 }),
        },
      };

      const { error } = listEntriesByBankAccount.validate(data);

      expect(error?.message).toMatch('"query.number" is required');
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 38 }),
        },
        query: {
          branch: chance.string({ numeric: true, length: 4 }),
          number: chance.string({ numeric: true, length: 6 }),
        },
      };

      const { error } = listEntriesByBankAccount.validate(data);

      expect(error?.message).toMatch('"params.ispb" length must be 8 characters long');
    });

    it('throw error without query params', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        query: {},
      };

      const { error } = listEntriesByBankAccount.validate(data);

      expect(error?.message).toMatch('"query.branch" is required');
    });
  });
});
