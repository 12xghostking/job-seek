const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  receivedFrom: {
    type: String,
    required: true,
    trim: true,
  },
  receivedBy: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
