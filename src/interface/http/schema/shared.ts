import { isValidCnpj } from '@brazilian-utils/is-valid-cnpj';
import { isValidCpf } from '@brazilian-utils/is-valid-cpf';
import joi from 'joi';

import {
  KeyType,
  DocumentType,
} from '../../../types/message';

export const NUMERIC = /^\d+$/;
export const PHONE = /^[0-9]{13}$/;

export const ispbSchema = () => joi.string().pattern(NUMERIC).length(8);

export const evpSchema = () => joi.string().uuid({ version: 'uuidv4' });

export const cpfSchema = () => joi.string().custom((cpf) => {
  if (cpf && isValidCpf(cpf)) return cpf;

  throw new Error('CPF is invalid');
}, 'CPF validation');

export const cnpjSchema = () => joi.string().custom((cnpj) => {
  if (cnpj && isValidCnpj(cnpj)) return cnpj;

  throw new Error('CNPJ is invalid');
}, 'CNPJ Validation');

export const keyTypeSchema = () => joi.string().valid(...Object.values(KeyType));

export const keyValueSchema = (keyTypeName: string) => joi.when(keyTypeName, {
  switch: [
    { is: KeyType.CPF, then: cpfSchema().required() },
    { is: KeyType.CNPJ, then: cnpjSchema().required() },
    { is: KeyType.PHONE, then: joi.string().length(13).pattern(PHONE).required() },
    { is: KeyType.EMAIL, then: joi.string().email().required() },
    { is: KeyType.EVP, then: evpSchema().required() },
  ],
});

export const keyValueWithoutEvpSchema = (keyTypeName: string) => joi.when(keyTypeName, {
  switch: [
    { is: KeyType.CPF, then: cpfSchema().required() },
    { is: KeyType.CNPJ, then: cnpjSchema().required() },
    { is: KeyType.PHONE, then: joi.string().length(13).pattern(PHONE).required() },
    { is: KeyType.EMAIL, then: joi.string().email().required() },
    { is: KeyType.EVP, then: () => { throw new Error('not allowed value for EVP'); } },
  ],
});

export const keySchema = () => joi.object({
  type: keyTypeSchema().required(),
  value: keyValueSchema('type').required(),
});

export const keySchemaWithoutEvp = () => joi.object({
  type: keyTypeSchema().required(),
  value: keyValueWithoutEvpSchema('type'),
});

export const documentTypeSchema = () => joi.string().valid(...Object.values(DocumentType));

export const documentValueSchema = (documentTypeName: string) => joi.when(documentTypeName, {
  switch: [
    { is: DocumentType.CPF, then: cpfSchema().required() },
    { is: DocumentType.CNPJ, then: cnpjSchema().required() },
  ],
});

export const documentSchema = () => joi.object({
  type: documentTypeSchema().required(),
  value: documentValueSchema('type').required(),
});

export const documentFlatSchema = () => joi.string().custom((doc: string) => {
  if (!isValidCpf(doc) && !isValidCnpj(doc)) {
    throw new Error('Document is invalid');
  }

  return doc;
}, 'Document validation');
