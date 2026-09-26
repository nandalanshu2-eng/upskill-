const express = require('express');
const router = express.Router();
const { getInterviewQuestions, recordInterviewSession } = require('../services/store');

// GET /api/interview/questions
router.get('/questions', (req, res) => {
  try {
    const questions = getInterviewQuestions();
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/interview/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { transcript, questionId, durationSeconds, telemetry } = req.body;
    
    // Evaluate candidate response based on domain rubrics
    const lowerTranscript = (transcript || '').toLowerCase();
    const technicalKeywords = [
      'can', 'can bus', 'telemetry', 'voltage', 'delta', 'cell', 'imbalance', 
      '30mv', '50mv', 'ppe', '1000v', 'isolator', 'lock out', 'lockout', 
      'thermal', 'runaway', 'multimeter', 'balancing'
    ];
    
    const matchedKeywords = technicalKeywords.filter(k => lowerTranscript.includes(k));
    const keywordScore = Math.min(100, Math.round((matchedKeywords.length / 5) * 85 + 15));
    
    let evaluationFeedback = '';
    if (matchedKeywords.length >= 4) {
      evaluationFeedback = 'Excellent practical diagnostic approach! You correctly prioritized high-voltage lock-out safety and identified the CAN bus delta threshold.';
    } else if (matchedKeywords.length >= 2) {
      evaluationFeedback = 'Solid technical foundation. Be sure to explicitly articulate the Class 0 1000V PPE protocol and specific voltage variance limits (±30mV).';
    } else {
      evaluationFeedback = 'Good start. Remember to mention CAN bus telemetry reading and battery isolator switch verification before physical contact.';
    }

    const sessionRecord = await recordInterviewSession({
      candidateName: req.body.candidateName || 'Candidate',
      role: 'EV Battery Diagnostic & BMS Tech Lead',
      answers: [
        {
          questionId: questionId || 1,
          transcript: transcript || 'Audio response recorded',
          durationSeconds: durationSeconds || 72,
          telemetry: {
            wpm: telemetry?.wpm || 128,
            fillerWordsCount: telemetry?.fillerWordsCount || 2,
            pauseDurationSeconds: telemetry?.pauseDurationSeconds || 1.4,
            technicalKeywordsDetected: matchedKeywords
          },
          aiScore: keywordScore,
          feedback: evaluationFeedback
        }
      ],
      overallScore: keywordScore
    });

    res.json({
      success: true,
      score: keywordScore,
      feedback: evaluationFeedback,
      matchedKeywords,
      session: sessionRecord
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
