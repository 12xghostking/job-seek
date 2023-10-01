const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  receivedFrom: {
    type: String,
    required: true,
  },
  receivedBy: {
    type: String,
    required: true,
  },
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
