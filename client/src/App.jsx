import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import QuickApplyModal from './components/QuickApplyModal';

import HomePage from './pages/HomePage';
import VocationalTracksPage from './pages/VocationalTracksPage';
import MentorsPage from './pages/MentorsPage';
import InterviewSimulatorPage from './pages/InterviewSimulatorPage';
import ApplicationsDashboard from './pages/ApplicationsDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentLang, setLanguage] = useState('en');
  const [quickApplyModal, setQuickApplyModal] = useState({ isOpen: false, trade: '' });
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'info' });

  const showToast = (message, icon = 'info', subtitle = '') => {
    setToast({ visible: true, message, icon, subtitle });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const messages = {
      en: 'Language switched to English',
      hi: 'भाषा को हिन्दी में सेट किया गया है',
      ta: 'மொழி தமிழுக்கு மாற்றப்பட்டது',
      mr: 'भाषा मराठी मध्ये बदलली आहे',
      te: 'భాష తెలుగులోకి మార్చబడింది'
    };
    showToast(messages[lang] || 'Language updated', 'translate');
  };

  const openQuickApply = (trade = '') => {
    setQuickApplyModal({ isOpen: true, trade });
  };

  const closeQuickApply = () => {
    setQuickApplyModal({ isOpen: false, trade: '' });
  };

  const handleApplicationSuccess = (appData) => {
    showToast(`Provisional seat reserved! Token #${appData.tokenId}`, 'verified');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* Sticky Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
        setLanguage={handleLanguageChange}
        onOpenQuickApply={() => openQuickApply()}
      />

      {/* Main Content Stage */}
      <main className="flex-1 w-full pt-28">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTrade={(trade) => openQuickApply(trade)}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'tracks' && (
          <VocationalTracksPage
            onSelectTrade={(trade) => openQuickApply(trade)}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'mentors' && (
          <MentorsPage onShowToast={showToast} />
        )}

        {currentPage === 'interview' && (
          <InterviewSimulatorPage onShowToast={showToast} />
        )}

        {currentPage === 'dashboard' && (
          <ApplicationsDashboard onShowToast={showToast} />
        )}
      </main>

      {/* Global Modals & Toast */}
      <QuickApplyModal
        isOpen={quickApplyModal.isOpen}
        initialTrade={quickApplyModal.trade}
        onClose={closeQuickApply}
        onApplicationSuccess={handleApplicationSuccess}
      />

      <Toast
        toast={toast}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      {/* Footer */}
      <Footer
        setCurrentPage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
