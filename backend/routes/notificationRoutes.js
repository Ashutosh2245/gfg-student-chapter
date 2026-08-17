const express = require('express');
const router = express.Router();
const { dbInstance } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Seed notifications for initial demo
if (!dbInstance.notifications) {
  dbInstance.notifications = [
    { id: 1, user_id: 1, title: 'Portal Initialized', message: 'GFG Student Chapter NIET portal is now live.', link: '/admin/dashboard', is_read: false, created_at: new Date().toISOString() },
    { id: 2, user_id: 6, title: 'Task Approved (+20 XP)', message: 'Your task submission "Develop Public Landing Page" has been approved!', link: '/dashboard', is_read: false, created_at: new Date().toISOString() }
  ];
}

// GET /api/notifications - Get current user notifications
router.get('/', authenticateToken, (req, res) => {
  try {
    const list = dbInstance.notifications.filter(n => n.user_id === req.user.id);
    const unreadCount = list.filter(n => !n.is_read).length;
    res.json({ success: true, notifications: list, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
});

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', authenticateToken, (req, res) => {
  try {
    dbInstance.notifications.forEach(n => {
      if (n.user_id === req.user.id) n.is_read = true;
    });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
});

module.exports = router;
