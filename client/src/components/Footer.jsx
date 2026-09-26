import React from 'react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="w-full bg-surface-container-low mt-16 border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/udaan_logo.svg"
                alt="Udaan Skills Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm text-headline-sm tracking-tight text-primary">
                Udaan Skills
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md leading-relaxed">
              Empowering 1,000,000+ aspirational youth across Bharat's Tier-2 & Tier-3 towns with industry-grade vocational skills, real workshop apprenticeships, and direct placement connections.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full font-label-caps text-label-caps text-primary">
                <span className="material-symbols-outlined text-body-sm text-on-tertiary-container">verified</span>
                NSDC Partner ID #NSDC-IND-2024
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full font-label-caps text-label-caps text-on-surface-variant">
                <span className="material-symbols-outlined text-body-sm">workspace_premium</span>
                ISO 9001:2015
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h3 className="font-title-md text-title-md text-primary">Popular Career Trades</h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  EV Technician & Battery Tech
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Solar Energy Installer
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Full Stack Web & Low Code
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Healthcare & Dialysis Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Precision CNC Operator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h3 className="font-title-md text-title-md text-primary">Pratibha Mentors & Labs</h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <button onClick={() => setCurrentPage('mentors')} className="hover:text-primary transition-colors text-left">
                  180+ Verified Practitioners
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('interview')} className="hover:text-primary transition-colors text-left">
                  AI Voice Mock Room
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Jaipur Innovation Lab
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Indore Skill Park
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('tracks')} className="hover:text-primary transition-colors text-left">
                  Lucknow Digital Academy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h3 className="font-title-md text-title-md text-primary">Learner Support</h3>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-primary transition-colors text-left">
                  Skill Loan at 0% EMI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-primary transition-colors text-left">
                  DigiLocker Certificate Verify
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('mentors')} className="hover:text-primary transition-colors text-left">
                  Free 1-on-1 Mentorship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-primary transition-colors text-left">
                  Women in Trades Scholarship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-primary transition-colors text-left">
                  Track Application Status
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 border-t border-surface-container flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center md:text-left">
            <span>© 2025 Udaan Skills Foundation. Built with pride for Bharat. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs">₹ Prices inclusive of GST where applicable.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 font-medium text-primary">
              <span className="material-symbols-outlined text-base text-on-tertiary-container">military_tech</span>
              Skill India Partner
            </span>
            <span className="flex items-center gap-1 font-medium text-primary">
              <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
              NSDC Recognized
            </span>
            <span className="flex items-center gap-1 font-medium text-primary">
              <span className="material-symbols-outlined text-base text-on-primary-container">devices</span>
              Digital India Supporter
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
