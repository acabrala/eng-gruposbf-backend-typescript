import { isValidCnpj } from '@brazilian-utils/is-valid-cnpj';
import { isValidCpf } from '@brazilian-utils/is-valid-cpf';
import joi, { AnySchema } from 'joi';

import { InvalidProperties } from '../../../util/error';

function validateCpf(value: string) {
  if (!isValidCpf(value)) {
    throw new Error('CPF is invalid');
  }

  return value;
}

function validateCnpj(value: string) {
  if (!isValidCnpj(value)) {
    throw new Error('CNPJ is invalid');
  }

  return value;
}

const PHONE = /^[1-9][0-9]\d{1,11}$/;

export const cpfSchema = () => joi.custom(validateCpf, 'CPF Validation');

export const cnpjSchema = () => joi.custom(validateCnpj, 'CNPJ Validation');

export const phoneSchema = () => joi.string().length(13).pattern(PHONE);

export const evpSchema = () => joi.string().uuid({ version: 'uuidv4' });

export const validateProperties = (
  { schema, params, errorMsg }: { schema: AnySchema; params: object; errorMsg: string },
) => {
  const validation = schema.validate(params, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });

  if (validation.error) {
    throw new InvalidProperties(errorMsg, validation.error.details);
  }
};
