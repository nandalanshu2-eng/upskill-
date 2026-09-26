import React, { useState, useEffect } from 'react';

export default function VocationalTracksPage({ onSelectTrade, onShowToast }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [durationFilter, setDurationFilter] = useState('');
  const [eligibilityFilter, setEligibilityFilter] = useState('');
  const [hubFilter, setHubFilter] = useState('');
  const [summerOnly, setSummerOnly] = useState(true);
  const [expandedCurriculum, setExpandedCurriculum] = useState({});

  useEffect(() => {
    fetchTracks();
  }, [selectedSector]);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const url = selectedSector === 'all' ? '/api/tracks' : `/api/tracks?sector=${selectedSector}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTracks(data.data);
      }
    } catch (err) {
      console.warn('Tracks fetch failed, using fallback', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCurriculum = (trackId) => {
    setExpandedCurriculum((prev) => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };

  const filteredTracks = tracks.filter((t) => {
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchRec = t.recruiters?.some((r) => r.toLowerCase().includes(q));
      const matchHub = t.activeHubs?.some((h) => h.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchRec && !matchHub) return false;
    }
    if (durationFilter && t.durationMonths !== Number(durationFilter)) return false;
    if (eligibilityFilter && !t.minEligibility.toLowerCase().includes(eligibilityFilter.toLowerCase())) return false;
    if (hubFilter && !t.activeHubs?.some((h) => h.toLowerCase().includes(hubFilter.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="w-full">
      {/* Sub-Header & Breadcrumb Bar */}
      <section className="relative bg-surface-container-low px-6 lg:px-12 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-base">home</span>
            <span>Home</span>
            <span className="text-outline-variant">/</span>
            <span>Programs & Trades</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-medium">All Vocational Tracks</span>
          </nav>

          {/* Main Section Title & Guarantee Pill */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps rounded-full tracking-wide uppercase font-bold">
                  <span className="material-symbols-outlined text-sm text-on-tertiary-container">verified</span>
                  NSDC Approved & Guaranteed Apprenticeships
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps rounded-full uppercase tracking-wide font-bold">
                  <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
                  Summer 2025 Admissions Open
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-primary tracking-tight font-extrabold">
                Explore 24+ Industry-Aligned Vocational Tracks
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Hands-on 4 to 9-month diploma programs engineered directly with Tier-1 recruiters. Fast-track your career with practical workshop labs, ₹10,000–₹18,000/mo paid stipends, and guaranteed placement support across 42 Bharat Tech Hubs.
              </p>
            </div>

            {/* Stat highlights */}
            <div className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm shrink-0 border border-surface-container">
              <div className="text-left pr-4">
                <p className="font-headline-sm text-headline-sm text-primary font-bold leading-none">94.8%</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 uppercase">Placement Track</p>
              </div>
              <div className="w-px h-8 bg-surface-container-highest"></div>
              <div className="text-left pr-4">
                <p className="font-headline-sm text-headline-sm text-secondary font-bold leading-none">₹4.6L</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 uppercase">Avg. Fresh CTC</p>
              </div>
              <div className="w-px h-8 bg-surface-container-highest"></div>
              <div className="text-left">
                <p className="font-headline-sm text-headline-sm text-on-tertiary-container font-bold leading-none">380+</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant mt-1 uppercase">Hiring Partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Strip */}
      <section className="px-6 lg:px-12 py-6 sticky top-20 z-40 bg-surface/95 backdrop-blur-md shadow-sm border-b border-surface-container/60">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full bg-surface-container-lowest rounded-xl shadow-sm flex items-center px-4 py-2 border border-surface-container">
              <span className="material-symbols-outlined text-outline mr-3">search</span>
              <input
                type="text"
                id="trackSearchInput"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by trade, skill (e.g. EV, Solar, Python, CNC), or city..."
                className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-outline"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-lg font-label-caps text-label-caps tracking-wider uppercase transition-colors shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm w-full md:w-auto border border-surface-container">
                <span className="material-symbols-outlined text-secondary text-base">notifications_active</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Summer '25: Only 12 Seats/Hub
                </span>
              </div>
            </div>
          </div>

          {/* Sector Tabs Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'all', label: 'All Tracks (24)' },
              { key: 'ev', label: 'EV & Clean Energy (6)' },
              { key: 'cnc', label: 'Advanced Manufacturing & CNC (5)' },
              { key: 'it', label: 'IT & Digital Operations (4)' },
              { key: 'health', label: 'Healthcare & Clinical (5)' },
              { key: 'logistics', label: 'Supply Chain & Heavy Logistics (4)' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedSector(tab.key)}
                className={`sector-tab px-4 py-2 rounded-lg font-label-md text-label-md shrink-0 transition-all shadow-sm ${
                  selectedSector === tab.key
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Duration */}
              <div className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-outline">schedule</span>
                <select
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value)}
                  className="bg-transparent text-on-surface font-label-md text-label-md outline-none cursor-pointer"
                >
                  <option value="">Duration: All</option>
                  <option value="4">4 Months Express</option>
                  <option value="6">6 Months Practical</option>
                  <option value="7">7 Months Intensive</option>
                  <option value="9">9 Months Advanced Diploma</option>
                </select>
              </div>

              {/* Eligibility */}
              <div className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-outline">school</span>
                <select
                  value={eligibilityFilter}
                  onChange={(e) => setEligibilityFilter(e.target.value)}
                  className="bg-transparent text-on-surface font-label-md text-label-md outline-none cursor-pointer"
                >
                  <option value="">Eligibility: Any Qual.</option>
                  <option value="10">10th Standard Pass</option>
                  <option value="12">12th Standard Pass</option>
                  <option value="iti">ITI / Polytechnic Diploma</option>
                  <option value="grad">Graduate / Any Degree</option>
                </select>
              </div>

              {/* Hub City */}
              <div className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-outline">location_on</span>
                <select
                  value={hubFilter}
                  onChange={(e) => setHubFilter(e.target.value)}
                  className="bg-transparent text-on-surface font-label-md text-label-md outline-none cursor-pointer"
                >
                  <option value="">Hub City: All 42 Hubs</option>
                  <option value="Jaipur">Jaipur Innovation Lab</option>
                  <option value="Indore">Indore Skill Park</option>
                  <option value="Lucknow">Lucknow Digital Academy</option>
                  <option value="Coimbatore">Coimbatore Green Tech</option>
                  <option value="Patna">Patna Vocational Hub</option>
                  <option value="Pune">Pune Industrial Campus</option>
                </select>
              </div>
            </div>

            {/* Cohort Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-surface-container px-3 py-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={summerOnly}
                onChange={(e) => setSummerOnly(e.target.checked)}
                className="accent-secondary h-4 w-4 rounded"
              />
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Seats Filling for Summer 2025
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Vocational Tracks Grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-body-md text-body-md text-on-surface-variant">Loading Vocational Tracks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTracks.map((track) => (
              <article
                key={track.id || track.slug}
                className="bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between group border border-surface-variant/40"
              >
                <div className="space-y-6">
                  {/* Header badges */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase font-bold">
                          {track.sectorLabel}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps font-semibold">
                          {track.duration} ({track.mode})
                        </span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors font-bold">
                        {track.title}
                      </h2>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center shrink-0 text-secondary shadow-sm">
                      <span className="material-symbols-outlined text-3xl">
                        {track.sector === 'ev' ? 'electric_car' : track.sector === 'solar' ? 'solar_power' : track.sector === 'it' ? 'terminal' : track.sector === 'health' ? 'medical_services' : 'precision_manufacturing'}
                      </span>
                    </div>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {track.description}
                  </p>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-3 bg-surface-container-low p-4 rounded-xl">
                    <div>
                      <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Avg Placement CTC
                      </span>
                      <span className="font-label-salary text-label-salary text-on-tertiary-container font-bold">
                        {track.placementCTC}
                      </span>
                    </div>
                    <div>
                      <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Paid Stipend
                      </span>
                      <span className="font-label-salary text-label-salary text-secondary font-bold">
                        {track.stipend}
                      </span>
                    </div>
                    <div>
                      <span className="block font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Min. Eligibility
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold">
                        {track.minEligibility}
                      </span>
                    </div>
                  </div>

                  {/* 4-Stage Curriculum Accordion */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleCurriculum(track.id || track.slug)}
                      className="w-full flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold hover:text-primary transition-colors"
                    >
                      <span>Curriculum Roadmap & Lab Hours ({track.curriculum?.length || 4} Modules)</span>
                      <span className="material-symbols-outlined text-body-md">
                        {expandedCurriculum[track.id || track.slug] ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {expandedCurriculum[track.id || track.slug] && (
                      <div className="space-y-2.5 animate-fade-in-up">
                        {track.curriculum?.map((mod) => (
                          <div key={mod.step} className="flex items-start gap-3 bg-surface p-3 rounded-xl border border-surface-container">
                            <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary font-label-caps text-label-caps flex items-center justify-center shrink-0 mt-0.5 font-bold">
                              {mod.step}
                            </span>
                            <div>
                              <p className="font-label-md text-label-md text-primary font-bold">{mod.title}</p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">{mod.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recruiters & Hubs */}
                  <div className="space-y-2 pt-2 border-t border-surface-container text-xs font-body-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-secondary">corporate_fare</span>
                      <span>Key Recruiters: <strong>{track.recruiters?.join(', ')}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-body-sm text-primary">location_on</span>
                      <span>Active Hubs: {track.activeHubs?.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="flex items-center justify-between pt-5 mt-6 border-t border-surface-container">
                  <span className="font-label-caps text-label-caps text-on-tertiary-container font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">verified</span> {track.certification}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTrade(track.title);
                      onShowToast(`Selected ${track.title} for Summer Cohort`, 'school');
                    }}
                    className="btn-shimmer px-5 py-2.5 bg-secondary text-on-secondary hover:bg-on-secondary-container active:scale-95 rounded-xl font-label-md text-label-md transition-all inline-flex items-center gap-2 font-bold shadow-md"
                  >
                    <span>Apply for Cohort</span>
                    <span className="material-symbols-outlined text-body-md">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
