const express = require('express');
const router = express.Router();
const { calculateROI } = require('../services/store');

// POST /api/calculator/roi
router.post('/roi', (req, res) => {
  try {
    const { education, trade, cityTier } = req.body;
    const result = calculateROI({ education, trade, cityTier });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
