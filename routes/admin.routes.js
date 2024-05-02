const passport = require('passport');
const { hasPermission } = require('../utils/role');
const adminControllers = require('../controllers/admin.controllers');
const express = require('express');
const auth = require('../middlewares/auth');
const app = express.Router();

app.get(
  '/get-all-users',
  auth('getAllUsers'),
  adminControllers.getAllNewUser
);

app.get('/get-users-to-accept', auth('getUsersToAccept'), adminControllers.getUserToAccept);

module.exports = app;
