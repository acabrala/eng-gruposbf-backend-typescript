import joi from 'joi';
import moment from 'moment-timezone';

import {
  documentSchema,
  ispbSchema,
  keySchema,
  keySchemaWithoutEvp,
  keyValueSchema,
  PHONE,
} from './shared';

import {
  ClaimAction,
  ClaimReason,
  ClaimType,
  ClaimStatus,
} from '../../../types/claim';
import { BankAccountType, KeyType } from '../../../types/message';

const NUMERIC = /^\d+$/;

const openingDateSchema = () => joi.string().custom((value: string) => {
  if (!moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()) {
    throw new Error('Account opening date is invalid');
  }

  return value;
});

export const listClaimsSchema = joi.object({
  query: joi.object({
    keyType: joi.string().valid(
      KeyType.EMAIL,
      KeyType.PHONE,
      KeyType.CPF,
      KeyType.CNPJ,
    ),
    keyValue: keyValueSchema('keyType'),
    accountNumber: joi.string().pattern(NUMERIC),
    accountBranch: joi.string().length(4).pattern(NUMERIC),
    status: joi.string().valid(...Object.values(ClaimStatus)),
  })
    .when(joi.object().assert('.status', joi.exist()).max(1), {
      then: joi.forbidden(),
    })
    .min(1)
    .and('keyType', 'keyValue')
    .and('accountBranch', 'accountNumber'),
  params: joi.object({
    ispb: joi.string().required().pattern(NUMERIC).length(8),
  }).required(),
}).required();

const claimTypeSchema = () => joi.string().valid(...Object.values(ClaimType));

const bankAccountSchema = () => joi.object({
  branch: joi.string().length(4).pattern(NUMERIC).required(),
  number: joi.string().pattern(NUMERIC).required(),
  openingDate: openingDateSchema().required(),
  type: joi.string().valid(...Object.values(BankAccountType))
    .default(BankAccountType.PAYMENT_ACCOUNT),
});

export const putClaimSchema = joi.object({
  params: joi.object({
    ispb: ispbSchema().required(),
  }),
  body: joi.object({
    action: joi.string().valid(...Object.values(ClaimAction)).required(),
    reason: joi.string().valid(...Object.values(ClaimReason)).required(),
    key: keySchema().required(),
    document: documentSchema().required(),
  }),
});

export const getClaimByIdSchema = joi.object({
  params: joi.object({
    id: joi.string().guid({ version: 'uuidv4' }).required(),
  }).required(),
});

export const createClaimSchema = joi.object({
  params: {
    ispb: ispbSchema().required(),
  },
  body: joi.object({
    type: claimTypeSchema().required(),
    name: joi.string().max(80).required(),
    email: joi.string().email(),
    phone: joi.string().length(13).pattern(PHONE).required(),
    document: documentSchema().required(),
    key: keySchemaWithoutEvp().required(),
    bankAccount: bankAccountSchema().required(),
  }).required(),
});
