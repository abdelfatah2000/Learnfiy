const mongoose = require('mongoose');
const User = require('../models/users.model');

const instructorSchema = new mongoose.Schema({
  salary: {
    type: Number,
    required: true,
  },
});

User.discriminator('Instructor', instructorSchema);
const instructorModel = mongoose.model('Instructor');

module.exports = instructorModel;
