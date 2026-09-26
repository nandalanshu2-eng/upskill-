const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sector: { type: String, required: true }, // 'ev', 'solar', 'it', 'health', 'cnc', 'logistics'
  sectorLabel: { type: String, required: true },
  badge: { type: String, default: 'High Demand' },
  duration: { type: String, required: true },
  durationMonths: { type: Number, required: true },
  mode: { type: String, default: 'Full-Time Workshop' },
  description: { type: String, required: true },
  stipend: { type: String, required: true },
  stipendAmount: { type: Number, default: 12000 },
  placementCTC: { type: String, required: true },
  minEligibility: { type: String, required: true },
  recruiters: [{ type: String }],
  activeHubs: [{ type: String }],
  certification: { type: String, default: 'NSDC Level 4 Aligned' },
  curriculum: [
    {
      step: Number,
      title: String,
      detail: String,
    }
  ],
  seatsAvailable: { type: Number, default: 12 },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
