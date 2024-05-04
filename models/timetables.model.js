const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model('TimeSlot', timeSlotSchema);

const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true,
    },
    classroom: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);
