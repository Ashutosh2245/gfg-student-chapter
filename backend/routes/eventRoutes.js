const express = require('express');
const router = express.Router();
const { dbInstance } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET /api/events - List events (public)
router.get('/', async (req, res) => {
  try {
    const events = dbInstance.events.map(ev => {
      const images = dbInstance.taskSubmissions.filter(s => s.proof_type === 'IMAGE'); // sample
      return {
        ...ev,
        gallery: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800'
        ]
      };
    });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
});

// POST /api/events - Create event (President, VP, Coordinator, Lead)
router.post('/', authenticateToken, authorizeRoles('PRESIDENT', 'VICE_PRESIDENT', 'COORDINATOR', 'LEAD'), async (req, res) => {
  try {
    const { title, description, venue, event_date, banner_url, registration_url } = req.body;

    if (!title || !description || !venue || !event_date) {
      return res.status(400).json({ success: false, message: 'Title, description, venue, and date are required.' });
    }

    const newEvent = {
      id: dbInstance.events.length + 1,
      title,
      description,
      venue,
      event_date,
      status: new Date(event_date) > new Date() ? 'UPCOMING' : 'COMPLETED',
      banner_url: banner_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
      registration_url: registration_url || '',
      created_at: new Date().toISOString()
    };

    dbInstance.events.push(newEvent);

    res.status(201).json({ success: true, message: 'Event created successfully!', event: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating event.' });
  }
});

module.exports = router;
