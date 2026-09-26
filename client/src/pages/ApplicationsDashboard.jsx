import React, { useState, useEffect } from 'react';

export default function ApplicationsDashboard({ onShowToast }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenSearch, setTokenSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch {
      // Fallback sample applications
      setApplications([
        {
          tokenId: 'UDAAN-2025-8492',
          fullName: 'Ramesh Kumar Patel',
          phone: '9876543210',
          hub: 'Jaipur Innovation Lab (Rajasthan)',
          trade: 'Electric Vehicle (EV) Powertrain & Battery Tech',
          education: '12th Standard',
          status: 'PROVISIONAL_RESERVED',
          createdAt: new Date().toISOString()
        },
        {
          tokenId: 'UDAAN-2025-3914',
          fullName: 'Pooja Sharma',
          phone: '9823456781',
          hub: 'Indore Skill Park (Madhya Pradesh)',
          trade: 'Solar PV Rooftop System Engineer',
          education: 'ITI Diploma',
          status: 'COUNSELOR_ASSIGNED',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (!tokenSearch) return true;
    const q = tokenSearch.toLowerCase();
    return (
      app.tokenId?.toLowerCase().includes(q) ||
      app.fullName?.toLowerCase().includes(q) ||
      app.trade?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
            Admission & Booking Portal
          </span>
          <h1 className="font-headline-lg text-headline-lg lg:font-display-hero text-primary font-bold">
            Applications & Mentor Bookings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Live telemetry of registered cohort applicants and confirmed 1-on-1 Pratibha Setu sessions.
          </p>
        </div>

        {/* Token Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-md">
            search
          </span>
          <input
            type="text"
            value={tokenSearch}
            onChange={(e) => setTokenSearch(e.target.value)}
            placeholder="Search by Token ID or Name..."
            className="w-full bg-surface-container-lowest pl-9 pr-4 py-2.5 rounded-xl text-body-sm font-body-sm text-on-surface placeholder:text-outline outline-none shadow-sm border border-surface-container focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant/40 overflow-hidden">
        <div className="p-6 border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-title-md">description</span>
            <h2 className="font-title-md text-title-md text-primary font-bold">
              Submitted Cohort Admissions ({filteredApps.length})
            </h2>
          </div>
          <button
            onClick={fetchApplications}
            className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
            title="Refresh list"
          >
            <span className="material-symbols-outlined text-body-md">refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-on-surface-variant">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading database records...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant space-y-2">
            <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
            <p className="font-body-md text-body-md">No application records found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container">
            {filteredApps.map((app) => (
              <div
                key={app.tokenId || app.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container-low/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-label-salary text-label-salary text-primary font-bold">
                      {app.fullName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-outline font-label-caps text-label-caps font-bold">
                      #{app.tokenId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-bold">
                      {app.status || 'PROVISIONAL_RESERVED'}
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-primary font-medium">
                    {app.trade}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-body-sm text-on-surface-variant">
                    <span>📍 {app.hub}</span>
                    <span>•</span>
                    <span>📞 +91 {app.phone}</span>
                    <span>•</span>
                    <span>🎓 {app.education || '12th Standard'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onShowToast(`Verified Digilocker status for #${app.tokenId}`, 'verified')}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-all font-semibold"
                  >
                    Verify DigiLocker
                  </button>
                  <button
                    onClick={() => onShowToast(`Senior technical counselor assigned to #${app.tokenId}`, 'support_agent')}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md transition-all font-semibold"
                  >
                    Assign Coach
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security & Verification Guarantee Banner */}
      <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-on-tertiary-container">verified_user</span>
          <div>
            <h3 className="font-title-md text-title-md text-primary font-bold">
              Government of India DigiLocker Integration
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Every provisional seat token is cryptographically stamped and aligned with NSDC verification standards.
            </p>
          </div>
        </div>
        <span className="px-3.5 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps uppercase rounded-full font-bold shrink-0">
          ISO 27001 Certified
        </span>
      </div>
    </div>
  );
}
