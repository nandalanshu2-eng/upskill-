const { seedTracks, seedMentors, seedQuestions, seedApplications } = require('../data/seedData');
const { getMongoStatus } = require('../config/db');
const Track = require('../models/Track');
const Mentor = require('../models/Mentor');
const Application = require('../models/Application');
const InterviewSession = require('../models/InterviewSession');

// Resilient in-memory store with auto-seeding
let memoryTracks = [...seedTracks];
let memoryMentors = [...seedMentors];
let memoryApplications = [...seedApplications];
let memoryBookings = [];
let memorySessions = [];

// Helper to seed Mongo if connected and empty
const syncMongoWithSeeds = async () => {
  if (!getMongoStatus()) return;
  try {
    const trackCount = await Track.countDocuments();
    if (trackCount === 0) {
      await Track.insertMany(seedTracks);
      console.log('[Seed] Auto-seeded Track documents into MongoDB.');
    }
    const mentorCount = await Mentor.countDocuments();
    if (mentorCount === 0) {
      await Mentor.insertMany(seedMentors);
      console.log('[Seed] Auto-seeded Mentor documents into MongoDB.');
    }
    const appCount = await Application.countDocuments();
    if (appCount === 0) {
      await Application.insertMany(seedApplications);
      console.log('[Seed] Auto-seeded Application documents into MongoDB.');
    }
  } catch (err) {
    console.warn('[Sync Warning]', err.message);
  }
};

const getTracks = async (query = {}) => {
  if (getMongoStatus()) {
    try {
      const filter = {};
      if (query.sector && query.sector !== 'all') filter.sector = query.sector;
      if (query.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ];
      }
      return await Track.find(filter);
    } catch (e) {
      console.warn('MongoDB query error, falling back to memory store:', e.message);
    }
  }

  // In-Memory Filter
  let results = [...memoryTracks];
  if (query.sector && query.sector !== 'all') {
    results = results.filter(t => t.sector === query.sector);
  }
  if (query.search) {
    const s = query.search.toLowerCase();
    results = results.filter(t =>
      t.title.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      t.activeHubs.some(h => h.toLowerCase().includes(s))
    );
  }
  if (query.duration) {
    results = results.filter(t => t.durationMonths === Number(query.duration));
  }
  return results;
};

const getTrackByIdOrSlug = async (idOrSlug) => {
  if (getMongoStatus()) {
    try {
      const track = await Track.findOne({
        $or: [{ slug: idOrSlug }, { _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }]
      });
      if (track) return track;
    } catch (e) {
      // ignore and fallback
    }
  }
  return memoryTracks.find(t => t.slug === idOrSlug || t.id.toString() === idOrSlug.toString());
};

const getMentors = async (query = {}) => {
  if (getMongoStatus()) {
    try {
      const filter = {};
      if (query.sector && query.sector !== 'all') filter.sector = query.sector;
      if (query.language && query.language !== 'all') filter.languages = { $regex: query.language, $options: 'i' };
      if (query.search) {
        filter.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { company: { $regex: query.search, $options: 'i' } },
          { title: { $regex: query.search, $options: 'i' } }
        ];
      }
      return await Mentor.find(filter);
    } catch (e) {
      console.warn('MongoDB mentor query error, using memory store:', e.message);
    }
  }

  let results = [...memoryMentors];
  if (query.sector && query.sector !== 'all') {
    results = results.filter(m => m.sector === query.sector);
  }
  if (query.language && query.language !== 'all') {
    const lang = query.language.toLowerCase();
    results = results.filter(m => m.languages.some(l => l.toLowerCase() === lang));
  }
  if (query.search) {
    const s = query.search.toLowerCase();
    results = results.filter(m =>
      m.name.toLowerCase().includes(s) ||
      m.company.toLowerCase().includes(s) ||
      m.title.toLowerCase().includes(s)
    );
  }
  return results;
};

const bookMentorSession = async (bookingData) => {
  const record = {
    id: `BOOK-${Date.now()}`,
    mentorId: bookingData.mentorId,
    mentorName: bookingData.mentorName,
    studentName: bookingData.studentName,
    phone: bookingData.phone,
    slot: bookingData.slot,
    preferredLanguage: bookingData.preferredLanguage || 'Hindi',
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED'
  };
  memoryBookings.unshift(record);
  return record;
};

const createApplication = async (appData) => {
  const tokenNum = Math.floor(1000 + Math.random() * 9000);
  const tokenId = `UDAAN-2025-${tokenNum}`;
  const record = {
    fullName: appData.fullName,
    phone: appData.phone,
    hub: appData.hub,
    trade: appData.trade,
    education: appData.education || '12th Standard',
    tokenId: tokenId,
    status: 'PROVISIONAL_RESERVED',
    createdAt: new Date().toISOString()
  };

  if (getMongoStatus()) {
    try {
      const created = await Application.create(record);
      return created;
    } catch (e) {
      console.warn('MongoDB application insert failed, storing in memory:', e.message);
    }
  }

  memoryApplications.unshift({ ...record, id: tokenId });
  return record;
};

const getApplications = async () => {
  if (getMongoStatus()) {
    try {
      return await Application.find().sort({ createdAt: -1 });
    } catch (e) {
      console.warn('Mongo read error, falling back to memory:', e.message);
    }
  }
  return memoryApplications;
};

const getInterviewQuestions = () => {
  return seedQuestions;
};

const recordInterviewSession = async (sessionData) => {
  const record = {
    id: `SESSION-${Date.now()}`,
    ...sessionData,
    createdAt: new Date().toISOString()
  };
  if (getMongoStatus()) {
    try {
      return await InterviewSession.create(record);
    } catch (e) {
      console.warn('Mongo session store fallback:', e.message);
    }
  }
  memorySessions.unshift(record);
  return record;
};

const calculateROI = ({ education = '12th', trade = 'ev', cityTier = 'tier2' }) => {
  // Base numbers calibrated from DESIGN.md and template
  const tradeSalaries = {
    ev: { monthly: 35000, annualCTC: 4.20, paybackMonths: 3.2, seniorCTC: '₹7.5L - ₹9.0L' },
    solar: { monthly: 30000, annualCTC: 3.60, paybackMonths: 2.8, seniorCTC: '₹6.0L - ₹8.0L' },
    it: { monthly: 42000, annualCTC: 5.04, paybackMonths: 3.6, seniorCTC: '₹9.0L - ₹12.5L' },
    health: { monthly: 32000, annualCTC: 3.84, paybackMonths: 3.4, seniorCTC: '₹6.5L - ₹8.5L' },
    cnc: { monthly: 34000, annualCTC: 4.08, paybackMonths: 3.0, seniorCTC: '₹7.0L - ₹9.5L' },
    logistics: { monthly: 36000, annualCTC: 4.32, paybackMonths: 3.1, seniorCTC: '₹8.0L - ₹10.5L' }
  };

  const eduMultipliers = {
    '10th': 0.90,
    '12th': 1.0,
    'iti': 1.10,
    'grad': 1.20
  };

  const cityMultipliers = {
    'tier2': 1.0,
    'tier1': 1.18
  };

  const base = tradeSalaries[trade] || tradeSalaries['ev'];
  const eduMult = eduMultipliers[education] || 1.0;
  const cityMult = cityMultipliers[cityTier] || 1.0;

  const finalMonthly = Math.round(base.monthly * eduMult * cityMult / 500) * 500;
  const finalAnnualLakhs = (finalMonthly * 12 / 100000).toFixed(2);
  const adjustedPayback = (base.paybackMonths / (eduMult * cityMult)).toFixed(1);

  return {
    education,
    trade,
    cityTier,
    monthlySalary: finalMonthly,
    annualSalaryCTC: `₹${finalAnnualLakhs} Lakhs per annum starting base`,
    paybackPeriod: `${adjustedPayback} Months`,
    projected3YearSalary: base.seniorCTC
  };
};

module.exports = {
  syncMongoWithSeeds,
  getTracks,
  getTrackByIdOrSlug,
  getMentors,
  bookMentorSession,
  createApplication,
  getApplications,
  getInterviewQuestions,
  recordInterviewSession,
  calculateROI,
  memoryBookings
};
