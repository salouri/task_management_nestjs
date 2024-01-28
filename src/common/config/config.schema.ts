import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  APP_PORT: Joi.number().default(3000),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  ACCESS_JWT_EXPIRES_IN: Joi.string().required(),
  ACCESS_JWT_SECRET: Joi.string().required(),
  REFRESH_JWT_EXPIRES_IN: Joi.string().required(),
  REFRESH_JWT_SECRET: Joi.string().required(),
});
