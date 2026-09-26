const express = require('express');
const router = express.Router();
const { createApplication, getApplications } = require('../services/store');

// GET /api/applications
router.get('/', async (req, res) => {
  try {
    const apps = await getApplications();
    res.json({ success: true, count: apps.length, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/applications
router.post('/', async (req, res) => {
  try {
    const { fullName, phone, hub, trade, education } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, error: 'Full name and phone are required' });
    }
    const app = await createApplication({
      fullName,
      phone,
      hub: hub || 'Pan-India Hybrid (Online + Coworking)',
      trade: trade || 'Electric Vehicle (EV) Powertrain & Battery Tech',
      education: education || '12th Standard'
    });
    res.status(201).json({
      success: true,
      message: 'Provisional seat reserved successfully',
      data: app
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
