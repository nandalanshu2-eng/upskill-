const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  previousCompany: { type: String },
  sector: { type: String, required: true }, // 'ev', 'solar', 'it', 'health', 'cnc', 'logistics'
  experience: { type: String, required: true },
  experienceYears: { type: Number, default: 5 },
  rating: { type: Number, default: 4.9 },
  sessionsCount: { type: Number, default: 45 },
  languages: [{ type: String }],
  bio: { type: String, required: true },
  avatarUrl: { type: String },
  isTopMentor: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: true },
  availableSlots: [{ type: String }],
  topics: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
