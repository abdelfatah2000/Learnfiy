const Joi = require('joi');

exports.userValidationSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8) 
      .max(30) 
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')) // Regular expression for password complexity
      .required(),
    active: Joi.boolean().default(false),
    isAdminAccept: Joi.boolean().default(false),
    role: Joi.string().valid('admin', 'instructor', 'student'),
  }),
};

exports.verifyEmailValidationSchema = {
  params: Joi.object().keys({
    userID: Joi.string().required(),
    token: Joi.string().required(),
  }),
};
