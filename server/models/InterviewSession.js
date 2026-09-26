const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  candidateName: { type: String, default: 'Candidate' },
  role: { type: String, default: 'EV Battery Diagnostic & BMS Tech Lead' },
  company: { type: String, default: 'Tata Motors Prep' },
  interviewer: { type: String, default: 'Aditi Verma' },
  answers: [
    {
      questionId: Number,
      questionText: String,
      transcript: String,
      durationSeconds: Number,
      telemetry: {
        wpm: Number,
        fillerWordsCount: Number,
        pauseDurationSeconds: Number,
        technicalKeywordsDetected: [String],
      },
      aiScore: Number,
      feedback: String,
    }
  ],
  overallScore: { type: Number, default: 85 },
  status: { type: String, default: 'COMPLETED' },
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
