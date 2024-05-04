const { StatusCodes } = require('http-status-codes');
const User = require('../models/users.model');
const Instructor = require('../models/instructor.model');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');

const paginateData = async (Model, query = {}, queryObj) => {
  const page = queryObj.page || 1;
  const limit = queryObj.limit || 10;
  const skip = page * limit - limit;

  const sortBy = queryObj.sort
    ? queryObj.sort.split(',').join(' ')
    : '-createdAt';

  const select = queryObj.fields
    ? queryObj.fields.split(',').join(' ')
    : '-password -salt';

  const excludedFields = ['page', 'sort', 'limit', 'fields'];

  for (const [key, value] of Object.entries(queryObj)) {
    if (!excludedFields.includes(key)) {
      query[key] = value;
    }
  }
  const data = await Model.find(query)
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(select);
  const count = await Model.countDocuments(query);
  return { data, count };
};

exports.getAllNewUser = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const { data, count } = await paginateData(User, undefined, req.query);

  const pages = Math.ceil(count / parseInt(limit));
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      result: data,
      pagination,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(StatusCodes.OK).json({
      success: true,
      pagination,
      message: 'Collection is Empty',
    });
  }
};

exports.getUserToAccept = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const { data, count } = await paginateData(
    User,
    { isAdminAccept: false },
    req.query
  );

  const pages = Math.ceil(count / parseInt(limit));
  const pagination = { page, pages, count };
  if (count > 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      result: data,
      pagination,
      message: 'Successfully found all users',
    });
  } else {
    return res.status(StatusCodes.OK).json({
      success: true,
      pagination,
      message: 'Collection is Empty',
    });
  }
};

exports.postAcceptNewUsers = async (req, res) => {
  const users = req.body.users;
  const results = await User.updateMany(
    { _id: { $in: users } },
    { $set: { isAdminAccept: true } }
  );
  logger.info('Uses accepted successfully');
  return res.status(StatusCodes.OK).json({
    success: true,
    results,
    message: 'Users accepted successfully',
  });
};

exports.addNewInstructor = async (req, res) => {
  const payload = req.body;
  const isFounded = await User.findOne({ email: payload.email });
  if (isFounded) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Email is already taken.',
    });
  }
  const salt = nanoid();
  const hashedPassword = bcrypt.hashSync(password + salt);

  const user = await new Instructor({
    email: payload.email,
    password: hashedPassword,
    name: payload.name,
    salt,
    salary: payload.salary,
  }).save();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User created successfully',
    result: {
      id: user._id,
      name: user.name,
      email: user.email,
      salary: user.salary,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
};
