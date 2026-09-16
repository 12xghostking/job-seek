const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerName: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  skillsRequired: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    enum: ['Onsite', 'Remote'],
    required: true,
  },
  yearsOfExperience: {
    type: String,
    enum: ['<1', '1-3', '3-5', '5+'],
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
