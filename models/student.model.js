const mongoose = require('mongoose');
const User = require('./users.model');

const studentSchema = new mongoose.Schema({
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
  },
});

User.discriminator('Student', studentSchema);
const studentModel = mongoose.model('Student');

module.exports = studentModel;
