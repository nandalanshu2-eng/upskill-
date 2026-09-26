const express = require('express');
const router = express.Router();
const { getMentors, bookMentorSession } = require('../services/store');

// GET /api/mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await getMentors(req.query);
    res.json({ success: true, count: mentors.length, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mentors/book
router.post('/book', async (req, res) => {
  try {
    const { mentorId, mentorName, studentName, phone, slot, preferredLanguage } = req.body;
    if (!studentName || !phone || !slot) {
      return res.status(400).json({ success: false, error: 'studentName, phone, and slot are required' });
    }
    const booking = await bookMentorSession({
      mentorId,
      mentorName,
      studentName,
      phone,
      slot,
      preferredLanguage
    });
    res.status(201).json({
      success: true,
      message: '1-on-1 Pratibha Setu session scheduled successfully',
      data: booking
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
