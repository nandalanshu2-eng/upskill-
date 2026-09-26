import React, { useState, useEffect } from 'react';
import { audioService } from '../utils/audioHelper';

export default function HomePage({ setCurrentPage, onSelectTrade, onShowToast }) {
  // Qualification state
  const [activeQual, setActiveQual] = useState('12th');

  // Sector filter for programs section
  const [activeSector, setActiveSector] = useState('all');

  // Audio player state for student stories
  const [playingStory, setPlayingStory] = useState(null);

  // Hub switcher state
  const [activeHub, setActiveHub] = useState('jaipur');

  // ROI Calculator state
  const [calcEdu, setCalcEdu] = useState('12th');
  const [calcTrade, setCalcTrade] = useState('ev');
  const [calcCityTier, setCalcCityTier] = useState('tier2');
  const [calcResult, setCalcResult] = useState({
    monthlySalary: 35000,
    annualSalaryCTC: '₹4.20 Lakhs per annum starting base',
    paybackPeriod: '3.2 Months',
    projected3YearSalary: '₹7.5L - ₹9.0L CTC'
  });

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    phone: '',
    hub: 'Jaipur Innovation Lab (Rajasthan)',
    trade: 'Electric Vehicle (EV) Powertrain & Battery Tech'
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccessToken, setLeadSuccessToken] = useState(null);

  // Recalculate ROI when inputs change
  useEffect(() => {
    fetch('/api/calculator/roi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        education: calcEdu,
        trade: calcTrade,
        cityTier: calcCityTier
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCalcResult(data.data);
        }
      })
      .catch(() => {
        // Local calculation fallback
        const baseSalaries = {
          ev: 35000,
          solar: 30000,
          it: 42000,
          health: 32000,
          cnc: 34000
        };
        const mult = (calcEdu === 'iti' ? 1.1 : calcEdu === 'grad' ? 1.2 : 1.0) * (calcCityTier === 'tier1' ? 1.18 : 1.0);
        const monthly = Math.round((baseSalaries[calcTrade] || 35000) * mult / 500) * 500;
        setCalcResult({
          monthlySalary: monthly,
          annualSalaryCTC: `₹${(monthly * 12 / 100000).toFixed(2)} Lakhs per annum starting base`,
          paybackPeriod: '3.1 Months',
          projected3YearSalary: '₹7.5L - ₹9.5L CTC'
        });
      });
  }, [calcEdu, calcTrade, calcCityTier]);

  const handleAudioToggle = (storyName, hindiSnippet) => {
    if (playingStory === storyName) {
      setPlayingStory(null);
      audioService.stopSpeech();
      onShowToast('Audio paused', 'pause');
    } else {
      setPlayingStory(storyName);
      audioService.playSubtleChime(640, 0.25);
      audioService.speakText(hindiSnippet, 'hi-IN');
      onShowToast(`Playing Hindi testimonial: ${storyName}`, 'volume_up');
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.fullName || !leadForm.phone) return;
    setLeadSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: leadForm.fullName,
          phone: leadForm.phone,
          hub: leadForm.hub,
          trade: leadForm.trade,
          education: calcEdu
        })
      });
      const data = await res.json();
      if (data.success) {
        setLeadSuccessToken(data.data.tokenId);
        onShowToast('Application received! Senior coach assigned.', 'verified');
      }
    } catch {
      const token = `UDAAN-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      setLeadSuccessToken(token);
      onShowToast('Application registered successfully!', 'check_circle');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const hubDetails = {
    jaipur: {
      name: 'Jaipur Hub (Rajasthan)',
      area: 'Sitapura Industrial Zone',
      title: 'Advanced Mechatronics & EV Lab',
      desc: '12,000 sq.ft. facility equipped with Siemens CNC simulators and Bosch diagnostic stations.',
      bg: '/assets/live_workshop.jpg'
    },
    indore: {
      name: 'Indore Tech Park (Madhya Pradesh)',
      area: 'Vijay Nagar Sector B',
      title: 'EV Battery & IoT Innovation Center',
      desc: '48V lithium testing chambers, CAN bus analyzers, and live vehicle dyno bays.',
      bg: '/assets/live_workshop.jpg'
    },
    lucknow: {
      name: 'Lucknow Academy (Uttar Pradesh)',
      area: 'Transport Nagar Hub',
      title: 'Solar Microgrid & Full-Stack Tech Labs',
      desc: 'Grid-tie synchronizers, rooftop test arrays, and high-speed developer workstations.',
      bg: '/assets/live_workshop.jpg'
    },
    coimbatore: {
      name: 'Coimbatore Center (Tamil Nadu)',
      area: 'Peelamedu Tech Corridor',
      title: 'Precision CNC & Industrial Automation Hub',
      desc: 'Multi-axis VMC machinery, FANUC robotic arms, and CMM metrology inspection.',
      bg: '/assets/live_workshop.jpg'
    }
  };

  const faqs = [
    {
      q: 'Is financial aid or 0% EMI available for students who cannot pay upfront?',
      a: 'Yes! Through our partnerships with RBI-regulated NBFC partners, 100% of Udaan diploma courses offer 0% interest EMI options. You only start repaying your tuition after your monthly paid apprenticeship begins, so your family incurs zero out-of-pocket financial stress.'
    },
    {
      q: 'Do I get an NSDC and Government recognized certificate?',
      a: 'Every diploma is directly aligned with the National Skill Development Corporation (NSDC) and respective Sector Skill Councils (Automotive, Telecom, Healthcare, Green Energy). Upon graduation, your credentials are automatically uploaded to your Government of India DigiLocker account with a verifiable QR code.'
    },
    {
      q: 'What if I do not get placed after completing the course?',
      a: 'We provide a strict Placement Promise. Udaan schedules a minimum of 3 guaranteed corporate interview rounds. In the rare event a compliant student who attended 90%+ lab shifts does not receive an offer within 90 days of graduation, our Placement Cell continues dedicated 1-on-1 mentorship until hired.'
    },
    {
      q: 'Can women join technical trades like EV mechanics and CNC machining?',
      a: "Absolutely. In fact, our specialized 'Nari Shakti in Trades' scholarship covers 40% of upfront tuition for female candidates joining EV, Solar, and IT cohorts. Over 4,200 women have successfully graduated from Udaan and are now full-time technical specialists."
    },
    {
      q: 'What languages are the workshops and classes taught in?',
      a: 'All classes are conducted in comfortable conversational Hindi, Hinglish, or the respective state vernacular (Tamil in Coimbatore, Marathi in Pune). However, every trade includes a parallel daily module teaching essential English technical vocabulary.'
    }
  ];

  return (
    <div className="w-full">
      {/* SECTION 1: HERO & TRUST ACCELERATOR */}
      <section className="relative overflow-hidden bg-surface pt-6 pb-16 lg:pb-24">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none animate-float"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-primary/10 blur-2xl pointer-events-none animate-float" style={{ animationDelay: '-2s' }}></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
              {/* Notification Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container text-primary font-label-caps text-label-caps tracking-wider shadow-sm hover:shadow transition-all">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary pulse-glow-red"></span>
                <span className="font-bold text-secondary uppercase">Mission Bharat 2025</span>
                <span className="text-outline">/</span>
                <span className="text-on-surface-variant font-medium">
                  Summer Batch: July 15 • <span className="font-bold text-secondary">85 Seats Left</span>
                </span>
              </div>

              {/* Master Headline */}
              <h1 className="font-display-hero text-display-hero-mobile sm:text-display-hero text-primary tracking-tight leading-tight">
                Hunar Se Hogi Pehchan.<br />
                <span className="text-secondary bg-clip-text bg-gradient-to-r from-secondary to-secondary-container">
                  Bharat's Premier
                </span> Career Launchpad.
              </h1>

              {/* Body Copy */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Fast-track 4 to 9-month industry-certified vocational diplomas and paid apprenticeships designed specifically for ambitious youth in Tier-2 and Tier-3 India. 100% verified placement record across 380+ national employers.
              </p>

              {/* Dual Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#quick-apply"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md shadow-md hover:bg-on-secondary-container hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all group font-semibold"
                >
                  <span>Explore 2025 Cohorts (Free Counselling)</span>
                  <span className="material-symbols-outlined text-title-md group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </a>
                <a
                  href="#roi-calculator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm ring-1 ring-outline-variant/30 hover:bg-surface-container hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all group font-semibold"
                >
                  <span className="material-symbols-outlined text-title-md text-secondary group-hover:scale-110 transition-transform">
                    calculate
                  </span>
                  <span>Calculate Starting Salary (₹)</span>
                </a>
              </div>

              {/* Bilingual Assurance & Toll Free */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-body-sm text-on-surface-variant pt-1">
                <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-body-md text-on-tertiary-container">check_circle</span>
                  हिन्दी एवं क्षेत्रीय भाषाओं में परामर्श उपलब्ध
                </span>
                <span className="text-outline-variant">•</span>
                <a href="tel:18008908322" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-body-md text-primary">call</span>
                  Toll-Free Helpline: <strong>1800-890-UDAAN</strong>
                </a>
              </div>

              {/* Education Fast Track Selectors */}
              <div className="pt-4">
                <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-2.5">
                  Quick Filter by Qualification:
                </p>
                <div className="flex flex-wrap gap-2" id="hero-qualification-filters">
                  {[
                    { key: '10th', label: '10th Pass' },
                    { key: '12th', label: '12th Standard' },
                    { key: 'iti', label: 'ITI / Polytechnic' },
                    { key: 'grad', label: 'BA / B.Com / B.Sc Grad' }
                  ].map((q) => (
                    <button
                      key={q.key}
                      onClick={() => {
                        setActiveQual(q.key);
                        setCalcEdu(q.key);
                      }}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                        activeQual === q.key
                          ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/20'
                          : 'bg-surface-container hover:bg-surface-container-high text-primary'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative animate-fade-in-up">
              <div className="interactive-card relative bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden p-4 space-y-4 border border-surface-variant/40">
                {/* Live Workshop Header Pill */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse-green"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                      Live Workshop In Session
                    </span>
                  </div>
                  <span className="font-label-caps text-label-caps text-secondary font-bold px-2 py-0.5 bg-secondary-fixed/50 rounded">
                    Indore Hub
                  </span>
                </div>

                {/* Visual Imagery Showcase */}
                <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-surface-container group">
                  <img
                    src="/assets/live_workshop.jpg"
                    alt="Indian youth apprentice in EV diagnostics lab"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent"></div>

                  {/* Floating Placement Micro-Card on Image */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-surface/95 backdrop-blur-md shadow-md flex items-center justify-between border border-surface-container/60 transition-transform duration-300 group-hover:translate-y-[-2px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold shadow-inner">
                        <span className="material-symbols-outlined text-headline-sm">bolt</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-primary font-semibold">
                          Solar & EV Diagnostics Lab
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          42 Students in Practical Shift A
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold uppercase shadow-sm">
                      Active
                    </span>
                  </div>
                </div>

                {/* Quick Live Feed Ticker */}
                <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between transition-colors hover:bg-surface-container-high">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-title-md text-on-tertiary-container">verified</span>
                    <span className="font-body-sm text-body-sm text-primary">
                      <strong className="font-bold text-primary">842 learners</strong> placed this month
                    </span>
                  </div>
                  <span className="font-label-salary text-label-salary text-secondary font-bold">
                    ₹4.6L Avg CTC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="mt-12 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant/30 animate-fade-in-up">
            <div className="flex items-center gap-3 group cursor-default p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-headline-sm">star</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">4.8 / 5</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">34,200+ Alumni Reviews</div>
              </div>
            </div>

            <div className="flex items-center gap-3 group cursor-default p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-on-tertiary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-headline-sm">payments</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">₹4.6 Lakhs</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Average Starting CTC</div>
              </div>
            </div>

            <div className="flex items-center gap-3 group cursor-default p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-headline-sm">shield</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">NSDC Aligned</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">Ministry of Skill Dev.</div>
              </div>
            </div>

            <div className="flex items-center gap-3 group cursor-default p-2 rounded-lg hover:bg-surface-container-low transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-headline-sm">credit_score</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">0% Skill Loans</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">NBFC Backed • Pay After Job</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE TRADE & CAREER PATHWAYS EXPLORER */}
      <section className="py-16 bg-surface-container-low" id="programs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-2">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
                Bharat High-Growth Sectors
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary">
                In-Demand Vocational Trades Crafted with Industry Leaders
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Targeted curriculums updated monthly based on corporate hiring matrices. Every course includes hands-on lab training and guaranteed campus interviews.
              </p>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => setCurrentPage('tracks')}
                className="font-body-sm text-body-sm text-primary font-semibold bg-surface-container-lowest px-4 py-2 rounded-full shadow-sm hover:bg-surface-container transition-all flex items-center gap-1.5"
              >
                <span>View All 24+ Diplomas</span>
                <span className="material-symbols-outlined text-body-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Trade Categories Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {[
              { key: 'all', label: 'All Trades' },
              { key: 'ev', label: 'EV & Renewable Energy' },
              { key: 'it', label: 'Digital & IT Operations' },
              { key: 'health', label: 'Healthcare & Diagnostics' },
              { key: 'cnc', label: 'Precision CNC & Automation' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSector(tab.key)}
                className={`px-4 py-2 rounded-lg font-label-md text-label-md whitespace-nowrap shadow-sm transition-all active:scale-95 ${
                  activeSector === tab.key
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Rich Trade Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            {(activeSector === 'all' || activeSector === 'ev') && (
              <div className="trade-card interactive-card bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold tracking-wide uppercase">
                      High Demand • 88% Placement in 60 Days
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-body-md text-secondary">schedule</span> 6 Months
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Electric Vehicle (EV) Powertrain & Battery Diagnostics
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                      Master lithium battery testing, BMS configuration, motor rewinding, and regenerative braking repair on actual 2-wheeler and commercial EV platforms.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Paid Apprenticeship</span>
                      <span className="font-label-salary text-label-salary text-primary font-bold">₹14,000 / month</span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Expected Placement CTC</span>
                      <span className="font-label-salary text-label-salary text-secondary font-bold">₹3.8L - ₹5.5L / yr</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs font-body-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-secondary">corporate_fare</span>
                      <span>Recruiters: <strong>Tata Motors, Ather Energy, Mahindra Electric</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-primary">location_on</span>
                      <span>Active Hubs: Jaipur, Pune, Indore Innovation Labs</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 bg-surface-container-low/50 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-surface-container">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">verified</span> NSDC Level 4 Certified
                  </span>
                  <button
                    onClick={() => onSelectTrade('Electric Vehicle (EV) Powertrain & Battery Tech')}
                    className="btn-shimmer px-4 py-2 bg-primary text-on-primary hover:bg-primary-container active:scale-95 rounded-lg font-label-md text-label-md transition-all inline-flex items-center gap-1.5 group"
                  >
                    <span>Apply For EV Batch</span>
                    <span className="material-symbols-outlined text-body-md group-hover:translate-x-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 2 */}
            {(activeSector === 'all' || activeSector === 'ev') && (
              <div className="trade-card interactive-card bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps font-bold tracking-wide uppercase">
                      Green Mission • MNRE Aligned
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-body-md text-secondary">schedule</span> 4 Months Hybrid
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Solar PV Rooftop System Engineer & Grid Specialist
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                      Covers solar array layout design, net-metering synchronization, high-voltage inverter maintenance, and on-site EPC safety compliance.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">On-Site Stipend</span>
                      <span className="font-label-salary text-label-salary text-primary font-bold">₹10,500 / month</span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Placement Salary</span>
                      <span className="font-label-salary text-label-salary text-secondary font-bold">₹3.2L - ₹4.8L / yr</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs font-body-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-secondary">corporate_fare</span>
                      <span>Recruiters: <strong>Adani Solar, Sterling & Wilson, Loom Solar</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-primary">location_on</span>
                      <span>Active Hubs: Lucknow, Nagpur, Jaipur Green Parks</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 bg-surface-container-low/50 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-surface-container">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">eco</span> PM Surya Ghar Ready
                  </span>
                  <button
                    onClick={() => onSelectTrade('Solar PV Rooftop System Engineer')}
                    className="btn-shimmer px-4 py-2 bg-primary text-on-primary hover:bg-primary-container active:scale-95 rounded-lg font-label-md text-label-md transition-all inline-flex items-center gap-1.5 group"
                  >
                    <span>Apply For Solar Batch</span>
                    <span className="material-symbols-outlined text-body-md group-hover:translate-x-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 3 */}
            {(activeSector === 'all' || activeSector === 'it') && (
              <div className="trade-card interactive-card bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold tracking-wide uppercase">
                      Remote & Regional Tech Hubs
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-body-md text-secondary">schedule</span> 7 Months Intensive
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Full-Stack Web & Low-Code Business Solutions
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                      Tailored for Tier-2 college graduates. Learn JavaScript, Python, PostgreSQL, REST APIs, plus Enterprise CRM configurations with 6 live client projects.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Capstone Project Grant</span>
                      <span className="font-label-salary text-label-salary text-primary font-bold">₹15,000 Milestone</span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Placement Salary</span>
                      <span className="font-label-salary text-label-salary text-secondary font-bold">₹4.5L - ₹7.2L / yr</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs font-body-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-secondary">corporate_fare</span>
                      <span>Recruiters: <strong>Zoho, TCS iON, Infosys Springboard, InfoEdge</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-primary">location_on</span>
                      <span>Active Hubs: Indore, Coimbatore, Patna, Lucknow Labs</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 bg-surface-container-low/50 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-surface-container">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">code</span> NASSCOM Verified
                  </span>
                  <button
                    onClick={() => onSelectTrade('Full-Stack Web & Low-Code Solutions')}
                    className="btn-shimmer px-4 py-2 bg-primary text-on-primary hover:bg-primary-container active:scale-95 rounded-lg font-label-md text-label-md transition-all inline-flex items-center gap-1.5 group"
                  >
                    <span>Apply For IT Batch</span>
                    <span className="material-symbols-outlined text-body-md group-hover:translate-x-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 4 */}
            {(activeSector === 'all' || activeSector === 'health') && (
              <div className="trade-card interactive-card bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps font-bold tracking-wide uppercase">
                      Healthcare Council Certified
                    </span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-body-md text-secondary">schedule</span> 9 Months Diploma
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Emergency Medical & Dialysis Technician
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                      Hospital emergency triage protocols, hemodialysis machine maintenance, vital parameter telemetry, and certified clinical bedside assistance.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Hospital Clinical Duty</span>
                      <span className="font-label-salary text-label-salary text-primary font-bold">₹11,000 / month</span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Placement Salary</span>
                      <span className="font-label-salary text-label-salary text-secondary font-bold">₹3.5L - ₹5.0L / yr</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs font-body-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-secondary">corporate_fare</span>
                      <span>Recruiters: <strong>Apollo Health, Fortis, Max Healthcare, Medanta</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-primary">location_on</span>
                      <span>Active Hubs: Patna, Varanasi, Bhopal Hospital Networks</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 bg-surface-container-low/50 -mx-6 -mb-6 p-6 rounded-b-2xl border-t border-surface-container">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">medical_services</span> AHA First Responder
                  </span>
                  <button
                    onClick={() => onSelectTrade('Emergency Medical & Dialysis Technician')}
                    className="btn-shimmer px-4 py-2 bg-primary text-on-primary hover:bg-primary-container active:scale-95 rounded-lg font-label-md text-label-md transition-all inline-flex items-center gap-1.5 group"
                  >
                    <span>Apply For Health Batch</span>
                    <span className="material-symbols-outlined text-body-md group-hover:translate-x-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE UDAAN ADVANTAGE (COMPARISON & 4-STEP JOURNEY) */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
              Rethinking Higher Education for Bharat
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary">
              Why Traditional Degrees Fall Short vs The Udaan Applied Model
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Millions of college graduates in Tier-2 and Tier-3 towns hold degrees that corporate recruiters cannot hire. We built an intentional bridge from day one.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Traditional */}
            <div className="interactive-card p-8 rounded-2xl bg-surface-container-high space-y-6 border border-surface-container-highest">
              <div className="flex items-center gap-3 text-error">
                <span className="material-symbols-outlined text-headline-md">cancel</span>
                <h3 className="font-title-md text-title-md text-primary font-bold">
                  The Traditional College Route
                </h3>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-title-md shrink-0 mt-0.5">close</span>
                  <span><strong>Outdated 10-year syllabus:</strong> Memorizing theory diagrams without ever handling live diagnostic kits or industrial machinery.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-title-md shrink-0 mt-0.5">close</span>
                  <span><strong>High financial burden:</strong> ₹2.5L to ₹4L invested with zero income for 3–4 continuous years.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-title-md shrink-0 mt-0.5">close</span>
                  <span><strong>Zero placement accountability:</strong> Handing a paper certificate with no interview drive or recruiter backing.</span>
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-surface-container-highest text-on-surface-variant text-xs font-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-outline">info</span>
                <span>Stat: 48.7% of general degree graduates in India are unemployable (India Skills Report 2024).</span>
              </div>
            </div>

            {/* Udaan Model */}
            <div className="interactive-card p-8 rounded-2xl bg-surface-container-lowest space-y-6 border border-primary/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center gap-3 text-on-tertiary-container">
                <span className="material-symbols-outlined text-headline-md">check_circle</span>
                <h3 className="font-title-md text-title-md text-primary font-bold">
                  The Udaan Applied Vocational Model
                </h3>
              </div>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-tertiary-container text-title-md shrink-0 mt-0.5">check</span>
                  <span><strong>70% Hands-On Workshop Practice:</strong> Learn on actual EV motors, high-voltage battery banks, and CNC machines.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-tertiary-container text-title-md shrink-0 mt-0.5">check</span>
                  <span><strong>0% EMI & Paid Stipend:</strong> Earn ₹10,000–₹15,000/mo during the apprenticeship phase; pay tuition only after placement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-tertiary-container text-title-md shrink-0 mt-0.5">check</span>
                  <span><strong>Placement Guarantee with 380+ Partners:</strong> Guaranteed minimum 3 corporate interview rounds until signed offer letter.</span>
                </li>
              </ul>
              <div className="p-4 rounded-xl bg-surface-container-low text-primary text-xs font-body-sm flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-base text-secondary">verified</span>
                <span>94.8% verified placement rate across Summer and Winter batches.</span>
              </div>
            </div>
          </div>

          {/* 4-Step Student Journey */}
          <div className="space-y-10">
            <h3 className="font-headline-md text-headline-md text-primary text-center">
              Your 4-Step Journey from Enrollment to First Paycheck
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Skill Assessment', desc: 'Aptitude check & free counseling to match your interests with high-growth sectors.' },
                { step: '02', title: 'Intensive Lab Training', desc: '3–6 months hands-on practice in state-of-the-art district innovation hubs.' },
                { step: '03', title: 'Paid Apprenticeship', desc: 'Get ₹10K–₹15K/month on real shopfloor rotations under certified mentors.' },
                { step: '04', title: 'Direct Placement', desc: 'Lock in full-time role at ₹3.8L–₹7.2L CTC with medical insurance and benefits.' },
              ].map((item) => (
                <div key={item.step} className="interactive-card bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant/30 space-y-3 relative">
                  <span className="font-display-hero text-3xl font-extrabold text-secondary/30">
                    {item.step}
                  </span>
                  <h4 className="font-title-md text-title-md text-primary font-bold">{item.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: STUDENT STORIES & AUDIO PLAYER */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
              Real Impact Stories
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary">
              Hear Directly from Learners Across Bharat
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              From daily-wage backgrounds to respected enterprise technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="interactive-card bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between group">
              <div>
                <div className="h-56 relative overflow-hidden bg-surface-container">
                  <img
                    src="/assets/male_mentor_headshot.png"
                    alt="Rahul Meena"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-primary/90 backdrop-blur-md text-on-primary font-label-caps text-label-caps uppercase shadow">
                    Sawai Madhopur, RJ
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-primary font-bold">Rahul Meena</h3>
                    <p className="font-body-sm text-body-sm text-secondary font-medium">
                      Senior Solar Commissioning Technician • Vikram Solar
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl space-y-1 font-body-sm text-body-sm">
                    <div className="text-on-surface-variant"><span className="font-medium text-outline">Earlier:</span> Daily-wage grocery helper (₹6,500/mo)</div>
                    <div className="text-primary font-bold"><span className="font-medium text-on-tertiary-container">Now:</span> ₹4.8 Lakhs / Year + ESI & PF</div>
                  </div>
                  <blockquote className="font-body-md text-body-md text-on-surface-variant italic">
                    “My father was a farmer who couldn't afford college. Udaan's 0% EMI allowed me to finish the 4-month Solar course in Jaipur. Today, I send ₹20,000 back to my village every month.”
                  </blockquote>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() =>
                    handleAudioToggle(
                      'Rahul Meena',
                      'नमस्ते, मैं राहुल मीणा हूँ। मेरे पिता किसान थे। उड़ान स्किल्स के सोलर कोर्स से आज मैं चार दशमलव आठ लाख सालाना कमा रहा हूँ।'
                    )
                  }
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-secondary active:scale-95 transition-all font-semibold"
                >
                  <span className="material-symbols-outlined text-body-md text-secondary">
                    {playingStory === 'Rahul Meena' ? 'pause_circle' : 'play_circle'}
                  </span>
                  <span>{playingStory === 'Rahul Meena' ? 'Pause Audio' : 'Listen in Hindi'}</span>
                  {playingStory === 'Rahul Meena' && (
                    <span className="flex items-end gap-0.5 h-4 ml-1 text-secondary">
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                    </span>
                  )}
                </button>
                <span className="font-label-caps text-label-caps text-outline">Batch of 2023</span>
              </div>
            </div>

            {/* Story 2 */}
            <div className="interactive-card bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between group">
              <div>
                <div className="h-56 relative overflow-hidden bg-surface-container">
                  <img
                    src="/assets/young_woman_headshot.png"
                    alt="Pooja Sharma"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-primary/90 backdrop-blur-md text-on-primary font-label-caps text-label-caps uppercase shadow">
                    Jaipur Hub, RJ
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-primary font-bold">Pooja Sharma</h3>
                    <p className="font-body-sm text-body-sm text-secondary font-medium">
                      EV Diagnostic Associate • Ather Energy
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl space-y-1 font-body-sm text-body-sm">
                    <div className="text-on-surface-variant"><span className="font-medium text-outline">Earlier:</span> 12th pass looking for typing jobs</div>
                    <div className="text-primary font-bold"><span className="font-medium text-on-tertiary-container">Now:</span> ₹5.2 Lakhs / Year + Shift Incentives</div>
                  </div>
                  <blockquote className="font-body-md text-body-md text-on-surface-variant italic">
                    “Being the first girl in my community to touch an EV chassis felt scary. Udaan gave me a 40% Nari Shakti scholarship and practical coaches who believed in me from day one.”
                  </blockquote>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() =>
                    handleAudioToggle(
                      'Pooja Sharma',
                      'नमस्कार, मैं पूजा शर्मा हूँ। जयपुर हब में ईवी कोर्स करके आज मैं एथर एनर्जी में कार्यरत हूँ। नारी शक्ति स्कॉलरशिप ने मेरा जीवन बदल दिया।'
                    )
                  }
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-secondary active:scale-95 transition-all font-semibold"
                >
                  <span className="material-symbols-outlined text-body-md text-secondary">
                    {playingStory === 'Pooja Sharma' ? 'pause_circle' : 'play_circle'}
                  </span>
                  <span>{playingStory === 'Pooja Sharma' ? 'Pause Audio' : 'Listen in Hindi'}</span>
                  {playingStory === 'Pooja Sharma' && (
                    <span className="flex items-end gap-0.5 h-4 ml-1 text-secondary">
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                    </span>
                  )}
                </button>
                <span className="font-label-caps text-label-caps text-outline">Batch of 2024</span>
              </div>
            </div>

            {/* Story 3 */}
            <div className="interactive-card bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-surface-variant/30 flex flex-col justify-between group">
              <div>
                <div className="h-56 relative overflow-hidden bg-surface-container">
                  <img
                    src="/assets/senior_engineer_headshot.png"
                    alt="Amitabh Verma"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-primary/90 backdrop-blur-md text-on-primary font-label-caps text-label-caps uppercase shadow">
                    Kanpur, UP
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-primary font-bold">Amitabh Verma</h3>
                    <p className="font-body-sm text-body-sm text-secondary font-medium">
                      Full-Stack Junior Engineer • AgroTech SaaS
                    </p>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded-xl space-y-1 font-body-sm text-body-sm">
                    <div className="text-on-surface-variant"><span className="font-medium text-outline">Earlier:</span> General B.Com with no computer skills</div>
                    <div className="text-primary font-bold"><span className="font-medium text-on-tertiary-container">Now:</span> ₹6.4 Lakhs / Year (Hybrid Model)</div>
                  </div>
                  <blockquote className="font-body-md text-body-md text-on-surface-variant italic">
                    “Standard coaching centers only taught syntax on blackboards. At Udaan Lucknow Hub, we built live portals for local shopkeepers. That portfolio got me hired immediately.”
                  </blockquote>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() =>
                    handleAudioToggle(
                      'Amitabh Verma',
                      'हेलो दोस्तों, मैं अमिताभ। लखनऊ हब से वेब डेवलपमेंट सीखकर आज मैं छह लाख चालीस हज़ार सालाना पैकेज पर रिमोट जॉब कर रहा हूँ।'
                    )
                  }
                  className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-secondary active:scale-95 transition-all font-semibold"
                >
                  <span className="material-symbols-outlined text-body-md text-secondary">
                    {playingStory === 'Amitabh Verma' ? 'pause_circle' : 'play_circle'}
                  </span>
                  <span>{playingStory === 'Amitabh Verma' ? 'Pause Audio' : 'Listen in Hindi'}</span>
                  {playingStory === 'Amitabh Verma' && (
                    <span className="flex items-end gap-0.5 h-4 ml-1 text-secondary">
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                      <span className="eq-bar"></span>
                    </span>
                  )}
                </button>
                <span className="font-label-caps text-label-caps text-outline">Batch of 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INDIA-WIDE TRAINING HUBS NETWORK */}
      <section className="py-20 bg-surface" id="hubs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hub Selector (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
                Physical Infrastructure
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary">
                42+ State-of-the-Art Hubs Across Tier-2 & Tier-3 Cities
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                You don't need to relocate to expensive metros like Bengaluru or Delhi to master industry trades. Our physical innovation hubs bring corporate-grade workshops right to your district.
              </p>

              <div className="interactive-card p-4 rounded-xl bg-surface-container-low space-y-2 border border-surface-container">
                <div className="flex items-center gap-2 text-primary font-title-md text-title-md font-bold">
                  <span className="material-symbols-outlined text-secondary">home_work</span>
                  <span>Hostel & Mess Accommodation</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Dedicated student hostels for outstation rural learners with clean subsidized mess, 24/7 security, high-speed Wi-Fi, and weekend doubt clinics.
                </p>
              </div>

              {/* Hub buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {Object.keys(hubDetails).map((key) => {
                  const hub = hubDetails[key];
                  const isActive = activeHub === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveHub(key)}
                      className={`p-3 rounded-xl shadow-sm text-left transition-all active:scale-95 border ${
                        isActive
                          ? 'bg-surface-container-lowest border-secondary ring-2 ring-secondary/20'
                          : 'bg-surface-container-lowest border-transparent hover:border-outline-variant'
                      }`}
                    >
                      <span className="font-label-salary text-label-salary text-primary block flex items-center justify-between font-bold">
                        {hub.name.split('(')[0]}
                        {isActive && <span className="material-symbols-outlined text-sm text-secondary">check</span>}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{hub.area}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Map Visual (7 cols) */}
            <div className="lg:col-span-7">
              <div className="interactive-card bg-surface-container-lowest p-6 rounded-2xl shadow-md border border-surface-variant/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-headline-sm text-secondary">map</span>
                    <span className="font-title-md text-title-md text-primary font-bold">All-India Network Map</span>
                  </div>
                  <span className="font-label-caps text-label-caps px-3 py-1 bg-surface-container rounded-full text-on-surface font-semibold">
                    Updated for 2025
                  </span>
                </div>

                {/* Map Display Box */}
                <div
                  className="w-full h-80 bg-cover bg-center rounded-xl relative overflow-hidden flex items-end p-4 shadow-inner border border-surface-container transition-all duration-500"
                  style={{ backgroundImage: `url('${hubDetails[activeHub].bg}')` }}
                >
                  <div className="absolute inset-0 bg-primary/40 transition-colors"></div>

                  {/* Pulsing Pin */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <span className="flex h-7 w-7 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-7 w-7 bg-secondary items-center justify-center text-white text-xs font-bold shadow-lg">
                        ●
                      </span>
                    </span>
                    <span className="bg-primary/95 text-white font-label-caps text-label-caps px-2.5 py-1 rounded shadow mt-1 whitespace-nowrap font-bold">
                      {hubDetails[activeHub].name}
                    </span>
                  </div>

                  <div className="bg-surface/95 backdrop-blur-md p-4 rounded-xl shadow-md max-w-sm relative z-10 border border-surface-container/60">
                    <p className="font-label-caps text-label-caps text-secondary uppercase font-bold">
                      Featured Center: {hubDetails[activeHub].name}
                    </p>
                    <p className="font-title-md text-title-md text-primary font-bold">
                      {hubDetails[activeHub].title}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {hubDetails[activeHub].desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-body-sm text-on-surface-variant">
                  <span>📍 Northern: Jaipur, Lucknow, Kanpur, Varanasi</span>
                  <span>📍 Central & Western: Indore, Bhopal, Nagpur, Pune</span>
                  <span>📍 Southern: Coimbatore, Madurai, Hubballi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: HIRING PARTNERS STRIP */}
      <section className="py-16 bg-surface-container-low" id="partners">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
              Industry Backing
            </span>
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              380+ National Employers Actively Hire From Udaan
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Leading Indian conglomerates and emerging green startups hire whole batches directly from our workshop campus drives.
            </p>
          </div>

          {/* Logos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center">
            {['TATA MOTORS', 'L&T', 'Schneider', 'ATHER', 'APOLLO', 'Reliance', 'Flipkart'].map((name, i) => (
              <div
                key={name}
                className="interactive-card h-16 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md border border-surface-variant/30 flex items-center justify-center p-3 text-center cursor-default"
              >
                <span
                  className={`font-headline-sm text-headline-sm tracking-tight font-extrabold ${
                    i % 2 === 0 ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Employer Quote Box */}
          <div className="interactive-card mt-12 bg-surface-container-lowest rounded-2xl p-8 shadow-sm hover:shadow-md border border-surface-variant/30 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-md">
              <span className="material-symbols-outlined text-headline-lg">format_quote</span>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <p className="font-body-lg text-body-lg text-primary italic">
                “Most fresh college graduates spend 6 months in basic training before touching a single wire. Udaan technicians arrive Day 1 job-ready with practical diagnostics experience on actual EV harnesses and safety protocols.”
              </p>
              <div className="text-xs font-body-sm text-on-surface-variant">
                <strong className="text-primary font-bold">Vikramaditya Sengupta</strong> • Head of Talent Acquisition & Plant Operations, GreenTech India
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: STARTING SALARY & ROI CALCULATOR WIDGET */}
      <section className="py-20 bg-surface" id="roi-calculator">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
              Transparent Career Economics
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary">
              Calculate Your Starting Salary & ROI
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              See exactly how quickly your Udaan training pays for itself based on real placement data from the last 12 cohorts.
            </p>
          </div>

          <div className="interactive-card max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl p-6 sm:p-10 shadow-xl border border-surface-variant/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Education */}
                <div>
                  <label className="block font-label-md text-label-md text-primary mb-2 font-semibold">
                    1. Your Current Education Background
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: '12th', label: '12th Standard' },
                      { key: 'iti', label: 'ITI Diploma' },
                      { key: 'grad', label: 'College Grad' }
                    ].map((edu) => (
                      <button
                        key={edu.key}
                        type="button"
                        onClick={() => setCalcEdu(edu.key)}
                        className={`px-3 py-2 rounded-lg font-label-caps text-label-caps text-center transition-all ${
                          calcEdu === edu.key
                            ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/20'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {edu.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Trade */}
                <div>
                  <label className="block font-label-md text-label-md text-primary mb-2 font-semibold">
                    2. Desired High-Demand Career Trade
                  </label>
                  <select
                    value={calcTrade}
                    onChange={(e) => setCalcTrade(e.target.value)}
                    className="w-full bg-surface-container-low text-primary p-3 rounded-lg font-body-md text-body-md border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="ev">Electric Vehicle (EV) Powertrain & Diagnostics</option>
                    <option value="solar">Solar PV Rooftop System Engineer</option>
                    <option value="it">Full-Stack Web & Low-Code Solutions</option>
                    <option value="health">Emergency Medical & Dialysis Technician</option>
                    <option value="cnc">Precision CNC Machine Programmer</option>
                  </select>
                </div>

                {/* 3. Placement Tier */}
                <div>
                  <label className="block font-label-md text-label-md text-primary mb-2 font-semibold">
                    3. Preferred Placement City Location
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="p-3 bg-surface-container-low rounded-xl flex items-center gap-2 cursor-pointer border border-surface-container hover:bg-surface-container transition-colors">
                      <input
                        type="radio"
                        name="city_tier"
                        value="tier2"
                        checked={calcCityTier === 'tier2'}
                        onChange={() => setCalcCityTier('tier2')}
                        className="text-secondary focus:ring-secondary"
                      />
                      <span className="font-body-sm text-body-sm text-primary font-medium">
                        Tier-2 Regional (Jaipur, Indore, Lucknow)
                      </span>
                    </label>
                    <label className="p-3 bg-surface-container-low rounded-xl flex items-center gap-2 cursor-pointer border border-surface-container hover:bg-surface-container transition-colors">
                      <input
                        type="radio"
                        name="city_tier"
                        value="tier1"
                        checked={calcCityTier === 'tier1'}
                        onChange={() => setCalcCityTier('tier1')}
                        className="text-secondary focus:ring-secondary"
                      />
                      <span className="font-body-sm text-body-sm text-primary font-medium">
                        Metro / Tier-1 (Pune, Bengaluru, NCR)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Output Display */}
              <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 flex flex-col justify-between space-y-6 border border-surface-container shadow-inner">
                <div className="space-y-4">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    Estimated Earnings Preview
                  </span>
                  <div>
                    <span className="text-xs font-body-sm text-on-surface-variant block">
                      Expected Monthly Starting Salary
                    </span>
                    <div className="font-display-hero text-headline-lg sm:text-display-hero-mobile text-primary font-bold flex items-baseline">
                      ₹<span>{calcResult.monthlySalary.toLocaleString('en-IN')}</span>
                      <span className="text-title-md text-on-surface-variant font-normal"> / mo</span>
                    </div>
                    <span className="text-xs font-body-sm text-on-tertiary-container block mt-0.5 font-medium">
                      {calcResult.annualSalaryCTC}
                    </span>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-surface-container">
                    <div className="flex items-center justify-between text-xs font-body-sm">
                      <span className="text-on-surface-variant">Time to Breakeven Course Fee:</span>
                      <strong className="text-primary font-bold">{calcResult.paybackPeriod}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs font-body-sm">
                      <span className="text-on-surface-variant">Projected 3-Year Senior Salary:</span>
                      <strong className="text-secondary font-bold">{calcResult.projected3YearSalary}</strong>
                    </div>
                  </div>
                </div>

                <a
                  href="#quick-apply"
                  className="btn-shimmer w-full py-3 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md text-center hover:bg-on-secondary-container hover:shadow-lg active:scale-95 transition-all shadow-sm font-semibold block"
                >
                  Claim Guaranteed Seat In Batch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ ACCORDION */}
      <section className="py-20 bg-surface-container-low" id="faqs">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-10">
          <div className="text-center space-y-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
              Got Questions?
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything parents and students need to know before joining.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="interactive-card bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant/30 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer select-none"
                >
                  <span className="font-title-md text-title-md text-primary font-semibold">
                    {faq.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-title-md text-secondary transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-0 transition-all duration-300">
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA & LEAD CAPTURE FORM */}
      <section className="py-20 bg-primary text-on-primary relative overflow-hidden" id="quick-apply">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none animate-float"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text & Trust (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-widest font-bold">
                Your Career Starts Here
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-primary font-bold">
                Ready to Transform Your Ambition into a Respected Career?
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed leading-relaxed">
                Don't waste another year waiting for competitive exam results or unaccredited degrees. Get into a practical workshop next week and start earning with dignity.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-headline-sm text-on-tertiary-container">verified</span>
                  <span className="font-body-md text-body-md text-on-primary">Free 1-on-1 counseling with industry engineers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-headline-sm text-on-tertiary-container">support_agent</span>
                  <span className="font-body-md text-body-md text-on-primary">Local language assistance for parents & guardians</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-headline-sm text-on-tertiary-container">savings</span>
                  <span className="font-body-md text-body-md text-on-primary">Immediate eligibility check for 0% EMI & Scholarships</span>
                </div>
              </div>

              {/* WhatsApp Chat Pill */}
              <div className="pt-4">
                <a
                  href="https://wa.me/919820000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 hover:scale-105 text-on-primary font-body-sm text-body-sm backdrop-blur-md transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-body-md text-on-tertiary-container">chat</span>
                  <span>Got quick questions? Chat on WhatsApp: <strong>+91 98200 UDAAN</strong></span>
                </a>
              </div>
            </div>

            {/* Quick Lead Capture Form (6 Cols) */}
            <div className="lg:col-span-6">
              <div className="interactive-card bg-surface-container-lowest text-on-surface rounded-2xl p-8 shadow-2xl space-y-5 border border-surface-variant/40">
                {!leadSuccessToken ? (
                  <>
                    <div className="space-y-1">
                      <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                        Book Free Career Counseling
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Our senior technical coach will call you within 15 minutes.
                      </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleLeadSubmit}>
                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">
                          Full Name (पूरा नाम) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar Patel"
                          value={leadForm.fullName}
                          onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                          className="w-full bg-surface-container-low px-4 py-3 rounded-lg font-body-md text-body-md text-on-surface outline-none border border-transparent focus:border-primary focus:bg-surface transition-all"
                        />
                      </div>

                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">
                          Mobile Number (मोबाइल नंबर) *
                        </label>
                        <div className="flex items-center bg-surface-container-low rounded-lg overflow-hidden border border-transparent focus-within:border-primary focus-within:bg-surface transition-all">
                          <span className="px-3 py-3 text-on-surface-variant font-label-md text-label-md bg-surface-container-high/40">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            placeholder="9876543210"
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                            className="w-full bg-transparent px-3 py-3 font-body-md text-body-md text-on-surface outline-none"
                          />
                        </div>
                        <span className="text-xs font-body-sm text-outline mt-1 block">
                          Instant OTP verification for seat confirmation.
                        </span>
                      </div>

                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">
                          Nearest Hub / City (नज़दीकी केंद्र) *
                        </label>
                        <select
                          value={leadForm.hub}
                          onChange={(e) => setLeadForm({ ...leadForm, hub: e.target.value })}
                          className="w-full bg-surface-container-low px-4 py-3 rounded-lg font-body-md text-body-md text-on-surface outline-none border border-transparent focus:border-primary cursor-pointer"
                        >
                          <option value="Jaipur Innovation Lab (Rajasthan)">Jaipur Innovation Lab (Rajasthan)</option>
                          <option value="Indore Skill Park (Madhya Pradesh)">Indore Skill Park (Madhya Pradesh)</option>
                          <option value="Lucknow Digital Academy (Uttar Pradesh)">Lucknow Digital Academy (Uttar Pradesh)</option>
                          <option value="Patna Vocational Complex (Bihar)">Patna Vocational Complex (Bihar)</option>
                          <option value="Coimbatore Engineering Center (Tamil Nadu)">Coimbatore Engineering Center (Tamil Nadu)</option>
                          <option value="Pune Industrial Campus (Maharashtra)">Pune Industrial Campus (Maharashtra)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-label-md text-label-md text-primary mb-1.5 font-semibold">
                          Interested Trade (पसंदीदा कोर्स)
                        </label>
                        <select
                          value={leadForm.trade}
                          onChange={(e) => setLeadForm({ ...leadForm, trade: e.target.value })}
                          className="w-full bg-surface-container-low px-4 py-3 rounded-lg font-body-md text-body-md text-on-surface outline-none border border-transparent focus:border-primary cursor-pointer"
                        >
                          <option value="Electric Vehicle (EV) Powertrain & Battery Tech">Electric Vehicle (EV) Powertrain & Battery Tech</option>
                          <option value="Solar PV Rooftop System Engineer">Solar PV Rooftop System Engineer</option>
                          <option value="Full-Stack Web & Low-Code Solutions">Full-Stack Web & Low-Code Solutions</option>
                          <option value="Emergency Medical & Dialysis Technician">Emergency Medical & Dialysis Technician</option>
                          <option value="Precision CNC Machine Programmer">Precision CNC Machine Programmer</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="btn-shimmer w-full py-4 rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm hover:bg-on-secondary-container hover:shadow-xl active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 font-bold"
                      >
                        <span>{leadSubmitting ? 'Submitting...' : 'Book Free Counseling Session'}</span>
                        <span className="material-symbols-outlined text-title-md">arrow_forward</span>
                      </button>

                      <p className="text-center text-xs font-body-sm text-outline pt-1 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <span>Your details are 100% safe. Government of India Skill Mission Partner.</span>
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-container mx-auto flex items-center justify-center shadow-lg animate-bounce">
                      <span className="material-symbols-outlined text-headline-lg">verified</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Dhanyawad! Request Received.
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                      Our regional technical counselor has reserved your provisional slot and will phone you within 15 minutes.
                    </p>
                    <div className="p-3.5 bg-surface-container-low rounded-xl inline-block font-label-salary text-label-salary text-secondary font-bold">
                      Token ID: #{leadSuccessToken}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setLeadSuccessToken(null)}
                        className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
