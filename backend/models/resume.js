const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true,
  },
  originalFileName: {
    type: String,
  },
  uploadedBy: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
