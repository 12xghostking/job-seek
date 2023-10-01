const mongoose = require('mongoose');

const resume = new mongoose.Schema({
  filePath: String,
  uploadedBy: String, 
});

module.exports = mongoose.model('Resume', resume);
