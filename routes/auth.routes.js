const authControllers = require('../controllers/auth.controllers');
const express = require('express');
const validator = require('../middlewares/validator');
const {
  userValidationSchema,
  verifyEmailValidationSchema,
} = require('../schemas/user.schema');

const app = express.Router();

app.post(
  '/register',
  validator(userValidationSchema),
  authControllers.register
);

app.post(
  '/verify-email/:userID/:token',
  validator(verifyEmailValidationSchema),
  authControllers.verfiyEmail
);

app.post('/login', authControllers.login);
module.exports = app;
