const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    track: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Track',
        required: true,
      },
    ],
    instructor: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model('Course', courseSchema);

module.exports = courseModel;
