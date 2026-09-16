const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
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
    trim: true,
  },
  employerName: {
    type: String,
    required: true,
    trim: true,
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
}, { timestamps: true });

module.exports = mongoose.models.Applicant || mongoose.model('Applicant', applicantSchema);
