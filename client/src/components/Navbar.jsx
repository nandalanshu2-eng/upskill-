import React from 'react';

export default function Navbar({
  currentPage,
  setCurrentPage,
  currentLang,
  setLanguage,
  onOpenQuickApply
}) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tracks', label: 'Programs & Trades' },
    { id: 'mentors', label: 'Pratibha Mentors' },
    { id: 'interview', label: 'AI Mock Room' },
    { id: 'dashboard', label: 'Applications & Bookings' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'mr', label: 'मराठी' },
    { code: 'te', label: 'తెలుగు' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all duration-300" id="main-header">
      {/* Top Advisory Banner */}
      <div className="bg-primary text-on-primary py-1.5 px-6 lg:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-body-sm text-body-sm">
          <div className="flex items-center space-x-2 truncate">
            <span className="truncate font-medium">
              🚀 Admissions open for Summer 2025 Cohort across 42 Bharat Tech Hubs • 100% Placement Guarantee • NSDC Aligned
            </span>
            <span className="hidden md:inline text-outline-variant">|</span>
            <span className="hidden md:inline text-on-primary-fixed">Toll-Free Guidance: 1800-890-UDAAN</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0 pl-4 font-label-caps text-label-caps tracking-wider" id="lang-switcher">
            {languages.map((lang, idx) => (
              <React.Fragment key={lang.code}>
                {idx > 0 && <span className="text-outline-variant">|</span>}
                <button
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`transition-colors ${
                    currentLang === lang.code
                      ? 'text-on-primary font-bold active-lang underline underline-offset-2 decoration-secondary'
                      : 'text-surface-variant hover:text-on-primary'
                  }`}
                >
                  {lang.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 bg-surface/95 backdrop-blur-xl px-6 lg:px-12 border-b border-surface-container/60">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 shrink-0 group cursor-pointer"
            onClick={() => setCurrentPage('home')}
          >
            <img
              src="/assets/udaan_logo.svg"
              alt="Udaan Skills Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm tracking-tight text-primary leading-none group-hover:text-secondary transition-colors">
                Udaan Skills
              </span>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest leading-tight mt-0.5">
                Bharat Career Mission
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3.5 py-2 transition-all rounded-lg text-label-md font-label-md ${
                  currentPage === item.id
                    ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentPage('tracks')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg font-label-md text-label-md text-primary bg-surface-container-lowest shadow-[0_1px_3px_rgba(30,42,74,0.04)] hover:bg-surface-container-high hover:shadow-md transition-all active:scale-95 border border-surface-container"
            >
              Find My Course
            </button>
            <button
              onClick={onOpenQuickApply}
              className="btn-shimmer inline-flex items-center justify-center px-4 py-2 rounded-lg font-label-md text-label-md text-on-secondary bg-secondary hover:bg-on-secondary-container hover:shadow-lg transition-all active:scale-95 shadow-[0_1px_3px_rgba(30,42,74,0.08)]"
            >
              Join Cohort
            </button>

            {/* Candidate Profile Avatar */}
            <div
              className="flex items-center gap-2.5 pl-2 ml-1 cursor-pointer"
              onClick={() => setCurrentPage('dashboard')}
              title="View Applications & Bookings"
            >
              <img
                src="/assets/young_woman_headshot.png"
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-secondary/40 hover:ring-secondary transition-all"
              />
              <div className="hidden 2xl:flex flex-col text-left leading-tight">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Pooja Sharma</span>
                <span className="font-label-caps text-label-caps text-secondary">Jaipur Hub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
