const { StatusCodes } = require('http-status-codes');
const User = require('../models/users.model');

exports.getAllNewUser = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Get users successfully',
    result: users,
  });
};

exports.getUserToAccept = async (req, res) => {
  const users = await User.find({ isAdminAccept: false });
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Get unaccepted users successfully',
    result: users,
  });
};

