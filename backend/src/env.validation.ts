import * as Joi from "joi";

export const envSchema = Joi.object({
  DB_TYPE: Joi.string().default("sqlite"),
  DB_HOST: Joi.string(),
  DB_NAME: Joi.string().default("db.sqlite"),
  DB_PORT: Joi.number().port(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),
  DB_SYNCHRONIZE: Joi.boolean().default(true),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_TLS: Joi.boolean().default(false),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  APP_HOST: Joi.string().default("localhost"),
  APP_PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().default("secret"),
  APP_EMAIL: Joi.string().email().required(),
  APP_NAME: Joi.string().default("Portfolio App"),
  APP_DESCRIPTION: Joi.string().default("Portfolio app for"),
  VERIFICATION_EXP_SEC: Joi.number().default(180),
});
