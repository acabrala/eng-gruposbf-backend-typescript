// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import * as Uuid from '@somosphi/uuid';
// import Chance from 'chance';
// import crypto from 'crypto';
// import httpStatus from 'http-status-codes';
// import nock from 'nock';

// import {
//   FailedToRemoveEntry,
//   FailedToUpdateEntry,
//   InvalidEntryToList,
//   InvalidEntryToRemove,
//   InvalidEntryToSearch,
// } from '../../../util/error';
// import { HttpAdapter } from '../../adapter/http';
// import { MysqlAdapter } from '../../adapter/mysql';
// import {
//   cidBinaryToString,
//   cidStringToBinary,
//   EntryRepository,
//   EntryRepositoryContext,
// } from '../entry';

// import { DirectParticipant, Credentials } from '../../../types/credentials';
// import {
//   ActionReason,
//   KeyType,
//   PersonType,
//   DocumentType,
//   UpdateLocalEntryParams,
//   BankAccount,
//   Entry,
//   BankAccountType,
//   KeyStatus,
// } from '../../../types/message';
// import { ContainerConfig, IHttpAdapterConstructs, IMysqlAdapter } from '../../../types/infrastructure';

// const chance = new Chance();

// const CID = /^[0-9a-f]{64}$/;

// describe('Entry Repository', () => {
//   describe('#constructor', () => {
//     it('construct with all properties in context', () => {
//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config: {
//           topazioFacadeUrl: chance.url(),
//         },
//         mysqlAdapter: fakeMysql,
//         httpAdapter: jest.fn(),
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       expect(repo).toBeDefined();
//     });

//     it('explodes to construct without context', () => {
//       expect(() => {
//         // eslint-disable-next-line no-new
//         new EntryRepository({} as EntryRepositoryContext);
//       })
//         .toThrow(/Cannot read (properties|property 'topazioFacadeUrl') of undefined/);
//     });

//     it('constructs with only httpAdapter', () => {
//       const ctx = {
//         config: {
//           topazioFacadeUrl: chance.url(),
//         },
//         httpAdapter: jest.fn(),
//       } as unknown as EntryRepositoryContext;

//       expect(() => {
//         // eslint-disable-next-line no-new
//         new EntryRepository(ctx);
//       })
//         .toThrow(/Cannot set (properties|property 'tableName') of undefined/);
//     });

//     it('constructs with only mysqlAdapter', () => {
//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config: {
//           topazioFacadeUrl: chance.url(),
//         },
//         mysqlAdapter: fakeMysql,
//       } as unknown as EntryRepositoryContext;

//       expect(() => {
//         // eslint-disable-next-line no-new
//         new EntryRepository(ctx);
//       })
//         .toThrow('httpAdapter is not a constructor');
//     });
//   });

//   describe('#removeEntryFromTopazio', () => {
//     it
//       .each(Object.values(ActionReason))('should remove an entry with success with %s reason', async (reason) => {
//         const config = {
//           topazioFacadeUrl: chance.url(),
//         };

//         const ctx = {
//           config,
//           mysqlAdapter: MysqlAdapter,
//           httpAdapter: HttpAdapter,
//         } as unknown as EntryRepositoryContext;

//         const repo = new EntryRepository(ctx);

//         const params = {
//           entry: {
//             ispb: chance.string({ numeric: true, length: 8 }),
//             key: {
//               type: KeyType.CPF,
//               value: chance.cpf({ formatted: false }),
//             },
//             reason,
//           },
//           credentials: {
//             ispb: chance.string({ numeric: true, length: 8 }),
//             data: {
//               directParticipant: DirectParticipant.TOPAZIO,
//               clientId: chance.string({ alpha: true, length: 10 }),
//               clientSecret: chance.string({ alpha: true, length: 20 }),
//             },
//           },
//         };

//         nock(config.topazioFacadeUrl)
//           .delete('/v1/dict/entries')
//           .query({
//             reason: params.entry.reason,
//             keyType: params.entry.key.type,
//             keyValue: params.entry.key.value,
//           })
//           .reply(httpStatus.OK, {
//             key: params.entry.key.value,
//             keyType: params.entry.key.type,
//           });

//         let errorDetails;
//         try {
//           await repo.removeEntryFromTopazio(params);
//         } catch (error) {
//           errorDetails = error;
//         }

//         expect(errorDetails).toBeUndefined();
//       });

//     it('throw unexpected error because middleware not return properties', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => ({
//             del: jest.fn(),
//           })),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//           reason: ActionReason.CLOSED_BANK_ACCOUNT,
//         },
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ alpha: true, length: 10 }),
//             clientSecret: chance.string({ alpha: true, length: 20 }),
//           },
//         },
//       };

//       nock(config.topazioFacadeUrl)
//         .delete('/v1/dict/entries')
//         .query({
//           reason: 'BRANCH_TRANSFER',
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//         })
//         .reply(httpStatus.OK, {});

//       try {
//         await repo.removeEntryFromTopazio(params);
//       } catch (error) {
//         expect(error).toBeInstanceOf(FailedToRemoveEntry);
//         expect(error).toHaveProperty('message', 'Failed to remove a remote entry');
//         expect(error).toHaveProperty('details', [
//           { message: 'Unexpected error while removing a remote entry' },
//         ]);
//       }
//     });
//   });

//   describe('#removeEntryFromItau', () => {
//     it
//       .each(Object.values(ActionReason))('should remove an entry with success with %s reason', async (reason) => {
//         const config = {
//           itauFacadeUrl: chance.url(),
//         };

//         const ctx = {
//           config,
//           mysqlAdapter: MysqlAdapter,
//           httpAdapter: HttpAdapter,
//         } as unknown as EntryRepositoryContext;

//         const repo = new EntryRepository(ctx);

//         const params = {
//           entry: {
//             ispb: chance.string({ numeric: true, length: 8 }),
//             key: {
//               type: KeyType.CPF,
//               value: chance.cpf({ formatted: false }),
//             },
//             reason,
//           },
//           credentials: {
//             ispb: chance.string({ numeric: true, length: 8 }),
//             data: {
//               directParticipant: DirectParticipant.ITAU,
//               clientId: chance.string({ alpha: true, length: 10 }),
//               clientSecret: chance.string({ alpha: true, length: 20 }),
//             },
//           },
//         };

//         nock(config.itauFacadeUrl)
//           .delete('/v1/dict/entries')
//           .query({
//             reason: params.entry.reason,
//             keyType: params.entry.key.type,
//             keyValue: params.entry.key.value,
//             ispb: params.entry.ispb,
//           })
//           .reply(httpStatus.OK, {
//             key: params.entry.key.value,
//             keyType: params.entry.key.type,
//           });

//         let errorDetails;
//         try {
//           await repo.removeEntryFromItau(params);
//         } catch (error) {
//           errorDetails = error;
//         }

//         expect(errorDetails).toBeUndefined();
//       });

//     it('should throw an Unexpected error when removing entry', async () => {
//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: MysqlAdapter,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//           reason: ActionReason.CLOSED_BANK_ACCOUNT,
//         },
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.ITAU,
//             clientId: chance.string({ alpha: true, length: 10 }),
//             clientSecret: chance.string({ alpha: true, length: 20 }),
//           },
//         },
//       };

//       nock(config.itauFacadeUrl)
//         .delete('/v1/dict/entries')
//         .query({
//           reason: params.entry.reason,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           ispb: params.entry.ispb,
//         })
//         .reply(httpStatus.INTERNAL_SERVER_ERROR);

//       expect.assertions(3);
//       try {
//         await repo.removeEntryFromItau(params);
//       } catch (error) {
//         expect(error).toBeInstanceOf(FailedToRemoveEntry);
//         expect(error).toHaveProperty('message', 'Failed to remove a remote entry');
//         expect(error).toHaveProperty('details', [
//           { message: 'Unexpected error while removing a remote entry' },
//         ]);
//       }
//     });

//     it('should throw a not found error when removing entry', async () => {
//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: MysqlAdapter,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//           reason: ActionReason.CLOSED_BANK_ACCOUNT,
//         },
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.ITAU,
//             clientId: chance.string({ alpha: true, length: 10 }),
//             clientSecret: chance.string({ alpha: true, length: 20 }),
//           },
//         },
//       };

//       nock(config.itauFacadeUrl)
//         .delete('/v1/dict/entries')
//         .query({
//           reason: params.entry.reason,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           ispb: params.entry.ispb,
//         })
//         .reply(httpStatus.NOT_FOUND);

//       expect.assertions(2);
//       try {
//         await repo.removeEntryFromItau(params);
//       } catch (error) {
//         expect(error).toBeInstanceOf(InvalidEntryToRemove);
//         expect(error).toHaveProperty('message', 'Invalid entry to remove');
//       }
//     });
//   });

//   describe('#removeLocalEntry', () => {
//     it('should call remove with a valid param', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const del = jest.fn();

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => ({
//             del,
//           })),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//       };

//       await repo.removeLocalEntry(params);

//       expect(fakeMysql.db.where).toHaveBeenCalledWith({
//         keyType: params.key.type,
//         keyValue: params.key.value,
//       });
//     });

//     it('should call remove with a valid param and call del', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const del = jest.fn();

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => ({
//             del,
//           })),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//       };

//       await repo.removeLocalEntry(params);

//       expect(del).toHaveBeenCalled();
//     });

//     it('should throw when mysql return error', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const del = jest.fn(() => {
//         throw new Error('I love unit tests');
//       });

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => ({
//             del,
//           })),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//       };

//       try {
//         await repo.removeLocalEntry(params);
//       } catch (error) {
//         expect(error).toBeInstanceOf(FailedToRemoveEntry);
//         expect(error).toHaveProperty('message', 'Failed to remove a local entry');
//         expect(error).toHaveProperty('details', [
//           { message: 'I love unit tests' },
//         ]);
//       }
//     });
//   });

//   describe('#searchEntryFromTopazio', () => {
//     it.each(
//       Object.values(BankAccountType),
//     )('should return an entry from Topazio with bank type %s', async (bankAccountType) => {
//       let accountType;

//       switch (bankAccountType) {
//         case BankAccountType.CHECKING_ACCOUNT: {
//           accountType = 'CURRENT_OR_DIGITAL';
//           break;
//         }
//         case BankAccountType.SALARY_ACCOUNT: {
//           accountType = 'SALARY';
//           break;
//         }
//         case BankAccountType.SAVINGS_ACCOUNT: {
//           accountType = 'SAVINGS';
//           break;
//         }
//         case BankAccountType.PAYMENT_ACCOUNT: {
//           accountType = 'PAYMENT';
//           break;
//         }
//         default: {
//           break;
//         }
//       }

//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           person: {
//             document: {
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         } as Entry,
//       };

//       const bankAccount = {
//         type: bankAccountType,
//         branch: chance.string({ numeric: true, length: 4 }),
//         number: chance.string({ numeric: true, length: 8 }),
//       };

//       const documentValue = chance.cpf({ formatted: false });

//       const response = {
//         person: {
//           type: PersonType.NATURAL_PERSON,
//           name: chance.name(),
//           document: {
//             type: DocumentType.CPF,
//             value: documentValue,
//           },
//         },
//         key: params.entry.key,
//         bankAccount: {
//           branch: bankAccount.branch,
//           number: bankAccount.number,
//           type: accountType,
//         },
//       };

//       nock(config.topazioFacadeUrl)
//         .get('/v1/dict/entries')
//         .query({
//           ispb: params.entry.ispb,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           document: params.entry.person.document.value,
//         })
//         .reply(httpStatus.OK, response);

//       const result = await repo.searchEntryFromTopazio(params);

//       expect(result).toEqual({
//         person: {
//           type: response.person.type,
//           name: response.person.name,
//           document: {
//             type: DocumentType.CPF,
//             value: documentValue,
//           },
//         },
//         key: params.entry.key,
//         bankAccount: {
//           branch: bankAccount.branch,
//           number: bankAccount.number,
//           type: bankAccount.type,
//         },
//       });
//     });

//     it('throw error when not exists entry from Topazio', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           person: {
//             document: {
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         } as Entry,
//       };

//       nock(config.topazioFacadeUrl)
//         .get('/v1/dict/entries')
//         .query({
//           ispb: params.entry.ispb,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           document: params.entry.person.document.value,
//         })
//         .reply(httpStatus.NOT_FOUND, {});

//       await expect(repo.searchEntryFromTopazio(params))
//         .rejects
//         .toThrow(new InvalidEntryToSearch('Invalid entry to search'));
//     });

//     it('throw an unexpected error when to search an entry from Topazio', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           person: {
//             document: {
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         } as Entry,
//       };

//       nock(config.topazioFacadeUrl)
//         .get('/v1/dict/entries')
//         .query({
//           ispb: params.entry.ispb,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           document: params.entry.person.document.value,
//         })
//         .reply(httpStatus.INTERNAL_SERVER_ERROR, {
//           message: 'some error',
//         });

//       expect(repo.searchEntryFromTopazio(params))
//         .rejects
//         .toThrow('Failed to search an entry');
//     });
//   });

//   describe('#searchEntryFromItau', () => {
//     it.each(
//       Object.values(BankAccountType),
//     )('should return an entry from Itau with bank type %s', async (bankAccountType) => {
//       type Context = {
//         config: ContainerConfig;
//         mysqlAdapter: IMysqlAdapter;
//         httpAdapter: IHttpAdapterConstructs;
//       };

//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as Context;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.ITAU,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           person: {
//             document: {
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         } as Entry,
//         endToEndId: chance.string(),
//       };

//       const bankAccount = {
//         type: bankAccountType,
//         branch: chance.string({ numeric: true, length: 4 }),
//         number: chance.string({ numeric: true, length: 8 }),
//       };

//       const documentValue = chance.cpf({ formatted: false });

//       const response = {
//         person: {
//           type: PersonType.NATURAL_PERSON,
//           name: chance.name(),
//           document: {
//             type: DocumentType.CPF,
//             value: documentValue,
//           },
//         },
//         key: params.entry.key,
//         bankAccount: {
//           branch: bankAccount.branch,
//           number: bankAccount.number,
//           type: bankAccountType,
//         },
//       };

//       nock(config.itauFacadeUrl)
//         .get('/v1/dict/entries')
//         .query({
//           ispb: params.entry.ispb,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           document: params.entry.person.document.value,
//           endToEndId: params.endToEndId,
//         })
//         .reply(httpStatus.OK, response);

//       const result = await repo.searchEntryFromItau(params);

//       expect(result).toEqual({
//         person: {
//           type: response.person.type,
//           name: response.person.name,
//           document: {
//             type: DocumentType.CPF,
//             value: documentValue,
//           },
//         },
//         key: params.entry.key,
//         bankAccount: {
//           branch: bankAccount.branch,
//           number: bankAccount.number,
//           type: bankAccount.type,
//         },
//       });
//     });

//     it('throw error when not exists entry from Itau', async () => {
//       type Context = {
//         config: ContainerConfig;
//         mysqlAdapter: IMysqlAdapter;
//         httpAdapter: IHttpAdapterConstructs;
//       };

//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as Context;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.ITAU,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           person: {
//             document: {
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         } as Entry,
//         endToEndId: chance.string(),
//       };

//       nock(config.itauFacadeUrl)
//         .get('/v1/dict/entries')
//         .query({
//           ispb: params.entry.ispb,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           document: params.entry.person.document.value,
//           endToEndId: params.endToEndId,
//         })
//         .reply(httpStatus.NOT_FOUND, {});

//       await expect(repo.searchEntryFromItau(params))
//         .rejects
//         .toThrow(new InvalidEntryToSearch('Invalid entry to search'));
//     });

//     it('throw an unexpected error when to search an entry from Itau', async () => {
//       type Context = {
//         config: ContainerConfig;
//         mysqlAdapter: IMysqlAdapter;
//         httpAdapter: IHttpAdapterConstructs;
//       };

//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as Context;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.ITAU,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.EMAIL,
//             value: chance.email({ domain: 'example.com' }),
//           },
//           person: {
//             document: {
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         } as Entry,
//         endToEndId: chance.string(),
//       };

//       nock(config.itauFacadeUrl)
//         .get('/v1/dict/entries')
//         .query({
//           ispb: params.entry.ispb,
//           keyType: params.entry.key.type,
//           keyValue: params.entry.key.value,
//           document: params.entry.person.document.value,
//           endToEndId: params.endToEndId,
//         })
//         .reply(httpStatus.INTERNAL_SERVER_ERROR, {
//           message: 'some error',
//         });

//       expect(repo.searchEntryFromItau(params))
//         .rejects
//         .toThrow('Failed to search an entry');
//     });
//   });

//   describe('#updateLocalEntry', () => {
//     it('should update a local entry', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const update = jest.fn().mockReturnThis();
//       const andWhere = jest.fn(() => ({ update }));
//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           whereRaw: jest.fn(() => ({
//             andWhere,
//           })),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         filters: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//         data: {
//           key: {
//             status: chance.pickone(Object.values(KeyStatus)),
//           },
//           participant: chance.name(),
//           bankAccount: {
//             type: BankAccountType.CHECKING_ACCOUNT,
//             branch: chance.string({ numeric: true }),
//             number: chance.string({ numeric: true }),
//             openingDate: chance.date().toISOString(),
//           },
//           person: {
//             name: chance.string(),
//             type: PersonType.NATURAL_PERSON,
//             document: {
//               type: DocumentType.CPF,
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//           extraInfo: {
//             idempotencyKey: chance.guid({ version: 4 }),
//           },
//           cid: chance.hash({ length: 64 }),
//         },
//       } as UpdateLocalEntryParams;

//       const result = await repo.updateLocalEntry(params);

//       expect(result).toMatchObject({
//         cid: expect.stringMatching(CID),
//       });

//       expect(andWhere).toHaveBeenCalledWith({
//         keyType: params.filters.key.type,
//         keyValue: params.filters.key.value,
//       });

//       expect(update).toHaveBeenCalledWith({
//         keyStatus: params.data.key?.status,
//         data: JSON.stringify({
//           idempotencyKey: params.data.extraInfo?.idempotencyKey,
//           branch: params.data.bankAccount!.branch,
//           account: params.data.bankAccount!.number,
//           accountType: params.data.bankAccount?.type,
//           accountOpeningDate: params.data.bankAccount?.openingDate,
//           participant: params.data.participant,
//           name: params.data.person!.name,
//           documentType: params.data.person!.document.type,
//           documentValue: params.data.person!.document.value,
//         }),
//         cid: expect.any(Buffer),
//       });
//     });

//     it('throw database error in update a local entry', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const update = jest.fn(() => {
//         throw new Error('some error');
//       });
//       const andWhere = jest.fn(() => ({ update }));
//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           whereRaw: jest.fn(() => ({
//             andWhere,
//           })),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         filters: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//         data: {
//           bankAccount: {
//             branch: chance.string({ numeric: true }),
//             number: chance.string({ numeric: true }),
//           },
//           person: {
//             name: chance.string(),
//             type: PersonType.NATURAL_PERSON,
//             document: {
//               type: DocumentType.CPF,
//               value: chance.cpf({ formatted: false }),
//             },
//           },
//         },
//       } as UpdateLocalEntryParams;

//       await expect(repo.updateLocalEntry(params))
//         .rejects
//         .toThrow(new FailedToUpdateEntry('Failed to update an entry', [{ message: 'some error' }]));
//     });
//   });

//   describe('#updateEntryFromTopazio', () => {
//     it('should update a remote entry', async () => {
//       const fakeUuid = chance.guid({ version: 4 });

//       jest.spyOn(Uuid, 'generate').mockReturnValue(fakeUuid);

//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: MysqlAdapter,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const entry = {
//         reason: ActionReason.USER_REQUESTED,
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           type: BankAccountType.CHECKING_ACCOUNT,
//           branch: chance.string({ numeric: true }),
//           number: chance.string({ numeric: true }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.string(),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },

//       } as Entry;

//       const credentials = {
//         data: {
//           directParticipant: DirectParticipant.TOPAZIO,
//           clientId: chance.guid({ version: 4 }),
//           clientSecret: chance.hash(),
//         },
//       } as Credentials;

//       const bankAccountTypeFromTopazio = {
//         [BankAccountType.CHECKING_ACCOUNT]: 'CURRENT_OR_DIGITAL',
//         [BankAccountType.PAYMENT_ACCOUNT]: 'PAYMENT',
//         [BankAccountType.SALARY_ACCOUNT]: '',
//         [BankAccountType.SAVINGS_ACCOUNT]: '',
//       };

//       nock(config.topazioFacadeUrl)
//         .put('/v1/dict/entries', {
//           reason: entry.reason,
//           key: entry.key,
//           bankAccount: {
//             ...entry.bankAccount,
//             type: bankAccountTypeFromTopazio[entry.bankAccount.type],
//           },
//           person: entry.person,
//         })
//         .reply(httpStatus.OK, { key: entry.key });

//       const result = await repo.updateEntryFromTopazio({ entry, credentials });
//       expect(result).toBeDefined();
//       expect(result).toEqual({
//         key: {
//           type: entry.key.type,
//           value: entry.key.value,
//         },
//       });
//     });

//     it('should throw FailedToRemoveEntry because request params are invalid', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: MysqlAdapter,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const entry = {
//         reason: ActionReason.USER_REQUESTED,
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true }),
//           number: chance.string({ numeric: true }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.string(),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },

//       } as Entry;

//       const credentials = {
//         data: {
//           directParticipant: DirectParticipant.TOPAZIO,
//           clientId: chance.guid({ version: 4 }),
//           clientSecret: chance.hash(),
//         },
//       } as Credentials;

//       nock(config.topazioFacadeUrl)
//         .put('/v1/dict/entries', {
//           reason: entry.reason,
//           key: entry.key,
//           bankAccount: entry.bankAccount,
//           person: entry.person,
//         })
//         .reply(httpStatus.BAD_REQUEST, {
//           keyType: entry.key.type,
//           key: entry.key.value,
//           status: 'error',
//           messageError: 'Your transaction cannot be completed',
//         });

//       await expect(repo.updateEntryFromTopazio({ entry, credentials }))
//         .rejects
//         .toThrow(new FailedToUpdateEntry('Failed to update an entry', [{ message: 'Your transaction cannot be completed' }]));
//     });
//   });

//   describe('#updateEntryFromItau', () => {
//     it('should update a remote entry', async () => {
//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: MysqlAdapter,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const entry = {
//         reason: ActionReason.USER_REQUESTED,
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           type: BankAccountType.CHECKING_ACCOUNT,
//           branch: chance.string({ numeric: true }),
//           number: chance.string({ numeric: true }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.string(),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//       } as Entry;

//       const credentials = {
//         data: {
//           directParticipant: DirectParticipant.ITAU,
//           clientId: chance.guid({ version: 4 }),
//           clientSecret: chance.hash(),
//         },
//       } as Credentials;

//       nock(config.itauFacadeUrl)
//         .put('/v1/dict/entries', {
//           reason: entry.reason,
//           key: entry.key,
//           bankAccount: {
//             ...entry.bankAccount,
//             ispb: entry.ispb,
//             type: entry.bankAccount.type,
//           },
//           person: entry.person,
//         })
//         .reply(httpStatus.OK, { key: entry.key });

//       const result = await repo.updateEntryFromItau({ entry, credentials });

//       expect(result).toBeDefined();
//       expect(result).toEqual({
//         key: {
//           type: entry.key.type,
//           value: entry.key.value,
//         },
//       });
//     });

//     it('should throw FailedToRemoveEntry because request params are invalid', async () => {
//       const config = {
//         itauFacadeUrl: chance.url(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: MysqlAdapter,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const entry = {
//         reason: ActionReason.USER_REQUESTED,
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//         bankAccount: {
//           branch: chance.string({ numeric: true }),
//           number: chance.string({ numeric: true }),
//           openingDate: chance.date().toISOString(),
//         },
//         person: {
//           name: chance.string(),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//       } as Entry;

//       const credentials = {
//         data: {
//           directParticipant: DirectParticipant.TOPAZIO,
//           clientId: chance.guid({ version: 4 }),
//           clientSecret: chance.hash(),
//         },
//       } as Credentials;

//       nock(config.itauFacadeUrl)
//         .put('/v1/dict/entries', {
//           reason: entry.reason,
//           key: entry.key,
//           bankAccount: entry.bankAccount,
//           person: entry.person,
//         })
//         .reply(httpStatus.BAD_REQUEST, {
//           keyType: entry.key.type,
//           key: entry.key.value,
//           status: 'error',
//           messageError: 'Your transaction cannot be completed',
//         });

//       await expect(repo.updateEntryFromItau({ entry, credentials }))
//         .rejects
//         .toThrow(new FailedToUpdateEntry('Failed to update an entry', [{ message: 'Your transaction cannot be completed' }]));
//     });
//   });

//   describe('#findEntry', () => {
//     it('should call whereRaw with ispb', async () => {
//       const fakeQuery = {
//         whereRaw: jest.fn().mockResolvedValue([{
//           id: Uuid.stringToBinary(Uuid.generate()),
//           keyType: KeyType.EMAIL,
//           keyValue: chance.email({ domain: 'example.com' }),
//           data: {
//             branch: chance.string({ numeric: true, length: 4 }),
//             account: chance.string({ numeric: true, length: 8 }),
//             name: chance.name(),
//             personType: PersonType.NATURAL_PERSON,
//             documentType: DocumentType.CPF,
//             documentValue: chance.cpf({ formatted: false }),
//           },
//         }]),
//       };
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => fakeQuery),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const params = {
//         ispb: chance.string({ numeric: true, length: 4 }),
//       };

//       await repo.findEntry(params);

//       expect(fakeQuery.whereRaw).toHaveBeenCalled();
//     });

//     it('should call where with id', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn().mockResolvedValue([{
//             id: Uuid.stringToBinary(Uuid.generate()),
//             keyType: KeyType.EMAIL,
//             keyValue: chance.email({ domain: 'example.com' }),
//             data: {
//               branch: chance.string({ numeric: true, length: 4 }),
//               account: chance.string({ numeric: true, length: 8 }),
//               name: chance.name(),
//               personType: PersonType.NATURAL_PERSON,
//               documentType: DocumentType.CPF,
//               documentValue: chance.cpf({ formatted: false }),
//             },
//           }]),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const id = Uuid.generate();
//       const params = {
//         id,
//       };

//       await repo.findEntry(params);

//       expect(fakeMysql.db.where).toHaveBeenCalledWith({
//         id: Uuid.stringToBinary(id),
//       });
//     });

//     it('should call where with key type and value', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn().mockResolvedValue([{
//             id: Uuid.stringToBinary(Uuid.generate()),
//             keyType: KeyType.EMAIL,
//             keyValue: chance.email({ domain: 'example.com' }),
//             data: {
//               branch: chance.string({ numeric: true, length: 4 }),
//               account: chance.string({ numeric: true, length: 8 }),
//               name: chance.name(),
//               personType: PersonType.NATURAL_PERSON,
//               documentType: DocumentType.CPF,
//               documentValue: chance.cpf({ formatted: false }),
//             },
//           }]),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const key = {
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       };

//       const params = {
//         key,
//       };

//       await repo.findEntry(params);

//       expect(fakeMysql.db.where).toHaveBeenCalledWith({
//         keyType: key.type,
//         keyValue: key.value,
//       });
//     });

//     it('should call whereIn with an array of status', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeWhereIn = {
//         whereIn: jest.fn().mockResolvedValue([
//           {
//             id: Uuid.stringToBinary(Uuid.generate()),
//             keyType: KeyType.EMAIL,
//             keyValue: chance.email({ domain: 'example.com' }),
//             data: {
//               branch: chance.string({ numeric: true, length: 4 }),
//               account: chance.string({ numeric: true, length: 8 }),
//               name: chance.name(),
//               personType: PersonType.NATURAL_PERSON,
//               documentType: DocumentType.CPF,
//               documentValue: chance.cpf({ formatted: false }),
//             },
//           },
//         ]),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => fakeWhereIn),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const statuses = [
//         KeyStatus.ACTIVE,
//         KeyStatus.INACTIVE,
//       ];

//       const key = {
//         status: statuses,
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       };

//       const params = {
//         key,
//       };

//       await repo.findEntry(params);

//       expect(fakeWhereIn.whereIn).toHaveBeenCalledWith('keyStatus', statuses);
//     });

//     it('should call where with a status', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeWhere = {
//         where: jest.fn().mockResolvedValue([
//           {
//             id: Uuid.stringToBinary(Uuid.generate()),
//             keyType: KeyType.EMAIL,
//             keyValue: chance.email({ domain: 'example.com' }),
//             data: {
//               branch: chance.string({ numeric: true, length: 4 }),
//               account: chance.string({ numeric: true, length: 8 }),
//               name: chance.name(),
//               personType: PersonType.NATURAL_PERSON,
//               documentType: DocumentType.CPF,
//               documentValue: chance.cpf({ formatted: false }),
//             },
//           },
//         ]),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => fakeWhere),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const key = {
//         status: KeyStatus.ACTIVE,
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       };

//       const params = {
//         key,
//       };

//       await repo.findEntry(params);

//       expect(fakeWhere.where).toHaveBeenCalledWith('keyStatus', KeyStatus.ACTIVE);
//     });

//     it('should return a valid response', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const entry = {
//         id: Uuid.stringToBinary(Uuid.generate()),
//         keyType: KeyType.EMAIL,
//         keyValue: chance.email({ domain: 'example.com' }),
//         data: {
//           branch: chance.string({ numeric: true, length: 4 }),
//           account: chance.string({ numeric: true, length: 8 }),
//           name: chance.name(),
//           ispb: chance.string({ numeric: true, length: 4 }),
//           personType: PersonType.NATURAL_PERSON,
//           documentType: DocumentType.CPF,
//           documentValue: chance.cpf({ formatted: false }),
//           idempotencyKey: chance.guid({ version: 4 }),
//           checkFraudId: chance.guid({ version: 4 }),
//         },
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn().mockResolvedValue([entry]),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const key = {
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       };

//       const params = {
//         key,
//       };

//       const result = await repo.findEntry(params);

//       expect(result).toEqual([{
//         id: Uuid.binaryToString(entry.id),
//         ispb: entry.data.ispb,
//         key: {
//           type: entry.keyType,
//           value: entry.keyValue,
//         },
//         bankAccount: {
//           branch: entry.data.branch,
//           number: entry.data.account,
//         },
//         person: {
//           name: entry.data.name,
//           type: entry.data.personType,
//           document: {
//             type: entry.data.documentType,
//             value: entry.data.documentValue,
//           },
//         },
//         extraInfo: {
//           idempotencyKey: entry.data.idempotencyKey,
//           checkFraudId: entry.data.checkFraudId,
//         },
//       }]);
//     });

//     it('should throw error when an entry is not found', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn().mockResolvedValue([]),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const key = {
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       };

//       const params = {
//         key,
//       };

//       let errorDetails;
//       try {
//         await repo.findEntry(params);
//       } catch (error) {
//         errorDetails = error;
//       }

//       expect(errorDetails.message).toEqual('Entry not found');
//     });

//     it('should call where with an id and the whereRaw with the ispb', async () => {
//       const fakeQuery = {
//         whereRaw: jest.fn().mockResolvedValue([{
//           id: Uuid.stringToBinary(Uuid.generate()),
//           keyType: KeyType.EMAIL,
//           keyValue: chance.email({ domain: 'example.com' }),
//           data: {
//             branch: chance.string({ numeric: true, length: 4 }),
//             account: chance.string({ numeric: true, length: 8 }),
//             name: chance.name(),
//             personType: PersonType.NATURAL_PERSON,
//             documentType: DocumentType.CPF,
//             documentValue: chance.cpf({ formatted: false }),
//           },
//         }]),
//       };
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => fakeQuery),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const id = Uuid.generate();
//       const params = {
//         id,
//         ispb: '1234',
//       };

//       await repo.findEntry(params);

//       expect(fakeMysql.db.where).toHaveBeenCalledWith({
//         id: Uuid.stringToBinary(id),
//       });
//       expect(fakeQuery.whereRaw).toHaveBeenCalledWith('data->>"$.ispb" = ?', ['1234']);
//     });

//     it('should call whereRaw with the ispb and bank account data', async () => {
//       const branch = chance.string({ numeric: true, length: 4 });
//       const account = chance.string({ numeric: true, length: 8 });
//       const ispb = chance.string({ numeric: true, length: 4 });

//       const fakeQueryAccount = {
//         whereRaw: jest.fn().mockResolvedValue([{
//           id: Uuid.stringToBinary(Uuid.generate()),
//           keyType: KeyType.EMAIL,
//           keyValue: chance.email({ domain: 'example.com' }),
//           data: {
//             ispb,
//             branch,
//             account,
//             name: chance.name(),
//             personType: PersonType.NATURAL_PERSON,
//             documentType: DocumentType.CPF,
//             documentValue: chance.cpf({ formatted: false }),
//           },
//         }]),
//       };

//       const fakeQueryBranch = {
//         whereRaw: jest.fn(() => fakeQueryAccount),
//       };

//       const fakeQueryIspb = {
//         whereRaw: jest.fn(() => fakeQueryBranch),
//       };

//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => fakeQueryIspb),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const params = {
//         ispb,
//         bankAccount: {
//           branch,
//           number: account,
//         } as BankAccount,
//       };

//       await repo.findEntry(params);

//       expect(fakeQueryIspb.whereRaw).toHaveBeenCalledWith('data->>"$.ispb" = ?', [ispb]);
//       expect(fakeQueryBranch.whereRaw).toHaveBeenCalledWith('data->>"$.branch" = ?', [branch]);
//       expect(fakeQueryAccount.whereRaw).toHaveBeenCalledWith('data->>"$.account" = ?', [account]);
//     });

//     it('should throw error when an entry is not found', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           where: jest.fn(() => {
//             throw new Error('some error');
//           }),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       };

//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       // @ts-ignore
//       const repo = new EntryRepository(ctx);

//       const key = {
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       };

//       const params = {
//         key,
//       };

//       await expect(repo.findEntry(params)).rejects.toThrow('Failed to find entries');
//     });
//   });

//   describe('#addEntryAtTopazio', () => {
//     const config = {
//       topazioFacadeUrl: chance.url(),
//     };

//     const fakeMysql = {
//       tableName: jest.fn(),
//     };

//     const ctx = {
//       config,
//       mysqlAdapter: fakeMysql,
//       httpAdapter: HttpAdapter,
//     } as unknown as EntryRepositoryContext;

//     const repository = new EntryRepository(ctx);

//     const entry = {
//       ispb: chance.string({ numeric: true, length: 8 }),
//       key: {
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       },
//       person: {
//         name: chance.name(),
//         phone: chance.string({ numeric: true, length: 13 }),
//         email: chance.email({ domain: 'example.com' }),
//         type: PersonType.NATURAL_PERSON,
//         document: {
//           type: DocumentType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//       },
//       bankAccount: {
//         type: BankAccountType.CHECKING_ACCOUNT,
//         branch: chance.string({ numeric: true, length: 4 }),
//         number: chance.string({ numeric: true, length: 6 }),
//         openingDate: chance.date().toISOString(),
//       },

//     };

//     const credentials = {
//       ispb: chance.string({ numeric: true, length: 8 }),
//       data: {
//         directParticipant: DirectParticipant.TOPAZIO,
//         clientId: '123',
//         clientSecret: '123',
//       },
//     };

//     it('should return a valid key', async () => {
//       const bankAccountTypeFromTopazio = {
//         [BankAccountType.CHECKING_ACCOUNT]: 'CURRENT_OR_DIGITAL',
//         [BankAccountType.PAYMENT_ACCOUNT]: 'PAYMENT',
//         [BankAccountType.SALARY_ACCOUNT]: '',
//         [BankAccountType.SAVINGS_ACCOUNT]: '',
//       };

//       nock(config.topazioFacadeUrl)
//         .post('/v1/dict/entries', {
//           key: entry.key,
//           bankAccount: {
//             ...entry.bankAccount,
//             type: bankAccountTypeFromTopazio[entry.bankAccount.type],
//           },
//           person: entry.person,
//         })
//         .reply(httpStatus.OK, {
//           key: {
//             type: entry.key.type,
//             value: entry.key.value,
//           },
//         });

//       const response = await repository.addEntryAtTopazio({
//         entry,
//         credentials,
//       });

//       expect(response).toEqual({
//         key: {
//           type: entry.key.type,
//           value: entry.key.value,
//         },
//         extraInfo: {
//           idempotencyKey: expect.any(String),
//         },
//       });
//     });

//     it('should add entry with type evp, without key value, and return a valid key', async () => {
//       const evpValueResult = Uuid.generate();

//       const bankAccountTypeFromTopazio = {
//         [BankAccountType.CHECKING_ACCOUNT]: 'CURRENT_OR_DIGITAL',
//         [BankAccountType.PAYMENT_ACCOUNT]: 'PAYMENT',
//         [BankAccountType.SALARY_ACCOUNT]: '',
//         [BankAccountType.SAVINGS_ACCOUNT]: '',
//       };

//       nock(config.topazioFacadeUrl)
//         .post('/v1/dict/entries', {
//           key: entry.key,
//           bankAccount: {
//             ...entry.bankAccount,
//             type: bankAccountTypeFromTopazio[entry.bankAccount.type],
//           },
//           person: entry.person,
//         })
//         .reply(httpStatus.OK, {
//           key: {
//             type: entry.key.type,
//             value: evpValueResult,
//           },
//         });

//       const response = await repository.addEntryAtTopazio({
//         entry,
//         credentials,
//       });

//       expect(response).toEqual({
//         key: {
//           type: entry.key.type,
//           value: evpValueResult,
//         },
//         extraInfo: {
//           idempotencyKey: expect.any(String),
//         },
//       });
//     });

//     it('should throw when bad request is received from topazio (default message)', async () => {
//       nock(config.topazioFacadeUrl)
//         .post('/v1/dict/entries', {
//           keyType: entry.key.type,
//           key: entry.key.value,
//           personType: entry.person.type,
//           document: entry.person.document.value,
//           name: entry.person.name,
//           branch: entry.bankAccount.branch,
//           accountNumber: entry.bankAccount.number,
//           accountOpeningDate: entry.bankAccount.openingDate,
//         })
//         .reply(httpStatus.BAD_REQUEST);

//       let errorDetails;

//       try {
//         await repository.addEntryAtTopazio({
//           entry,
//           credentials,
//         });
//       } catch (err) {
//         errorDetails = err.details.message;
//       }

//       expect(errorDetails).toEqual('Unexpected error trying to add an entry at Topazio');
//     });
//   });

//   describe('#addEntryAtItau', () => {
//     const config = {
//       itauFacadeUrl: chance.url(),
//     };

//     const fakeMysql = {
//       tableName: jest.fn(),
//     };

//     const ctx = {
//       config,
//       mysqlAdapter: fakeMysql,
//       httpAdapter: HttpAdapter,
//     } as unknown as EntryRepositoryContext;

//     const repository = new EntryRepository(ctx);

//     const entry = {
//       ispb: chance.string({ numeric: true, length: 8 }),
//       key: {
//         type: KeyType.EMAIL,
//         value: chance.email({ domain: 'example.com' }),
//       },
//       person: {
//         name: chance.name(),
//         phone: chance.string({ numeric: true, length: 13 }),
//         email: chance.email({ domain: 'example.com' }),
//         type: PersonType.NATURAL_PERSON,
//         document: {
//           type: DocumentType.CPF,
//           value: chance.cpf({ formatted: false }),
//         },
//       },
//       bankAccount: {
//         type: BankAccountType.CHECKING_ACCOUNT,
//         branch: chance.string({ numeric: true, length: 4 }),
//         number: chance.string({ numeric: true, length: 6 }),
//         openingDate: chance.date().toISOString(),
//       },

//     };

//     const credentials = {
//       ispb: chance.string({ numeric: true, length: 8 }),
//       data: {
//         directParticipant: DirectParticipant.ITAU,
//         clientId: '123',
//         clientSecret: '123',
//       },
//     };

//     it('should return a valid key', async () => {
//       nock(config.itauFacadeUrl)
//         .post('/v1/dict/entries', {
//           key: entry.key,
//           bankAccount: {
//             ...entry.bankAccount,
//             ispb: entry.ispb,
//           },
//           person: entry.person,
//         })
//         .reply(httpStatus.CREATED, {
//           key: {
//             type: entry.key.type,
//             value: entry.key.value,
//           },
//         });

//       const response = await repository.addEntryAtItau({
//         entry,
//         credentials,
//       });

//       expect(response).toEqual({
//         key: {
//           type: entry.key.type,
//           value: entry.key.value,
//         },
//         extraInfo: {
//           idempotencyKey: expect.any(String),
//         },
//       });
//     });

//     it('should add entry with type evp, without key value, and return a valid key', async () => {
//       const evpValueResult = Uuid.generate();

//       nock(config.itauFacadeUrl)
//         .post('/v1/dict/entries', {
//           key: entry.key,
//           bankAccount: {
//             ...entry.bankAccount,
//             ispb: entry.ispb,
//           },
//           person: entry.person,
//         })
//         .reply(httpStatus.CREATED, {
//           key: {
//             type: entry.key.type,
//             value: evpValueResult,
//           },
//         });

//       const response = await repository.addEntryAtItau({
//         entry,
//         credentials,
//       });

//       expect(response).toEqual({
//         key: {
//           type: entry.key.type,
//           value: evpValueResult,
//         },
//         extraInfo: {
//           idempotencyKey: expect.any(String),
//         },
//       });
//     });

//     it('should throw when bad request is received from itau (default message)', async () => {
//       nock(config.itauFacadeUrl)
//         .post('/v1/dict/entries', {
//           keyType: entry.key.type,
//           key: entry.key.value,
//           personType: entry.person.type,
//           document: entry.person.document.value,
//           name: entry.person.name,
//           branch: entry.bankAccount.branch,
//           accountNumber: entry.bankAccount.number,
//           accountOpeningDate: entry.bankAccount.openingDate,
//         })
//         .reply(httpStatus.BAD_REQUEST);

//       let errorDetails;

//       try {
//         await repository.addEntryAtItau({
//           entry,
//           credentials,
//         });
//       } catch (err) {
//         errorDetails = err.details.message;
//       }

//       expect(errorDetails).toEqual('Unexpected error trying to add an entry at Itau');
//     });
//   });

//   describe('#addLocalEntry', () => {
//     it('should call insert with a valid body', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           insert: jest.fn(),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repository = new EntryRepository(ctx);

//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//           status: chance.pickone(Object.values(KeyStatus)),
//         },
//         person: {
//           name: chance.name(),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//         bankAccount: {
//           type: BankAccountType.CHECKING_ACCOUNT,
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 6 }),
//           openingDate: chance.date().toISOString(),
//         },
//         extraInfo: {
//           idempotencyKey: chance.guid({ version: 4 }),
//         },
//         cid: chance.hash({ length: 64 }),
//       };

//       await repository.addLocalEntry({
//         entry,
//       });

//       expect(fakeMysql.db.insert).toHaveBeenCalledWith(
//         {
//           id: expect.any(Buffer),
//           keyType: entry.key.type,
//           keyValue: entry.key.value,
//           keyStatus: entry.key.status,
//           data: JSON.stringify({
//             idempotencyKey: entry.extraInfo.idempotencyKey,
//             branch: entry.bankAccount.branch,
//             account: entry.bankAccount.number,
//             accountType: entry.bankAccount.type,
//             accountOpeningDate: entry.bankAccount.openingDate,
//             ispb: entry.ispb,
//             name: entry.person.name,
//             documentType: entry.person.document.type,
//             documentValue: entry.person.document.value,
//             phone: entry.person.phone,
//             email: entry.person.email,
//           }),
//           cid: expect.any(Buffer),
//         },
//       );
//     });

//     it('should call insert and return a valid body', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           insert: jest.fn(),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repository = new EntryRepository(ctx);

//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         idempotenceKey: Uuid.generate(),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         person: {
//           name: chance.name(),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//         bankAccount: {
//           type: BankAccountType.CHECKING_ACCOUNT,
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 6 }),
//           openingDate: chance.date().toISOString(),
//         },

//       };

//       const response = await repository.addLocalEntry({
//         entry,
//       });

//       expect(response).toEqual(
//         expect.objectContaining({
//           id: expect.any(String),
//           ispb: entry.ispb,
//           person: entry.person,
//           bankAccount: entry.bankAccount,
//           key: entry.key,
//         }),
//       );
//     });

//     it('should call insert with a id (Buffer)', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           insert: jest.fn(),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repository = new EntryRepository(ctx);

//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         idempotenceKey: Uuid.generate(),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         person: {
//           name: chance.name(),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//         bankAccount: {
//           type: BankAccountType.CHECKING_ACCOUNT,
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 6 }),
//           openingDate: chance.date().toISOString(),
//         },

//       };

//       await repository.addLocalEntry({
//         entry,
//       });

//       expect(fakeMysql.db.insert).toHaveBeenCalledWith(
//         expect.objectContaining({
//           id: expect.any(Buffer),
//         }),
//       );
//     });

//     it('should throw when db throw', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//         db: {
//           insert: jest.fn(() => {
//             throw new Error('SQL Error');
//           }),
//         },
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repository = new EntryRepository(ctx);

//       const entry = {
//         ispb: chance.string({ numeric: true, length: 8 }),
//         idempotenceKey: Uuid.generate(),
//         key: {
//           type: KeyType.EMAIL,
//           value: chance.email({ domain: 'example.com' }),
//         },
//         person: {
//           name: chance.name(),
//           phone: chance.string({ numeric: true, length: 13 }),
//           email: chance.email({ domain: 'example.com' }),
//           type: PersonType.NATURAL_PERSON,
//           document: {
//             type: DocumentType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//         bankAccount: {
//           type: BankAccountType.CHECKING_ACCOUNT,
//           branch: chance.string({ numeric: true, length: 4 }),
//           number: chance.string({ numeric: true, length: 6 }),
//           openingDate: chance.date().toISOString(),
//         },

//       };

//       let errorDetails;

//       try {
//         await repository.addLocalEntry({
//           entry,
//         });
//       } catch (err) {
//         errorDetails = err.details.message;
//       }

//       expect(errorDetails).toEqual('SQL Error');
//     });
//   });

//   describe('#listEntriesFromTopazio', () => {
//     it('should return a list of keys from Topazio', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           bankAccount: {
//             branch: chance.string({ numeric: true, length: 4 }),
//             number: chance.string({ numeric: true, length: 6 }),
//           } as BankAccount,
//         },
//       };

//       const response = [
//         {
//           key: {
//             type: KeyType.CPF,
//             value: chance.cpf({ formatted: false }),
//           },
//         },
//       ];

//       nock(config.topazioFacadeUrl)
//         .get('/v1/dict/entries/by-bank-account')
//         .query({
//           ispb: params.entry.ispb,
//           branch: params.entry.bankAccount.branch,
//           number: params.entry.bankAccount.number,
//         })
//         .reply(httpStatus.OK, response);

//       const result = await repo.listEntriesFromTopazio(params);

//       expect(result).toEqual([
//         {
//           key: {
//             type: response[0].key.type,
//             value: response[0].key.value,
//           },
//         },
//       ]);
//     });

//     it('throw error when not exists entry from Topazio', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           bankAccount: {
//             branch: chance.string({ numeric: true, length: 4 }),
//             number: chance.string({ numeric: true, length: 6 }),
//           } as BankAccount,
//         },
//       };

//       nock(config.topazioFacadeUrl)
//         .get('/v1/dict/entries/by-bank-account')
//         .query({
//           ispb: params.entry.ispb,
//           branch: params.entry.bankAccount.branch,
//           number: params.entry.bankAccount.number,
//         })
//         .reply(httpStatus.NOT_FOUND, {});

//       await expect(repo.listEntriesFromTopazio(params))
//         .rejects
//         .toThrow(new InvalidEntryToList('Entry not found'));
//     });

//     it('throw an unexpected error when to list keys from Topazio', async () => {
//       const config = {
//         topazioFacadeUrl: chance.url(),
//       };

//       const fakeMysql = {
//         tableName: jest.fn(),
//       };

//       const ctx = {
//         config,
//         mysqlAdapter: fakeMysql,
//         httpAdapter: HttpAdapter,
//       } as unknown as EntryRepositoryContext;

//       const repo = new EntryRepository(ctx);

//       const params = {
//         credentials: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           data: {
//             directParticipant: DirectParticipant.TOPAZIO,
//             clientId: chance.string({ length: 10 }),
//             clientSecret: chance.string({ length: 20 }),
//           },
//         },
//         entry: {
//           ispb: chance.string({ numeric: true, length: 8 }),
//           bankAccount: {
//             branch: chance.string({ numeric: true, length: 4 }),
//             number: chance.string({ numeric: true, length: 6 }),
//           } as BankAccount,
//         },
//       };

//       nock(config.topazioFacadeUrl)
//         .get('/v1/dict/entries/by-bank-account')
//         .query({
//           ispb: params.entry.ispb,
//           branch: params.entry.bankAccount.branch,
//           number: params.entry.bankAccount.number,
//         })
//         .reply(httpStatus.INTERNAL_SERVER_ERROR, {
//           message: 'some error',
//         });

//       expect(repo.listEntriesFromTopazio(params))
//         .rejects
//         .toThrow('Failed to list entries');
//     });
//   });
// });

// describe('cidStringToBinary', () => {
//   it('converts a valid CID from a string to a buffer', () => {
//     const cidString = chance.hash({ length: 64 });

//     const cidBytes = cidStringToBinary(cidString);

//     expect(cidBytes).toEqual(Buffer.from(cidString, 'hex'));
//   });

//   it('returns null if the argument is null', () => {
//     const result = cidStringToBinary(null);

//     expect(result).toBeNull();
//   });

//   it('throws if the argument is not valid as a CID', () => {
//     const invalidCid = chance.hash({ length: 63 });

//     expect(() => cidStringToBinary(invalidCid)).toThrow('Invalid CID');
//   });
// });

// describe('cidBinaryToString', () => {
//   it('converts a valid CID from a buffer to a string', () => {
//     const cidBytes = crypto.randomBytes(32);

//     const cidString = cidBinaryToString(cidBytes);

//     expect(cidString).toEqual(cidBytes.toString('hex'));
//   });

//   it('returns null if the argument is null', () => {
//     const result = cidBinaryToString(null);

//     expect(result).toBeNull();
//   });

//   it('throws if the argument is not valid as a CID', () => {
//     const invalidCid = crypto.randomBytes(31);

//     expect(() => cidBinaryToString(invalidCid)).toThrow('Invalid CID');
//   });
// });
