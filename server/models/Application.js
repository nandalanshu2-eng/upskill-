const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  hub: { type: String, required: true },
  trade: { type: String, required: true },
  education: { type: String, default: '12th' },
  tokenId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['PROVISIONAL_RESERVED', 'COUNSELOR_ASSIGNED', 'VERIFIED', 'ENROLLED'], default: 'PROVISIONAL_RESERVED' },
  source: { type: String, default: 'Web Quick Apply' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
