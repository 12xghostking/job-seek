import React from 'react';
import Header from '../Header/Header';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import CallToAction from './CallToAction';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main className="flex-grow-1">
        <div className="container">
          <HeroSection />
        </div>

        <div style={{ background: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container py-5">
            <FeatureSection />
          </div>
        </div>

        <div className="container">
          <CallToAction />
        </div>
      </main>

      <footer className="py-4 border-top text-center text-muted small bg-white">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span>&copy; {new Date().getFullYear()} JobSeek Platform. All rights reserved.</span>
          <div className="d-flex gap-3">
            <span className="text-muted">Privacy Policy</span>
            <span className="text-muted">Terms of Service</span>
            <span className="text-muted">Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
