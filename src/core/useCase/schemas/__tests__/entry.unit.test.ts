// import * as Uuid from '@somosphi/uuid';
// import { Chance } from 'chance';

// import { updateEntrySchema, addEntrySchema, removeEntrySchema } from '../message';

// import {
//   KeyType, DocumentType, ActionReason, BankAccountType,
// } from '../../../../types/message';

// describe('Use case schema unit tests', () => {
//   const chance = new Chance();

//   describe('#addEntry', () => {
//     it('should accept as a valid schema', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema (keytype email)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema (keytype PHONE)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema with keytype EVP without key value', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.EVP,
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should throw when key is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error?.message).toMatch('"key" is required');
//     });

//     it('should throw when bankAccount is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount" is required');
//     });

//     it('should throw when person is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person" is required');
//     });

//     it('should throw when key.type is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.type" is required');
//     });

//     it('should throw when opening date is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error?.message).toMatch('"bankAccount.openingDate" is required');
//     });

//     it('should throw when opening date is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: 'The wolf - SIAMES',
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);

//       expect(error?.message)
//         .toMatch('"bankAccount.openingDate" failed custom validation because Account opening date is invalid');
//     });

//     it('should throw when key.value is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" is required');
//     });

//     it('should throw when bankAccount.branch is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.branch" is required');
//     });

//     it('should throw when bankAccount.type is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.type" is required');
//     });

//     it('should throw when bankAccount.number is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.number" is required');
//     });

//     it('should throw when person.name is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.name" is required');
//     });

//     it('should throw when person.document is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document" is required');
//     });

//     it('should throw when person.document.type is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.type" is required');
//     });

//     it('should throw when person.document.value is not provided', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.value" is required');
//     });

//     it('should throw when key.value is invalid (CPF)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" failed custom validation because CPF is invalid');
//     });

//     it('should throw when key.value is invalid (EMAIL)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.EMAIL,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" must be a valid email');
//     });

//     it('should throw when key.value is invalid (CNPJ)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CNPJ,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" failed custom validation because CNPJ is invalid');
//     });

//     it('should throw when key.value is invalid (PHONE)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.PHONE,
//           value: '1',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" length must be 13 characters long');
//     });

//     it('should throw when person.document.value is invalid (CPF)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CPF,
//             value: '123',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.value" failed custom validation because CPF is invalid');
//     });

//     it('should throw when person.document.value is invalid (CNPJ)', () => {
//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '123',
//           },
//         },

//       };

//       const { error } = addEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.value" failed custom validation because CNPJ is invalid');
//     });
//   });

//   describe('#updateEntry', () => {
//     it('should accept as a valid schema', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('throw when reason is CLOSED_BANK_ACCOUNT', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.CLOSED_BANK_ACCOUNT,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeDefined();
//       expect(error?.message).toMatch('"reason" must be one of [USER_REQUESTED, TRANSFERRED_BANK_BRANCH, RECONCILIATION]');
//     });

//     it('throw when reason is ENTRY_INACTIVE', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.ENTRY_INACTIVE,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeDefined();
//       expect(error?.message).toMatch('"reason" must be one of [USER_REQUESTED, TRANSFERRED_BANK_BRANCH, RECONCILIATION]');
//     });

//     it('should accept as a valid schema (reason TRANSFERRED_BANK_BRANCH)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.TRANSFERRED_BANK_BRANCH,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema (reason RECONCILIATION)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.RECONCILIATION,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema (keytype email)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema (keytype PHONE)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should accept as a valid schema (keytype EVP)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.EVP,
//           value: Uuid.generate(),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error).toBeUndefined();
//     });

//     it('should throw when key is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);

//       expect(error?.message).toMatch('"key" is required');
//     });

//     it('should throw when bankAccount is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount" is required');
//     });

//     it('should throw when person is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person" is required');
//     });

//     it('should throw when key.type is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.type" is required');
//     });

//     it('should throw when key.value is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" is required');
//     });

//     it('should throw when bankAccount.branch is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.branch" is required');
//     });

//     it('should throw when bankAccount.number is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.number" is required');
//     });

//     it('should throw when bankAccount.type is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           number: chance.string({ numeric: true, length: 10 }),
//           branch: chance.string({ numeric: true, length: 4 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.type" is required');
//     });

//     it('should throw when bankAccount.openingDate is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           number: chance.string({ numeric: true, length: 10 }),
//           branch: chance.string({ numeric: true, length: 4 }),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"bankAccount.openingDate" is required');
//     });

//     it('should throw when person.name is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.name" is required');
//     });

//     it('should throw when person.document is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document" is required');
//     });

//     it('should throw when person.document.type is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.type" is required');
//     });

//     it('should throw when person.document.value is not provided', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '5551999152514',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.value" is required');
//     });

//     it('should throw when key.value is invalid (CPF)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CPF,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" failed custom validation because CPF is invalid');
//     });

//     it('should throw when key.value is invalid (EMAIL)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.EMAIL,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" must be a valid email');
//     });

//     it('should throw when key.value is invalid (CNPJ)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.CNPJ,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" failed custom validation because CNPJ is invalid');
//     });

//     it('should throw when key.value is invalid (PHONE)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.PHONE,
//           value: '0000989897777',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" with value "0000989897777" fails to match the required pattern: /^[1-9][0-9]\\d{1,11}$/');
//     });

//     it('should throw when key.value is invalid (EVP)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.EVP,
//           value: '123',
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '62048250000159',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"key.value" must be a valid GUID');
//     });

//     it('should throw when person.document.value is invalid (CPF)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CPF,
//             value: '123',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.value" failed custom validation because CPF is invalid');
//     });

//     it('should throw when person.document.value is invalid (CNPJ)', () => {
//       const entry = {
//         ispb: chance.string({ length: 8, numeric: true }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 10 }),
//           openingDate: chance.date().toISOString(),
//           type: BankAccountType.CHECKING_ACCOUNT,
//         },
//         reason: ActionReason.USER_REQUESTED,
//         person: {
//           name: chance.name({ middle: true }),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           document: {
//             type: DocumentType.CNPJ,
//             value: '123',
//           },
//         },

//       };

//       const { error } = updateEntrySchema.validate(entry);
//       expect(error?.message).toMatch('"person.document.value" failed custom validation because CNPJ is invalid');
//     });
//   });

//   describe('#removeEntry', () => {
//     it('should accept the schema', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);

//       expect(error).toBeUndefined();
//     });

//     it('should accept the schema with key CPF', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);

//       expect(error).toBeUndefined();
//     });

//     it('should accept the schema with key PHONE', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.PHONE,
//             value: chance.string({ length: 11, numeric: true }),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);

//       expect(error).toBeUndefined();
//     });

//     it('should accept the schema with key EVP', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.EVP,
//             value: Uuid.generate(),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);

//       expect(error).toBeUndefined();
//     });

//     it('should accept the schema with key CNPJ', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.CNPJ,
//             value: chance.cnpj(),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);

//       expect(error).toBeUndefined();
//     });

//     it.each(Object.values(ActionReason))('should accept the schema with reason %s', (reason) => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.CNPJ,
//             value: chance.cnpj(),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);

//       expect(error).toBeUndefined();
//     });

//     it('should return error if key is not provided', () => {
//       const params = {
//         entry: {
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);
//       expect(error?.message).toMatch('"entry.key" is required');
//     });

//     it('should return error if key type is not provided', () => {
//       const params = {
//         entry: {
//           key: {
//             value: '10229094000129',
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);
//       expect(error?.message).toMatch('"entry.key.type" is required');
//     });

//     it('should return error if key value is not provided', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.CNPJ,
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//           reason: ActionReason.USER_REQUESTED,
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);
//       expect(error?.message).toMatch('"entry.key.value" is required');
//     });

//     it('should return error if ispb is not provided', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.CNPJ,
//             value: chance.cnpj(),
//           },
//         },
//         reason: ActionReason.USER_REQUESTED,
//       };

//       const { error } = removeEntrySchema.validate(params);
//       expect(error?.message).toMatch('"entry.ispb" is required');
//     });

//     it('should return error if reason is not provided', () => {
//       const params = {
//         entry: {
//           key: {
//             type: KeyType.CNPJ,
//             value: chance.cnpj(),
//           },
//           ispb: chance.string({ length: 8, numeric: true }),
//         },
//       };

//       const { error } = removeEntrySchema.validate(params);
//       expect(error?.message).toMatch('"entry.reason" is required');
//     });
//   });
// });
