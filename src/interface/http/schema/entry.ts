import joi from 'joi';
import moment from 'moment-timezone';

import {
  documentFlatSchema,
  documentSchema,
  ispbSchema,
  keySchema,
  keySchemaWithoutEvp,
  keyTypeSchema,
  keyValueSchema,
  NUMERIC,
  PHONE,
} from './shared';

import {
  ActionReason, BankAccountType, KeyType,
} from '../../../types/message';

const reasonSchema = () => joi.string().valid(...Object.values(ActionReason));

const reasonUpdateSchema = () => joi.string()
  .valid(
    ActionReason.USER_REQUESTED,
    ActionReason.TRANSFERRED_BANK_BRANCH,
    ActionReason.RECONCILIATION,
  );

const openingDate = () => joi.string().custom((value: string) => {
  if (!moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()) {
    throw new Error('Account opening date is invalid');
  }

  return value;
});

const bankAccountSchema = () => joi.object({
  type: joi.string().valid(...Object.values(BankAccountType)).required(),
  branch: joi.string().length(4).pattern(NUMERIC).required(),
  number: joi.string().pattern(NUMERIC).required(),
  openingDate: openingDate().required(),
});

export const removeEntrySchema = joi.object({
  params: joi.object({
    ispb: ispbSchema().required(),
  }),
  query: joi.object({
    reason: reasonSchema().required(),
    keyType: keyTypeSchema().required(),
    keyValue: keyValueSchema('keyType').required(),
  }),
});

export const getEntry = joi.object({
  params: joi.object({
    entryId: joi.string().uuid({ version: 'uuidv4' }).required(),
  }).required(),
});

export const searchEntrySchema = joi.object({
  params: {
    ispb: ispbSchema().required(),
  },
  query: {
    keyType: keyTypeSchema().required(),
    keyValue: keyValueSchema('keyType').required(),
    document: documentFlatSchema().required(),
  },
});

export const addEntrySchema = joi.object({
  body: joi.object({
    name: joi.string().required(),
    phone: joi.string().length(13).pattern(PHONE).required(),
    email: joi.string().email(),
    key: keySchemaWithoutEvp()
      .required()
      .when('.type', {
        switch: [
          {
            is: KeyType.CPF,
            then: joi.equal(joi.ref('..document')).messages({
              'any.only': '{{#label}} must be equal document when key type is CPF',
            }),
          },
          {
            is: KeyType.CNPJ,
            then: joi.equal(joi.ref('..document')).messages({
              'any.only': '{{#label}} must be equal document when key type is CNPJ',
            }),
          }],
      }),
    bankAccount: bankAccountSchema().required(),
    document: documentSchema().required(),
  }).required(),
});

export const updateEntrySchema = joi.object({
  params: joi.object({
    ispb: ispbSchema().required(),
  }),
  body: joi.object({
    reason: reasonUpdateSchema().required(),
    name: joi.string().max(80).required(),
    phone: joi.string().length(13).pattern(PHONE).required(),
    email: joi.string().email(),
    document: documentSchema().required(),
    key: keySchema().required(),
    bankAccount: bankAccountSchema().required(),
  }),
});

export const listEntriesByBankAccount = joi.object({
  params: joi.object({
    ispb: ispbSchema().required(),
  }),
  query: joi.object({
    branch: joi.string().length(4).pattern(NUMERIC).required(),
    number: joi.string().pattern(NUMERIC).required(),
  }),
});
