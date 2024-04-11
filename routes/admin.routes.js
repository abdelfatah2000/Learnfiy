const passport = require('passport');

const adminControllers = require('../controllers/admin.controllers');
const express = require('express');

const app = express.Router();

app.get(
  '/get-new-users',
  passport.authenticate('jwt', { session: false }),
  adminControllers.getAllNewUser
);

module.exports = app;
