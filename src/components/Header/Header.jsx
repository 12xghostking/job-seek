import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    return user.role === 'employer'
      ? `/employer?name=${encodeURIComponent(user.name)}`
      : `/seeker?name=${encodeURIComponent(user.name)}`;
  };

  return (
    <header className="glass-nav">
      <div className="container d-flex align-items-center justify-content-between py-3">
        {/* Brand Logo */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
            }}
          >
            <Briefcase size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
            Job<span className="gradient-text">Seek</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="d-flex align-items-center gap-3">
          <Link
            to="/"
            className="text-decoration-none fw-semibold"
            style={{ color: 'var(--text-muted)', fontSize: '0.92rem', padding: '6px 12px' }}
          >
            Home
          </Link>

          {isAuthenticated && user ? (
            <div className="d-flex align-items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="btn-modern-outline"
                style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              >
                <LayoutDashboard size={16} />
                Dashboard ({user.name})
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-modern-danger"
                style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/login"
                className="btn-modern-outline"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                <LogIn size={16} />
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-modern-primary"
                style={{ padding: '8px 18px', fontSize: '0.9rem' }}
              >
                <UserPlus size={16} />
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
