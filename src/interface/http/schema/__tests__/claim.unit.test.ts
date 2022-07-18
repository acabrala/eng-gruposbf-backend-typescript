import { Chance } from 'chance';

import {
  listClaimsSchema,
  putClaimSchema,
  createClaimSchema,
  getClaimByIdSchema,
} from '../claim';

import {
  ClaimAction,
  ClaimReason,
  ClaimStatus,
  ClaimType,
} from '../../../../types/claim';
import {
  BankAccountType,
  DocumentType,
  KeyType,
} from '../../../../types/message';

describe('Claim unit tests in the interface http to list claims', () => {
  const chance = new Chance();

  describe('#listClaimsSchema', () => {
    it('should accept as a valid schema', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
          accountBranch: chance.string({ numeric: true, length: 4 }),
          accountNumber: chance.string({ numeric: true, length: 6 }),
          status: ClaimStatus.CONFIRMED,
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error).toBeUndefined();
    });

    it('should accept as a valid schema with key info', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error).toBeUndefined();
    });

    it('should accept as a valid schema with account info', () => {
      const request = {
        query: {
          accountBranch: chance.string({ numeric: true, length: 4 }),
          accountNumber: chance.string({ numeric: true, length: 6 }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error).toBeUndefined();
    });

    it('should accept as a valid schema without status', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
          accountBranch: chance.string({ numeric: true, length: 4 }),
          accountNumber: chance.string({ numeric: true, length: 6 }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error).toBeUndefined();
    });

    it('should return error if keyType is invalid', () => {
      const request = {
        query: {
          keyType: chance.string(),
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"query.keyType" must be one of [EMAIL, PHONE, CPF, CNPJ]');
    });

    it('should return error if key value is an invalid CPF', () => {
      const request = {
        query: {
          keyType: KeyType.CPF,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"query.keyValue" failed custom validation because CPF is invalid');
    });

    it('should return error if key value is an invalid CNPJ', () => {
      const request = {
        query: {
          keyType: KeyType.CNPJ,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"query.keyValue" failed custom validation because CNPJ is invalid');
    });

    it('should return error if key value is an invalid EMAIL', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.string(),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"query.keyValue" must be a valid email');
    });

    it('should return error if key value is an invalid PHONE', () => {
      const request = {
        query: {
          keyType: KeyType.PHONE,
          keyValue: chance.string({ length: 13 }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('fails to match the required pattern');
    });

    it('should return error if keyType is invalid (EVP)', () => {
      const request = {
        query: {
          keyType: KeyType.EVP,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"query.keyType" must be one of [EMAIL, PHONE, CPF, CNPJ]');
    });

    it('should return error when ispb is not provided', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {},
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"params.ispb" is required');
    });

    it('should return error if no params is provided', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"params" is required');
    });

    it('should return error if ispb is invalid', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: '1234',
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"params.ispb" length must be 8 characters long');
    });

    it('should return error if ispb is invalid', () => {
      const request = {
        query: {
          keyType: KeyType.EMAIL,
          keyValue: chance.email({ domain: 'example.com' }),
        },
        params: {
          ispb: 'ABC',
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"params.ispb" with value "ABC" fails to match the required pattern');
    });

    it('should return an erro when only status in provided', () => {
      const request = {
        query: {
          status: ClaimStatus.CONFIRMED,
        },
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
      };

      const { error } = listClaimsSchema.validate(request);
      expect(error?.message).toMatch('"query" is not allowed');
    });
  });

  describe('#createClaimSchema', () => {
    it
      .each(Object.values(ClaimType))('should accept as a valid schema with %s claim type', (claimType) => {
        const data = {
          params: {
            ispb: chance.string({ numeric: true, length: 8 }),
          },
          body: {
            type: claimType,
            name: chance.name({ middle: true }),
            phone: chance.string({ numeric: true, length: 13 }),
            document: {
              type: DocumentType.CNPJ,
              value: '62048250000159',
            },
            key: {
              type: KeyType.CPF,
              value: chance.cpf({ formatted: true }),
            },
            bankAccount: {
              branch: chance.string({ numeric: true, length: 4 }),
              number: chance.string({ numeric: true, length: 10 }),
              openingDate: new Date().toISOString(),
              type: chance.pickone(Object.values(BankAccountType)),
            },
          },
        };

        const { error } = createClaimSchema.validate(data);

        expect(error).toBeUndefined();
      });

    it.each([
      KeyType.CPF,
      KeyType.CNPJ,
      KeyType.EMAIL,
      KeyType.PHONE,
    ])('should accept as a valid schema with %s key', (keyType) => {
      let keyValue;

      switch (keyType) {
        case KeyType.CPF: {
          keyValue = chance.cpf();
          break;
        }
        case KeyType.CNPJ: {
          keyValue = chance.cnpj();
          break;
        }
        case KeyType.EMAIL: {
          keyValue = chance.email({ domain: 'example.com' });
          break;
        }
        case KeyType.PHONE: {
          keyValue = chance.string({ numeric: true, length: 13 });
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
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: chance.cnpj(),
          },
          key: {
            type: keyType,
            value: keyValue,
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error).toBeUndefined();
    });

    it('should throw when type is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.type" is required');
    });

    it('should throw when name is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.name" is required');
    });

    it('should throw when phone is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.phone" is required');
    });

    it('should throw when document is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.document" is required');
    });

    it('should throw when document.type is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            value: '62048250000159',
          },
          key: {
            type: KeyType.EVP,
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.document.type" is required');
    });

    it('should throw when document.value is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.document.value" is required');
    });

    it('should throw when key is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.key" is required');
    });

    it('should throw when key.type is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.PORTABILITY,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.key.type" is required');
    });

    it('should throw when key.type is EVP', () => {
      const data = {
        body: {
          type: chance.pickone(Object.values(ClaimType)),
          name: chance.name(),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.EVP,
            value: chance.guid({ version: 4 }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 6 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('not allowed value for EVP');
    });

    it('should throw when key.value is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.PORTABILITY,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.key.value" is required');
    });

    it('should throw when bankAccount is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.bankAccount" is required');
    });

    it('should throw when bankAccount.branch is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.bankAccount.branch" is required');
    });

    it('should throw when bankAccount.number is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.bankAccount.number" is required');
    });

    it('should throw when bankAccount.openingDate is not provided', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          type: ClaimType.OWNERSHIP,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch('"body.bankAccount.openingDate" is required');
    });

    it('should default to PAYMENT_ACCOUNT when bankAccount.type is not provided', () => {
      const data = {
        body: {
          type: chance.pickone(Object.values(ClaimType)),
          name: chance.name(),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: false }),
          },
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 8 }),
            openingDate: new Date().toISOString(),
          },
        },
      };

      const { error, value } = createClaimSchema.validate(data);

      expect(error).toBeUndefined();
      expect(value.body.bankAccount.type).toEqual(BankAccountType.PAYMENT_ACCOUNT);
    });

    it('throw error with invalid ispb', () => {
      const data = {
        params: {
          ispb: chance.string({ numeric: true, length: 12 }),
        },
        body: {
          type: ClaimType.PORTABILITY,
          name: chance.name({ middle: true }),
          phone: chance.string({ numeric: true, length: 13 }),
          document: {
            type: DocumentType.CNPJ,
            value: '62048250000159',
          },
          key: {
            type: KeyType.CPF,
            value: chance.cpf({ formatted: true }),
          },
          bankAccount: {
            branch: chance.string({ numeric: true, length: 4 }),
            number: chance.string({ numeric: true, length: 10 }),
            openingDate: new Date().toISOString(),
            type: chance.pickone(Object.values(BankAccountType)),
          },
        },
      };

      const { error } = createClaimSchema.validate(data);

      expect(error?.message).toMatch(
        '"params.ispb" length must be 8 characters long',
      );
    });
  });

  describe('#getClaimById', () => {
    it('should accept as a valid schema', () => {
      const request = {
        params: {
          id: chance.guid({ version: 4 }),
        },
      };

      const { error } = getClaimByIdSchema.validate(request);
      expect(error).toBeUndefined();
    });

    it('should return error if params are not provided', () => {
      const request = {};

      const { error } = getClaimByIdSchema.validate(request);
      expect(error?.message).toMatch('"params" is required');
    });

    it('should return error if id is not provided', () => {
      const request = {
        params: {},
      };

      const { error } = getClaimByIdSchema.validate(request);
      expect(error?.message).toMatch('"params.id" is required');
    });

    it('should return error if id is not a valid GUID', () => {
      const request = {
        params: {
          id: chance.string(),
        },
      };

      const { error } = getClaimByIdSchema.validate(request);
      expect(error?.message).toMatch('"params.id" must be a valid GUID');
    });
  });

  describe('#putClaim', () => {
    it.each(Object.values(ClaimAction))('should accept as a valid schema with action: %s', (claimAction) => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: claimAction,
          reason: ClaimReason.USER_REQUESTED,
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error).toBeUndefined();
    });

    it.each(Object.values(ClaimReason))('should accept as a valid schema with reason: %s', (claimReason) => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: ClaimAction.CANCEL,
          reason: claimReason,
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error).toBeUndefined();
    });

    it('throws error with invalid action', () => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: 'JUMP',
          reason: ClaimReason.USER_REQUESTED,
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error?.message).toContain('"body.action" must be one of [CONFIRM, CANCEL]');
    });

    it('throws error when is not informed required field "reason"', () => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: ClaimAction.CONFIRM,
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error?.message).toContain('"body.reason" is required');
    });

    it('throws error when is not informed required field "key"', () => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: ClaimAction.CONFIRM,
          reason: ClaimReason.USER_REQUESTED,
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error?.message).toContain('"body.key" is required');
    });

    it('throws error when is not informed required field "document"', () => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: ClaimAction.CONFIRM,
          reason: ClaimReason.USER_REQUESTED,
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error?.message).toContain('"body.document" is required');
    });

    it('throws error when is not informed body', () => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {},
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error?.message).toContain('"body.action" is required');
    });

    it('throws error when is invalid reason', () => {
      const claim = {
        params: {
          ispb: chance.string({ numeric: true, length: 8 }),
        },
        body: {
          action: ClaimAction.CANCEL,
          reason: 'ANOTHER',
          key: {
            type: KeyType.EMAIL,
            value: chance.email({ domain: 'example.com' }),
          },
          document: {
            type: DocumentType.CPF,
            value: chance.cpf({ formatted: true }),
          },
        },
      };

      const { error } = putClaimSchema.validate(claim);

      expect(error?.message).toContain('"body.reason" must be one of [USER_REQUESTED, CLOSED_BANK_ACCOUNT, FRAUD]');
    });
  });
});
