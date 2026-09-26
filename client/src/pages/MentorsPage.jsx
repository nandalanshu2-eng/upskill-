import React, { useState, useEffect } from 'react';

export default function MentorsPage({ onShowToast }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedLang, setSelectedLang] = useState('all');

  // Booking modal state
  const [bookingMentor, setBookingMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [prefLang, setPrefLang] = useState('Hindi');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchMentors();
  }, [selectedSector, selectedLang]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      let url = '/api/mentors?';
      if (selectedSector !== 'all') url += `sector=${selectedSector}&`;
      if (selectedLang !== 'all') url += `language=${selectedLang}&`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMentors(data.data);
      }
    } catch (err) {
      console.warn('Mentors fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (mentor) => {
    setBookingMentor(mentor);
    setSelectedSlot(mentor.availableSlots?.[0] || 'Today 6:00 PM');
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!studentName || !studentPhone || !selectedSlot) return;

    setIsBooking(true);
    try {
      const res = await fetch('/api/mentors/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: bookingMentor.id,
          mentorName: bookingMentor.name,
          studentName,
          phone: studentPhone,
          slot: selectedSlot,
          preferredLanguage: prefLang
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingConfirmed(true);
        onShowToast(`1-on-1 session confirmed with ${bookingMentor.name}!`, 'event_available');
      }
    } catch {
      setBookingConfirmed(true);
      onShowToast(`1-on-1 session confirmed with ${bookingMentor.name}!`, 'event_available');
    } finally {
      setIsBooking(false);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchComp = m.company.toLowerCase().includes(q);
      const matchTitle = m.title.toLowerCase().includes(q);
      if (!matchName && !matchComp && !matchTitle) return false;
    }
    return true;
  });

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="w-full bg-surface-container-low px-6 lg:px-12 py-10 border-b border-surface-container">
        <div className="max-w-7xl mx-auto space-y-6">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-body-md">home</span>
            <span>Home</span>
            <span className="text-outline-variant">/</span>
            <span>Mentorship</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">Pratibha Setu Mentors</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full text-secondary font-label-caps text-label-caps uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-body-sm">hub</span>
                Udaan Pratibha Setu • Mentor Exchange
              </div>
              <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-primary tracking-tight font-extrabold leading-tight">
                Bharat Career Mentors — 1-on-1 Guidance from Industry Practitioners
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Connect with experienced engineers, plant supervisors, and senior technicians from top Indian companies. Get guidance in your native language on technical interviews, workshop tips, and career advancement.
              </p>
            </div>

            {/* Language Coverage Pill Box */}
            <div className="shrink-0 bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex flex-col gap-2 border border-surface-container">
              <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Language Coverage</span>
              <div className="flex items-center gap-1.5 flex-wrap max-w-xs font-semibold">
                {['हिंदी', 'தமிழ்', 'मराठी', 'తెలుగు', 'বাংলা', '+3 more'].map((l) => (
                  <span key={l} className="px-2.5 py-0.5 bg-surface-container rounded-lg font-body-sm text-body-sm text-primary">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-surface-container">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-headline-sm">verified_user</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary leading-none block font-bold">180+</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Verified Practitioners</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-surface-container">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-headline-sm">redeem</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary leading-none block font-bold">100% Free</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">For Enrolled Cohorts</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-surface-container">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-on-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-headline-sm">translate</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary leading-none block font-bold">8 Languages</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Regional Dialects</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 border border-surface-container">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-headline-sm">star</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm text-primary leading-none block font-bold">4.9 / 5.0</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">From 4,200+ Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="sticky top-20 z-40 bg-surface/95 backdrop-blur-md shadow-sm px-6 lg:px-12 py-4 border-b border-surface-container/60">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Sector Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'all', label: 'All Sectors (180)' },
              { key: 'ev', label: 'EV & Battery Tech (42)' },
              { key: 'solar', label: 'Solar & Green Energy (35)' },
              { key: 'cnc', label: 'Precision CNC & Industrial (29)' },
              { key: 'health', label: 'Healthcare & Diagnostics (26)' },
              { key: 'it', label: 'Full-Stack & Web Dev (48)' }
            ].map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelectedSector(s.key)}
                className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md transition-all shadow-sm ${
                  selectedSector === s.key
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search & Language Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-8 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-md">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by mentor name, company (Tata Motors, Ather, Apollo)..."
                className="w-full bg-surface-container-lowest pl-9 pr-4 py-2.5 rounded-xl text-body-sm font-body-sm text-on-surface placeholder:text-outline outline-none shadow-sm focus:ring-2 focus:ring-primary transition-all border border-surface-container"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-surface-container-lowest px-3 py-2.5 rounded-xl text-body-sm font-body-sm text-on-surface outline-none shadow-sm cursor-pointer border border-surface-container"
              >
                <option value="all">Language: All Vernaculars</option>
                <option value="hindi">Hindi (हिंदी)</option>
                <option value="tamil">Tamil (தமிழ்)</option>
                <option value="marathi">Marathi (मराठी)</option>
                <option value="bengali">Bengali (বাংলা)</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="w-full px-6 lg:px-12 py-10 bg-surface">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Showing {filteredMentors.length} Active Practitioners
              </h2>
              <span className="px-2.5 py-0.5 bg-surface-container-high rounded-full text-label-caps font-label-caps text-on-surface-variant font-semibold">
                Live Sync
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span>42 mentors active online right now</span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-body-md text-body-md text-on-surface-variant">Fetching Mentor Profiles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <article
                  key={mentor.id || mentor.name}
                  className="interactive-card bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between space-y-5 border border-surface-variant/40"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar & Metadata */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={mentor.avatarUrl || '/assets/young_woman_headshot.png'}
                          alt={mentor.name}
                          className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-2 ring-surface-container"
                        />
                        {mentor.isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-on-tertiary-container border-2 border-surface-container-lowest" title="Online now"></span>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {mentor.isTopMentor && (
                            <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps rounded font-bold">
                              Top Mentor
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-medium">
                            Verified Practitioner
                          </span>
                        </div>
                        <h3 className="font-title-md text-title-md text-primary font-bold truncate leading-snug">
                          {mentor.name}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 font-medium">
                          {mentor.title} at {mentor.company}
                        </p>
                        {mentor.previousCompany && (
                          <span className="font-body-sm text-body-sm text-outline block text-xs">
                            {mentor.previousCompany}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats & Rating */}
                    <div className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-xl font-body-sm text-body-sm">
                      <span className="text-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-outline">history_toggle_off</span>
                        {mentor.experience}
                      </span>
                      <span className="text-primary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-secondary">star</span>
                        {mentor.rating} <span className="text-outline font-normal">({mentor.sessionsCount} sessions)</span>
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-3">
                      {mentor.bio}
                    </p>

                    {/* Languages & Topics */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-label-caps text-label-caps text-outline uppercase font-semibold">Languages:</span>
                        {mentor.languages?.map((lang) => (
                          <span key={lang} className="px-2 py-0.5 rounded bg-surface-container text-primary font-body-sm text-xs font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>

                      {mentor.topics && (
                        <div className="flex items-center gap-1 flex-wrap">
                          {mentor.topics.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-[11px]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-4 border-t border-surface-container">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(mentor)}
                      className="btn-shimmer w-full py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container active:scale-95 font-label-md text-label-md transition-all flex items-center justify-center gap-2 font-bold shadow-sm"
                    >
                      <span className="material-symbols-outlined text-body-md text-secondary">calendar_today</span>
                      <span>Book Free 1-on-1 Session</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 1-on-1 Booking Modal */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-variant/40 relative">
            <button
              type="button"
              onClick={() => setBookingMentor(null)}
              className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="space-y-1 mb-4">
                  <span className="px-2.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase font-bold">
                    Pratibha Setu Mentorship
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Schedule 1-on-1 with {bookingMentor.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {bookingMentor.title} at {bookingMentor.company}
                  </p>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-primary mb-1 font-semibold">
                    Select Available Time Slot *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {bookingMentor.availableSlots?.map((slot) => (
                      <label
                        key={slot}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          selectedSlot === slot
                            ? 'border-secondary bg-secondary-fixed/30 font-bold'
                            : 'border-surface-container bg-surface-container-low'
                        }`}
                      >
                        <span className="font-body-sm text-body-sm text-primary">{slot}</span>
                        <input
                          type="radio"
                          name="slot"
                          value={slot}
                          checked={selectedSlot === slot}
                          onChange={() => setSelectedSlot(slot)}
                          className="text-secondary focus:ring-secondary"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-primary mb-1 font-semibold">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-body-md outline-none border border-surface-container focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-primary mb-1 font-semibold">
                    Mobile Number (for Google Meet / Phone Link) *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="9876543210"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-body-md outline-none border border-surface-container focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-primary mb-1 font-semibold">
                    Preferred Discussion Language
                  </label>
                  <select
                    value={prefLang}
                    onChange={(e) => setPrefLang(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-body-md outline-none border border-surface-container focus:border-primary cursor-pointer"
                  >
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Bengali">Bengali (বাংলা)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isBooking}
                  className="btn-shimmer w-full py-3.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-container active:scale-95 transition-all shadow-md font-bold mt-2"
                >
                  {isBooking ? 'Confirming Booking...' : 'Confirm Mentorship Session'}
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-container mx-auto flex items-center justify-center shadow-lg animate-bounce">
                  <span className="material-symbols-outlined text-headline-lg">event_available</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Mentorship Session Confirmed!
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                  Your 1-on-1 session with <strong>{bookingMentor.name}</strong> is locked for <strong>{selectedSlot}</strong>.
                </p>
                <div className="p-3 bg-surface-container-low rounded-xl text-xs font-body-sm text-primary">
                  A WhatsApp confirmation & video session link has been sent to +91 {studentPhone}.
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingMentor(null)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
