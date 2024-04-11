const mongoose = require('mongoose');
const mailSender = require('../utils/email');
require('dotenv').config();

const tokenSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time.
  },
});

const sendVerificationEmail = async (email, token, userID) => {
  const mail = await mailSender(
    email,
    'Verification Email',
    `Hello, Please verify your email by
                clicking this link :
                  <a href='http://localhost:${process.env.PORT}/auth/verify-email/${userID}/${token}'> Verfiy Email </a>`
  );
  // console.log('Email sent successfully');
};

tokenSchema.pre('save', async function (next) {
  // console.log('Token created successfully');
  sendVerificationEmail(this.email, this.token, this.userID);
  next();
});

const tokenModel = mongoose.model('Token', tokenSchema);

module.exports = tokenModel;
