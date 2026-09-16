import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="my-5 py-4">
      <div
        className="p-5 text-center text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #06b6d4 100%)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '18px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Sparkles size={14} /> Join over 10,000+ engineers & founders
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
            Ready to accelerate your hiring or job search?
          </h2>

          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', marginBottom: '32px' }}>
            Create an account in less than 2 minutes. Whether you are looking for your dream role or scaling your team, JobSeek has you covered.
          </p>

          <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
            <Link
              to="/signup"
              className="btn btn-light fw-bold"
              style={{
                color: 'var(--primary)',
                padding: '12px 28px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Get Started Now
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-light fw-semibold"
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
