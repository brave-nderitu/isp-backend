const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  speed: {
    type: String,
  },
  features: {
    type: [String],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Plan', planSchema);
