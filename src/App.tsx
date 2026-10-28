import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClientsMarquee } from './components/ClientsMarquee';
import { CaseStudies } from './components/CaseStudies';
import { WorkProcess } from './components/WorkProcess';
import { SkillsExperience } from './components/SkillsExperience';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ThreeCanvas } from './components/ThreeCanvas';
import { PasscodeModal } from './components/admin/PasscodeModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { usePortfolioStore } from './lib/store';

export function App() {
  const { state } = usePortfolioStore();
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const handleOpenAdminTrigger = () => {
    // If already authenticated in current session, go straight to dashboard
    const isAuthed = sessionStorage.getItem('santhosh_admin_authed');
    if (isAuthed === 'true') {
      setIsAdminDashboardOpen(true);
    } else {
      setIsPasscodeModalOpen(true);
    }
  };

  const handlePasscodeSuccess = () => {
    sessionStorage.setItem('santhosh_admin_authed', 'true');
    setIsPasscodeModalOpen(false);
    setIsAdminDashboardOpen(true);
  };

  // Keyboard shortcut (Ctrl + Shift + A) and Hash route (#admin) listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdminTrigger();
      }
    };

    const handleHashOrRoute = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.pathname === '/admin'
      ) {
        handleOpenAdminTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashOrRoute);
    handleHashOrRoute();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashOrRoute);
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-[#09090B] text-[#FAFAFA] selection:bg-[#D80027] selection:text-white font-sans overflow-x-hidden">
      {/* 3D WebGL Canvas Background */}
      <ThreeCanvas />

      {/* Navigation */}
      <Navbar onOpenAdmin={handleOpenAdminTrigger} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <ClientsMarquee />
        <CaseStudies />
        <WorkProcess />
        <SkillsExperience />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdminTrigger} />

      {/* Admin Passcode Modal */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={handlePasscodeSuccess}
      />

      {/* Zero-Code Admin Studio */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  );
}

export default App;

