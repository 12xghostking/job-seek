import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Building2, MapPin, CheckCircle, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll transformations (continuous fluid transition into next section)
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);

  const cardRotateX = useTransform(scrollYProgress, [0, 0.5], shouldReduceMotion ? [0, 0] : [14, 0]);
  const cardScale = useTransform(scrollYProgress, [0, 0.6], shouldReduceMotion ? [1, 1] : [0.92, 1.02]);
  const cardY = useTransform(scrollYProgress, [0, 0.8], shouldReduceMotion ? [0, 0] : [0, 50]);
  const cardShadow = useTransform(
    scrollYProgress,
    [0, 0.5],
    [
      '0 25px 50px -12px rgba(79, 70, 229, 0.18)',
      '0 35px 60px -15px rgba(15, 23, 42, 0.15)',
    ]
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        paddingTop: '60px',
        paddingBottom: '80px',
        perspective: '1200px',
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '450px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Hero Headline Content */}
      <motion.div
        style={{
          opacity: heroTextOpacity,
          y: heroTextY,
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto 48px auto',
        }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
            border: '1px solid var(--primary-border)',
          }}
        >
          <Sparkles size={15} />
          <span>Next-Generation Career Platform</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.1,
            fontWeight: 800,
            marginBottom: '20px',
          }}
        >
          Find your next career chapter with <span className="gradient-text">JobSeek</span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '640px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6,
          }}
        >
          Connecting skilled builders, designers, and engineers directly with high-growth companies. Seamless applications, zero noise.
        </p>

        <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
          <Link to="/signup" className="btn-modern-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
            Get Started Free
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-modern-outline" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            Browse Roles
          </Link>
        </div>
      </motion.div>

      {/* Hero Showcase Card that Morphs into the Next Section */}
      <motion.div
        style={{
          rotateX: cardRotateX,
          scale: cardScale,
          y: cardY,
          boxShadow: cardShadow,
          transformStyle: 'preserve-3d',
          position: 'relative',
          zIndex: 2,
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card p-4 p-md-5"
      >
        {/* Mock Application Browser Frame */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-4 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></span>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></span>
            <span className="ms-2 text-muted small fw-semibold">jobseek.app/explore</span>
          </div>
          <div className="d-flex align-items-center gap-2 text-muted small">
            <TrendingUp size={14} className="text-success" />
            <span>Over 1,400+ roles added this month</span>
          </div>
        </div>

        {/* Mock Search Bar */}
        <div
          className="p-2 mb-4 d-flex align-items-center gap-2"
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Search size={18} className="text-muted ms-2" />
          <input
            type="text"
            readOnly
            value="Senior React Developer • Remote • Full Time"
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              fontWeight: 500,
              background: 'transparent',
            }}
          />
          <span
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            Search
          </span>
        </div>

        {/* Mock Job Showcase Grid */}
        <div className="row g-3">
          <div className="col-md-4">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '18px',
                height: '100%',
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge-status badge-approved">
                  <CheckCircle size={12} /> Remote
                </span>
                <span className="text-muted small fw-semibold">3-5 yrs</span>
              </div>
              <h5 style={{ fontSize: '1.05rem', margin: '8px 0 4px' }}>Senior Frontend Engineer</h5>
              <p className="text-muted small mb-3">Stripe • Product Infrastructure</p>
              <div className="d-flex gap-1 flex-wrap">
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  React
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  TypeScript
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Next.js
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--primary-border)',
                borderRadius: '12px',
                padding: '18px',
                height: '100%',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)',
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge-status badge-in-review">
                  <Building2 size={12} /> Onsite (SF)
                </span>
                <span className="text-muted small fw-semibold">5+ yrs</span>
              </div>
              <h5 style={{ fontSize: '1.05rem', margin: '8px 0 4px' }}>Staff Platform Architect</h5>
              <p className="text-muted small mb-3">Datadog • Core Services</p>
              <div className="d-flex gap-1 flex-wrap">
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Go
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Kubernetes
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Distributed Systems
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '18px',
                height: '100%',
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge-status badge-approved">
                  <MapPin size={12} /> Hybrid (NYC)
                </span>
                <span className="text-muted small fw-semibold">1-3 yrs</span>
              </div>
              <h5 style={{ fontSize: '1.05rem', margin: '8px 0 4px' }}>Product UX Designer</h5>
              <p className="text-muted small mb-3">Linear • Core Experience</p>
              <div className="d-flex gap-1 flex-wrap">
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Figma
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Design Systems
                </span>
                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#475569' }}>
                  Prototyping
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Bridge Hint connecting Hero seamlessly to Next Section */}
        <div className="text-center mt-4 pt-2">
          <span
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-subtle)',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to explore platform capabilities ↓
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
