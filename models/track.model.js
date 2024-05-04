const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const trackModel = mongoose.model('Track', trackSchema);

module.exports = trackModel;
