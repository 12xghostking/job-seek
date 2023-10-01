const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  jobAppliedTo: {
    type: String,
    required: true,
  },
  employerName: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: String,
    enum: ['<1', '1-3', '3-5', '5+'],
    required: true,
  },
  status: {
    type: String,
    enum: ['in review', 'approved', 'rejected'],
    default: 'in review',
  },
});

module.exports = mongoose.model('Applicant', applicantSchema);
