import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Search,
  MousePointerClick,
  BellRing,
  ShieldCheck,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Curated Tech Openings',
    description: 'Directly verified listings from top tech startups, scale-ups, and established engineering teams.',
    color: '#4f46e5',
  },
  {
    icon: Search,
    title: 'Precision Skill Filtering',
    description: 'Filter instantly by location type, technology stack, and years of experience without clutter.',
    color: '#06b6d4',
  },
  {
    icon: MousePointerClick,
    title: 'One-Click Applications',
    description: 'Upload your verified resume once and apply to matching roles in seconds with customizable notes.',
    color: '#10b981',
  },
  {
    icon: BellRing,
    title: 'Real-Time Status Alerts',
    description: 'Get notified immediately as your application advances from review to interview and offer stage.',
    color: '#f59e0b',
  },
  {
    icon: Users,
    title: 'Direct Employer Messaging',
    description: 'Communicate directly with hiring managers and founders without intermediary headhunter delays.',
    color: '#8b5cf6',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Resume Vault',
    description: 'Your contact info and documents are stored securely with strict role-based access control.',
    color: '#ec4899',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const FeatureSection = () => {
  return (
    <section className="py-5" style={{ position: 'relative', zIndex: 3 }}>
      <div className="text-center mb-5">
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--primary)',
          }}
        >
          Engineered for Career Growth
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', marginBottom: '14px' }}>
          Everything you need to hire or be hired
        </h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem' }}>
          Streamlined workflows tailored specifically for developers, designers, and hiring teams.
        </p>
      </div>

      <motion.div
        className="row g-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div className="col-md-6 col-lg-4" key={idx} variants={itemVariants}>
              <div className="modern-card h-100 p-4">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `${feature.color}15`,
                    color: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FeatureSection;
