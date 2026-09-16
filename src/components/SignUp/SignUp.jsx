import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header/Header';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { User, Building2, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const SignUp = () => {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await signup(role, name, email, password);
      toast.success('Registration successful! Please sign in to continue.');
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-gradient)' }}>
      <Header />

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div
          className="glass-card p-4 p-sm-5"
          style={{
            maxWidth: '480px',
            width: '100%',
            background: '#ffffff',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div className="text-center mb-4">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Join JobSeek Today</h2>
            <p className="text-muted small">Create an account to start discovering or posting roles</p>
          </div>

          {/* Role selector tabs */}
          <div className="tabs-header mb-4">
            <button
              type="button"
              className={`tab-btn flex-grow-1 justify-content-center ${role === 'user' ? 'active' : ''}`}
              onClick={() => setRole('user')}
            >
              <User size={16} />
              Job Seeker
            </button>
            <button
              type="button"
              className={`tab-btn flex-grow-1 justify-content-center ${role === 'employer' ? 'active' : ''}`}
              onClick={() => setRole('employer')}
            >
              <Building2 size={16} />
              Employer
            </button>
          </div>

          {errorMessage && (
            <div
              className="p-3 mb-4 rounded-3 text-danger small"
              style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group-modern">
              <label className="form-label-modern" htmlFor="name">
                {role === 'employer' ? 'Company / Employer Name' : 'Full Name'}
              </label>
              <div className="position-relative">
                <input
                  id="name"
                  type="text"
                  required
                  className="form-control-modern"
                  placeholder={role === 'employer' ? 'Acme Corp' : 'Alex Johnson'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <User
                  size={18}
                  className="position-absolute text-muted"
                  style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern" htmlFor="email">
                Email Address
              </label>
              <div className="position-relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="form-control-modern"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Mail
                  size={18}
                  className="position-absolute text-muted"
                  style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern" htmlFor="password">
                Password (min 5 characters)
              </label>
              <div className="position-relative">
                <input
                  id="password"
                  type="password"
                  required
                  className="form-control-modern"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock
                  size={18}
                  className="position-absolute text-muted"
                  style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div className="form-group-modern mb-4">
              <label className="form-label-modern" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="position-relative">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="form-control-modern"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock
                  size={18}
                  className="position-absolute text-muted"
                  style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-modern-primary w-100"
              style={{ padding: '12px', fontSize: '1rem' }}
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--primary)' }}>
              Sign in <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
