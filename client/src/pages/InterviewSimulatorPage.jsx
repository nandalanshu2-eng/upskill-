import React, { useState, useEffect } from 'react';
import { audioService } from '../utils/audioHelper';

export default function InterviewSimulatorPage({ onShowToast }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Timer & state
  const [secondsRemaining, setSecondsRemaining] = useState(165); // 02:45
  const [isPaused, setIsPaused] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Recording & simulation state
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [candidateTranscript, setCandidateTranscript] = useState(
    'First, I check the CAN bus telemetry logs to verify cell voltage differentials. A delta over 30mV across cells indicates significant imbalance. Before opening the enclosure, I verify the battery isolator is locked out, check with a multimeter that residual voltage is under 5V, and put on Class 0 1000V rated PPE gloves.'
  );

  // Real-time telemetry
  const [telemetry, setTelemetry] = useState({
    wpm: 128,
    fillerWordsCount: 1,
    pauseDurationSeconds: 1.2
  });

  // Evaluation results
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (isPaused || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, secondsRemaining]);

  // Recording timer effect
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const fetchQuestion = async () => {
    try {
      const res = await fetch('/api/interview/questions');
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setQuestion(data.data[0]);
      }
    } catch {
      // Fallback question
      setQuestion({
        id: 1,
        questionNumber: 3,
        totalQuestions: 6,
        role: 'EV Battery Diagnostic & BMS Tech Lead (Tata Motors Prep)',
        interviewer: {
          name: 'Aditi Verma',
          title: 'Senior EV Powertrain & Battery Diagnostics Lead',
          companyTag: 'Tata Motors SME',
          avatarUrl: '/assets/young_woman_headshot.png'
        },
        questionText:
          'Explain how you identify cell imbalance in a 48V Lithium-ion battery pack using a BMS telemetry log. What immediate corrective safety steps would you take before opening the enclosure?',
        translationHindi:
          '48V लीथियम-आयन बैटरी पैक में BMS टेलीमेट्री लॉग के ज़रिए सेल इम्बैलेंस की पहचान कैसे करेंगे? एनक्लोज़र खोलने से पहले आप कौन-से प्राथमिक सुरक्षा कदम उठाएंगे?',
        audioDuration: '0:18s',
        competencyAnchors: [
          'Thermal Runaway Protocol',
          'Multimeter & CAN Log Delta (>30mV)',
          '1000V High-Voltage PPE Check'
        ],
        hint:
          'Begin your answer by defining the tolerable voltage variance across cells (±20mV to 50mV). Mention pulling real-time CAN bus telemetry, checking cell temperatures for delta > 3°C, verifying BMS auto-balancing status, and donning Class 0 (1000V rated) rubber gloves before physical unbolting.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayQuestionAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      audioService.stopSpeech();
    } else {
      setIsPlayingAudio(true);
      audioService.playSubtleChime(580, 0.3);
      audioService.speakText(
        question?.questionText || 'Explain how you identify cell imbalance in a 48V Lithium-ion battery pack.',
        'en-IN'
      );
      setTimeout(() => setIsPlayingAudio(false), 12000);
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      audioService.playSubtleChime(440, 0.2);
      onShowToast('Audio recording captured. Ready for AI evaluation.', 'mic_off');
    } else {
      setIsRecording(true);
      setElapsedSeconds(0);
      audioService.playSubtleChime(880, 0.2);
      onShowToast('Microphone active. Speak candidate answer...', 'mic');
    }
  };

  const handleEvaluateAnswer = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question?.id || 1,
          transcript: candidateTranscript,
          durationSeconds: elapsedSeconds || 72,
          telemetry: telemetry
        })
      });
      const data = await res.json();
      if (data.success) {
        setEvaluation(data);
        audioService.playSubtleChime(784, 0.4);
        onShowToast(`Evaluated! Overall Score: ${data.score}/100`, 'verified');
      }
    } catch {
      // Fallback
      setEvaluation({
        score: 92,
        feedback:
          'Outstanding practical diagnostic answer! You clearly cited the 30mV threshold, highlighted CAN bus telemetry verification, and strictly prioritized 1000V PPE protocol before physical opening.',
        matchedKeywords: ['can', 'telemetry', 'voltage', 'delta', '1000v', 'ppe', 'isolator']
      });
      onShowToast('Evaluated! Score: 92/100', 'verified');
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const ringPercent = Math.round((secondsRemaining / 180) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Assessment Control & Progress Bar */}
      <header className="w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-surface-container">
        {/* Breadcrumbs & Meta Badge */}
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-bold">
              Live Mock Room #4
            </span>
          </div>
          <span className="text-surface-variant font-bold">•</span>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed font-label-md text-label-md">
            <span className="material-symbols-outlined text-body-md text-secondary">electric_bolt</span>
            <span className="truncate font-semibold">EV Battery Diagnostic & BMS Tech Lead (Tata Motors Prep)</span>
          </div>
        </div>

        {/* Question Stepper & Active Timer Gauge */}
        <div className="flex items-center justify-between sm:justify-center gap-6 px-4 py-2 bg-surface-container-low rounded-xl">
          <div className="flex flex-col text-left sm:text-right">
            <div className="flex items-center gap-1.5 font-label-md text-label-md text-primary font-bold">
              <span className="material-symbols-outlined text-body-sm text-secondary">timer</span>
              <span>{formatTimer(secondsRemaining)} remaining</span>
            </div>
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Question 3 of 6
            </span>
          </div>

          {/* SVG Ring Progress Countdown */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-variant"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
              <path
                className="text-secondary transition-all duration-1000 ease-linear"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${ringPercent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.2"
              ></path>
            </svg>
            <span className="absolute font-label-caps text-label-caps text-primary font-bold">
              {ringPercent}%
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold"
          >
            <span className="material-symbols-outlined text-body-md text-secondary">lightbulb</span>
            <span>Tip & Rubric (H)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            <span className="material-symbols-outlined text-body-lg">
              {isPaused ? 'play_circle' : 'pause_circle'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Focus */}
        <main className="lg:col-span-8 flex flex-col space-y-6">
          {/* Question Card */}
          <article className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden border border-surface-variant/40">
            <div className="absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-br from-secondary/10 via-primary-fixed/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            {/* Interviewer Persona Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 bg-surface-container-low/50 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 px-6 sm:px-8 pt-5 rounded-t-2xl border-b border-surface-container">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src="/assets/young_woman_headshot.png"
                    alt="Aditi Verma"
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-primary-container"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-on-tertiary-container rounded-full ring-2 ring-surface-container-lowest"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-title-md text-title-md text-primary font-bold">
                      {question?.interviewer?.name || 'Aditi Verma'}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-semibold">
                      {question?.interviewer?.companyTag || 'Tata Motors SME'}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {question?.interviewer?.title || 'Senior EV Powertrain & Battery Diagnostics Lead'}
                  </p>
                </div>
              </div>

              {/* State Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-md text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                <span>{isRecording ? 'Listening to Candidate' : 'Waiting for Response'}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 font-label-caps text-label-caps text-secondary tracking-widest uppercase font-bold">
                <span className="material-symbols-outlined text-body-md">help</span>
                <span>Scenario-Based Diagnostic Problem</span>
              </div>
              <p className="font-headline-md text-headline-md text-primary font-bold leading-snug tracking-tight">
                “{question?.questionText}”
              </p>

              {/* Vernacular Hinglish Assist */}
              <div className="bg-surface-container-low/70 rounded-xl p-4 border border-surface-container">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-body-lg text-secondary shrink-0 mt-0.5">
                    record_voice_over
                  </span>
                  <div className="space-y-1">
                    <span className="font-label-caps text-label-caps text-on-secondary-container uppercase tracking-wider font-bold">
                      हिन्दी निर्देश (Vernacular Translation)
                    </span>
                    <p className="font-body-md text-body-md text-on-surface">
                      “{question?.translationHindi}”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Competency Anchors */}
            <div className="space-y-2 pt-2">
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-bold">
                Expected Competency Anchors:
              </span>
              <div className="flex flex-wrap gap-2">
                {question?.competencyAnchors?.map((anchor) => (
                  <span
                    key={anchor}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-md text-label-md text-primary font-semibold"
                  >
                    <span className="material-symbols-outlined text-body-sm text-secondary">verified</span>
                    {anchor}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Audio Replay */}
            <div className="flex items-center justify-between pt-4 border-t border-surface-container">
              <button
                type="button"
                onClick={handlePlayQuestionAudio}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-label-md text-label-md font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-body-md text-secondary">
                  {isPlayingAudio ? 'stop' : 'play_arrow'}
                </span>
                <span>{isPlayingAudio ? 'Stop Audio' : `Play Question Audio (${question?.audioDuration || '0:18s'})`}</span>
              </button>
              <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-body-sm text-on-tertiary-container">verified</span>
                Tata Motors Certified Trade Rubric
              </span>
            </div>
          </article>

          {/* Hint Accordion */}
          {showHints && (
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-3 border border-secondary/30 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-secondary font-bold">
                  <span className="material-symbols-outlined text-body-md">psychology</span>
                  <span className="font-title-md text-title-md">Interview Coach Guidance (Instant Rubric)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHints(false)}
                  className="text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-body-md">close</span>
                </button>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {question?.hint}
              </p>
            </div>
          )}

          {/* Voice-Recording Station */}
          <div className="w-full bg-primary text-on-primary rounded-2xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-secondary/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-container"></span>
                </span>
                <span className="font-label-md text-label-md text-primary-fixed tracking-wide font-semibold">
                  {isRecording ? 'Recording Candidate Audio • Speak naturally into mic' : 'Microphone Ready'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary-fixed font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-body-sm text-tertiary-fixed">mic</span>
                <span className="truncate max-w-[210px]">Realtek HD Audio (Built-in)</span>
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
              </div>
            </div>

            {/* Pulsating Waveform Visualizer */}
            <div className="w-full bg-primary-container/80 rounded-xl p-5 flex flex-col items-center justify-center space-y-3 relative z-10 border border-outline-variant/20">
              <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-16 w-full px-2 overflow-hidden">
                {[35, 60, 85, 45, 70, 95, 50, 80, 65, 90, 40, 75, 55, 85, 30].map((h, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      idx % 3 === 0
                        ? 'bg-secondary'
                        : idx % 3 === 1
                        ? 'bg-secondary-container'
                        : 'bg-on-tertiary-container'
                    } ${isRecording ? 'animate-pulse' : ''}`}
                    style={{ height: isRecording ? `${h}%` : '15%' }}
                  ></span>
                ))}
              </div>

              {/* Elapsed Timer */}
              <div className="flex items-center gap-2 font-label-md text-label-md text-primary-fixed">
                <span className="material-symbols-outlined text-body-sm text-secondary-container">mic</span>
                <span>{formatTimer(elapsedSeconds)} elapsed</span>
                <span className="text-outline">•</span>
                <span className="text-surface-variant">Optimal limit: 03:00</span>
              </div>
            </div>

            {/* Editable Transcript Area */}
            <div className="space-y-2 relative z-10">
              <label className="block text-xs font-label-caps uppercase text-primary-fixed font-bold tracking-wider">
                Live Speech-to-Text Transcription:
              </label>
              <textarea
                rows={3}
                value={candidateTranscript}
                onChange={(e) => setCandidateTranscript(e.target.value)}
                className="w-full bg-primary-container/60 p-3.5 rounded-xl font-body-sm text-body-sm text-on-primary border border-outline-variant/30 outline-none focus:border-secondary transition-all"
                placeholder="Transcribed voice will appear here..."
              />
            </div>

            {/* Master Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 relative z-10">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-label-md text-label-md transition-all active:scale-95 flex items-center justify-center gap-2 font-bold ${
                  isRecording
                    ? 'bg-error text-on-error animate-pulse shadow-lg'
                    : 'bg-secondary text-on-secondary hover:bg-on-secondary-container shadow-md'
                }`}
              >
                <span className="material-symbols-outlined">{isRecording ? 'stop' : 'mic'}</span>
                <span>{isRecording ? 'Stop Recording' : 'Start Candidate Mic'}</span>
              </button>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleEvaluateAnswer}
                className="btn-shimmer w-full sm:w-auto px-6 py-3.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim transition-all active:scale-95 flex items-center justify-center gap-2 font-bold shadow-md"
              >
                <span className="material-symbols-outlined text-title-md">auto_awesome</span>
                <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit Answer for AI Score'}</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right Column: Live Telemetry Drawer & Scoring */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Live Telemetry Panel */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-5 border border-surface-variant/40">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                Live Speech Telemetry
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-4 font-body-sm text-body-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Speaking Rate:</span>
                <strong className="text-primary font-bold">{telemetry.wpm} Words / Min</strong>
              </div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Filler Words Detected:</span>
                <strong className="text-on-tertiary-container font-bold">{telemetry.fillerWordsCount} (Low)</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Longest Hesitation:</span>
                <strong className="text-primary font-bold">{telemetry.pauseDurationSeconds}s (Normal)</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Audio Signal Quality:</span>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-caps font-bold">
                  98% Clean
                </span>
              </div>
            </div>
          </div>

          {/* AI Rubric & Score Card */}
          {evaluation && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl space-y-5 border border-tertiary-container/30 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                  AI Evaluation Result
                </span>
                <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-sm">
                  Tata Motors Benchmark
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display-hero text-5xl font-extrabold text-primary">
                  {evaluation.score}
                </span>
                <span className="font-title-md text-title-md text-on-surface-variant">/ 100</span>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {evaluation.feedback}
              </p>

              {/* Matched Keywords */}
              <div className="space-y-2 pt-2 border-t border-surface-container">
                <span className="text-xs font-label-caps text-outline uppercase font-bold">
                  Detected Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.matchedKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-full bg-tertiary-fixed/60 text-on-tertiary-fixed font-label-caps text-xs font-bold"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tata Motors SME Note */}
          <div className="bg-surface-container-low rounded-2xl p-5 space-y-3 border border-surface-container">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-secondary">engineering</span>
              <span className="font-label-md text-label-md">SME Aditi Verma's Tip</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              “In technical rounds, recruiters care more about safety sequencing than speed. Always state that you de-energized the pack before checking physical hardware.”
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
