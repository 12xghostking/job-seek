const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/notif');

// POST /api/notifications/send
router.post('/send', async (req, res, next) => {
  try {
    const { description, receivedFrom, receivedBy } = req.body;

    if (!description || !receivedFrom || !receivedBy) {
      return res.status(400).json({ error: 'Description, sender, and recipient are required' });
    }

    const newNotification = new NotificationModel({
      description: description.trim(),
      receivedFrom: receivedFrom.trim(),
      receivedBy: receivedBy.trim(),
    });

    await newNotification.save();

    res.status(201).json({ message: 'Notification sent successfully', notification: newNotification });
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/:username
router.get('/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    const notifications = await NotificationModel.find({ receivedBy: username }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/notifications/remove
router.delete('/remove', async (req, res, next) => {
  try {
    const { description, username, notificationId } = req.body;

    if (notificationId) {
      await NotificationModel.findByIdAndDelete(notificationId);
    } else if (description && username) {
      await NotificationModel.deleteMany({ description, receivedBy: username });
    } else {
      return res.status(400).json({ error: 'Notification ID or description with username is required' });
    }

    res.status(200).json({ message: 'Notifications removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
