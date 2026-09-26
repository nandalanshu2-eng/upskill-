require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const { seedTracks, seedMentors, seedApplications } = require('../data/seedData');
const Track = require('../models/Track');
const Mentor = require('../models/Mentor');
const Application = require('../models/Application');

const runSeed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/udaan_skills';
  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected! Purging and reseeding...');

    await Track.deleteMany({});
    await Mentor.deleteMany({});
    await Application.deleteMany({});

    await Track.insertMany(seedTracks);
    await Mentor.insertMany(seedMentors);
    await Application.insertMany(seedApplications);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

runSeed();
