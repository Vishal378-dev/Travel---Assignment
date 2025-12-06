import Joi from "joi";

export const registerValidation = Joi.object({
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string()
    .min(6)
    .max(15)
    .required(),
});


export const loginValidation = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string()
    .required(),
});