const express = require('express');
const router = express.Router();
const { getTracks, getTrackByIdOrSlug } = require('../services/store');

// GET /api/tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await getTracks(req.query);
    res.json({ success: true, count: tracks.length, data: tracks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tracks/:idOrSlug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const track = await getTrackByIdOrSlug(req.params.idOrSlug);
    if (!track) {
      return res.status(404).json({ success: false, error: 'Vocational track not found' });
    }
    res.json({ success: true, data: track });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
