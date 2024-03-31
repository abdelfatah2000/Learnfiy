const User = require('../models/users.model');
const Token = require('../models/token.model');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwtToken = require('../utils/token');
const { limiterConsecutiveFailsByEmailAndIP } = require('../utils/rateLimiter');

async function createToken(userID, email) {
  const token = crypto.randomBytes(20).toString('hex');
  await Token.create({ userID, email, token });
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(planPassword, hashedPassword) {
  return bcrypt.compare(planPassword, hashedPassword);
}

exports.register = async (req, res) => {
  const payload = req.body;
  const isFounded = await User.findOne({ email: payload.email });
  if (isFounded) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Email is already taken.',
      result: null,
    });
  }
  // Hash the password
  const hashed = await hashPassword(payload.password);
  const user = await new User({
    email: payload.email,
    password: hashed,
    name: payload.name,
  }).save();

  createToken(user._id, user.email);

  console.log('User created successfully');

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User created successfully',
    result: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  });
};

exports.verfiyEmail = async (req, res) => {
  const { userID, token } = req.params;
  const userToken = await Token.findOne({ userID, token });
  if (userToken) {
    //Verify user
    const user = await User.findByIdAndUpdate(
      userID,
      { active: true },
      { new: true }
    );

    //Delete the token from database
    await userToken.deleteOne();
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User is not found',
      });
    }
    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: 'Email is verified',
    });
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Token expired' });
  }
};

exports.login = async (req, res) => {
  const payload = req.body;

  const emailIPkey = `${payload.email}_${req.ip}`;
  const resEmailAndIP = await limiterConsecutiveFailsByEmailAndIP.get(
    emailIPkey
  );
  let nextAttempt = 0;
  if (resEmailAndIP && resEmailAndIP.consumedPoints >= 10) {
    nextAttempt = Math.round(resEmailAndIP.msBeforeNext / 1000) || 1;
  }
  if (nextAttempt > 0) {
    res.set('Retry-After', String(nextAttempt));
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      success: false,
      message: `Too many requests. Retry after ${nextAttempt} seconds`,
    });
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
  //Check if user verify the account
  if (!user.active) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'You must verify the account first',
    });
  }
  //Check if admin accept the account
  if (!user.isAdminAccept) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Admin must accept the account first',
    });
  }
  const isMatched = await comparePassword(payload.password, user.password);
  if (isMatched) {
    const token = jwtToken(user);
    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: 'User login successfully',
      result: {
        token: 'Bearer ' + token,
      },
    });
  }
  // if user failed to login 10 times in 1 hour , he will be blocked hour.
  await limiterConsecutiveFailsByEmailAndIP.consume(emailIPkey);

  return res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: 'Invalid email or password',
  });
};
