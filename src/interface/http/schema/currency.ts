import joi from 'joi';

export const createCurrencySchema = joi.object({
  body: joi.object({
    name: joi.string().required(),
    value: joi.number().required(),
  }).required(),
});

export const updateCurrencySchema = joi.object({
  params: {
    id: joi.string().required(),
  },
  body: joi.object({
    value: joi.number().required(),
  }),
});

export const getValueCurrencieschema = joi.object({
  body: joi.object({
    amount: joi.number().required(),
  }).required(),
});
