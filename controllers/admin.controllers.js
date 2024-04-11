const { StatusCodes } = require('http-status-codes');
const User = require('../models/users.model');

exports.getAllNewUser = async (req, res) => {
  const users = await User.find({ isAdminAccept: false });
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Get new user successfully',
    result: users,
  });
};
