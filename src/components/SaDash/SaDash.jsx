import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { jobsApi, applicantsApi, notifApi, resumeApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  FileText,
  Clock,
  MapPin,
  UploadCloud,
  Bell,
  Trash2,
  CheckCircle,
  Search,
  Filter,
  Check,
  UserCheck,
  AlertCircle,
  Download,
} from 'lucide-react';

const SeekerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const seekerName = queryParams.get('name') || user?.name || 'Alex Johnson';

  const [activeTab, setActiveTab] = useState('browse');

  // State: Jobs
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [applyForm, setApplyForm] = useState({
    skills: '',
    yearsOfExperience: '<1',
    description: '',
  });
  const [applying, setApplying] = useState(false);

  // State: Applications
  const [applications, setApplications] = useState([]);
  const [selectedAppToRemove, setSelectedAppToRemove] = useState(null);

  // State: Resume Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // State: Notifications
  const [notifications, setNotifications] = useState([]);

  // Fetch Jobs
  const loadJobs = async () => {
    try {
      const res = await jobsApi.getAll({
        location: locationFilter || undefined,
        search: searchQuery || undefined,
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  // Fetch Applications
  const loadApplications = async () => {
    try {
      const res = await applicantsApi.getSeekerApplications(seekerName);
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // Fetch Notifications
  const loadNotifications = async () => {
    try {
      const res = await notifApi.getUserNotifications(seekerName);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
    loadNotifications();
  }, [seekerName]);

  useEffect(() => {
    loadJobs();
  }, [locationFilter]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadJobs();
  };

  // Handle Apply to Job
  const handleOpenApplyModal = (job) => {
    setSelectedJobToApply(job);
    setApplyForm({
      skills: '',
      yearsOfExperience: '<1',
      description: '',
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJobToApply) return;
    setApplying(true);

    try {
      await applicantsApi.apply({
        userName: seekerName,
        jobAppliedTo: selectedJobToApply.name,
        employerName: selectedJobToApply.employerName,
        skills: applyForm.skills,
        yearsOfExperience: applyForm.yearsOfExperience,
        description: applyForm.description,
      });
      toast.success(`Successfully applied to ${selectedJobToApply.name}!`);
      setSelectedJobToApply(null);
      await loadApplications();
      setActiveTab('applications');
    } catch (err) {
      toast.error(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  // Handle Withdraw Application
  const handleWithdrawApplication = async () => {
    if (!selectedAppToRemove) return;

    try {
      await applicantsApi.removeApplication({
        userName: seekerName,
        jobTitle: selectedAppToRemove.jobAppliedTo,
        applicationId: selectedAppToRemove._id,
      });
      toast.info(`Application for ${selectedAppToRemove.jobAppliedTo} withdrawn.`);
      setSelectedAppToRemove(null);
      await loadApplications();
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw application');
    }
  };

  // Handle Resume Upload
  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setSelectedFile(dropped);
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      toast.error('Please select a resume file first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    setUploading(true);

    try {
      await resumeApi.uploadResume(formData, seekerName);
      toast.success('Resume uploaded and verified successfully!');
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  // Handle Dismiss Notification
  const handleDismissNotification = async (notif) => {
    try {
      await notifApi.removeNotification({
        description: notif.description,
        username: seekerName,
        notificationId: notif._id,
      });
      setNotifications(notifications.filter((n) => n._id !== notif._id));
      toast.info('Notification dismissed');
    } catch (err) {
      toast.error(err.message || 'Failed to dismiss notification');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-alt)' }}>
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* Seeker Title Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2">
              <UserCheck size={24} className="text-primary" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Welcome, {seekerName}</h1>
            </div>
            <p className="text-muted small mb-0 mt-1">Discover matching tech roles and manage your active applications</p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn-modern-outline"
              onClick={() => setActiveTab('resume')}
            >
              <FileText size={16} /> Resume Vault
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <Briefcase size={17} />
            Explore Open Roles <span className="tab-badge">{jobs.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <CheckCircle size={17} />
            My Applications <span className="tab-badge">{applications.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <UploadCloud size={17} />
            Resume Vault
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={17} />
            Notifications <span className="tab-badge">{notifications.length}</span>
          </button>
        </div>

        {/* TAB 1: BROWSE JOBS */}
        {activeTab === 'browse' && (
          <div>
            {/* Search and Filters Header */}
            <div className="modern-card p-3 mb-4">
              <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
                <div className="col-md-7">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control-modern"
                      placeholder="Search by job title, skill, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '38px' }}
                    />
                    <Search
                      size={18}
                      className="position-absolute text-muted"
                      style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <select
                    className="form-control-modern"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <button type="submit" className="btn-modern-primary w-100">
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Jobs List */}
            {jobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={42} className="empty-state-icon" />
                <h4>No matching jobs found</h4>
                <p>Try broadening your search query or removing the location filter.</p>
                <button
                  type="button"
                  className="btn-modern-outline"
                  onClick={() => {
                    setSearchQuery('');
                    setLocationFilter('');
                    loadJobs();
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {jobs.map((job) => (
                  <div className="col-lg-6" key={job._id || job.name}>
                    <div className="modern-card h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{job.name}</h3>
                            <span className="text-primary fw-semibold small">{job.employerName}</span>
                          </div>
                          <span
                            className={`badge-status ${job.location === 'Remote' ? 'badge-approved' : 'badge-in-review'}`}
                          >
                            <MapPin size={12} /> {job.location}
                          </span>
                        </div>

                        <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                          <span className="d-flex align-items-center gap-1">
                            <Clock size={14} /> Experience: {job.yearsOfExperience} yrs
                          </span>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '16px' }}>
                          {job.description}
                        </p>

                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {job.skillsRequired?.split(',').map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontWeight: 600,
                              }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-top mt-auto d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn-modern-primary"
                          onClick={() => handleOpenApplyModal(job)}
                        >
                          Apply to Role
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS */}
        {activeTab === 'applications' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Your Job Applications</h2>
            {applications.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={42} className="empty-state-icon" />
                <h4>No applications submitted yet</h4>
                <p>Explore open positions in the Explore tab and submit your resume to get started.</p>
                <button
                  type="button"
                  className="btn-modern-primary"
                  onClick={() => setActiveTab('browse')}
                >
                  Explore Openings
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {applications.map((app) => (
                  <div className="col-md-6" key={app._id}>
                    <div className="modern-card h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{app.jobAppliedTo}</h3>
                          <span
                            className={`badge-status ${
                              app.status === 'approved'
                                ? 'badge-approved'
                                : app.status === 'rejected'
                                ? 'badge-rejected'
                                : 'badge-in-review'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <p className="text-primary fw-semibold small mb-2">Company: {app.employerName}</p>
                        <p className="text-muted small mb-2">Experience submitted: {app.yearsOfExperience} years</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {app.description || 'No cover note submitted.'}
                        </p>
                      </div>

                      <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                        <span className="text-muted small">
                          Status: <strong className="text-capitalize">{app.status}</strong>
                        </span>
                        <button
                          type="button"
                          className="btn-modern-danger"
                          onClick={() => setSelectedAppToRemove(app)}
                        >
                          <Trash2 size={14} /> Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESUME VAULT */}
        {activeTab === 'resume' && (
          <div className="modern-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Resume & Documents Vault</h2>
            <p className="text-muted small mb-4">
              Upload your verified resume (PDF or Word, max 5MB). This document is attached when you submit job applications.
            </p>

            <div
              className="p-5 text-center mb-4"
              style={{
                border: '2px dashed var(--primary-border)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--primary-light)',
                cursor: 'pointer',
              }}
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <UploadCloud size={44} className="text-primary mb-3" />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                Drag and drop your resume file here
              </h4>
              <p className="text-muted small mb-3">Accepted formats: .PDF, .DOC, .DOCX (Max 5MB)</p>

              <label htmlFor="resumeFile" className="btn-modern-outline" style={{ cursor: 'pointer' }}>
                Browse from Computer
              </label>
              <input
                id="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            {selectedFile && (
              <div
                className="p-3 mb-4 rounded-3 d-flex justify-content-between align-items-center"
                style={{ background: '#ffffff', border: '1px solid var(--border)' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  <span className="fw-semibold small">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger text-decoration-none"
                  onClick={() => setSelectedFile(null)}
                >
                  Remove
                </button>
              </div>
            )}

            <div className="d-flex gap-2">
              <button
                type="button"
                disabled={!selectedFile || uploading}
                className="btn-modern-primary w-100"
                onClick={handleUploadResume}
              >
                {uploading ? 'Uploading to Vault...' : 'Save & Verify Resume'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Direct Messages & Alerts</h2>
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={42} className="empty-state-icon" />
                <h4>No notifications</h4>
                <p>When an employer sends you an update or interview request, it will appear here.</p>
              </div>
            ) : (
              <div className="row g-3">
                {notifications.map((notif) => (
                  <div className="col-12" key={notif._id}>
                    <div className="modern-card p-3 d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-bold small text-primary">{notif.receivedFrom}</span>
                          <span className="text-muted small">•</span>
                          <span className="text-muted small">
                            {new Date(notif.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-main)', lineHeight: 1.5 }}>
                          {notif.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-modern-danger"
                        style={{ padding: '6px 10px' }}
                        onClick={() => handleDismissNotification(notif)}
                        title="Dismiss notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Apply to Job */}
      {selectedJobToApply && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div className="glass-card p-4" style={{ maxWidth: '520px', width: '100%', background: '#ffffff' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Apply for {selectedJobToApply.name}
                </h3>
                <span className="text-muted small">Company: {selectedJobToApply.employerName}</span>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedJobToApply(null)}
              />
            </div>

            <form onSubmit={handleSubmitApplication}>
              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="applySkills">Your Key Relevant Skills</label>
                <input
                  id="applySkills"
                  type="text"
                  required
                  placeholder="e.g. React, Redux, Node.js, REST APIs"
                  className="form-control-modern"
                  value={applyForm.skills}
                  onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })}
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="applyExp">Years of Relevant Experience</label>
                <select
                  id="applyExp"
                  className="form-control-modern"
                  value={applyForm.yearsOfExperience}
                  onChange={(e) => setApplyForm({ ...applyForm, yearsOfExperience: e.target.value })}
                >
                  <option value="<1">&lt; 1 year</option>
                  <option value="1-3">1 - 3 years</option>
                  <option value="3-5">3 - 5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>

              <div className="form-group-modern mb-4">
                <label className="form-label-modern" htmlFor="applyDesc">Cover Note / Why You're a Great Fit</label>
                <textarea
                  id="applyDesc"
                  rows={4}
                  required
                  placeholder="Introduce yourself and highlight relevant projects..."
                  className="form-control-modern"
                  value={applyForm.description}
                  onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn-modern-outline"
                  onClick={() => setSelectedJobToApply(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="btn-modern-primary"
                >
                  {applying ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Withdraw Application */}
      {selectedAppToRemove && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div className="glass-card p-4" style={{ maxWidth: '420px', width: '100%', background: '#ffffff' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Withdraw Application?</h4>
            <p className="text-muted small mb-4">
              Are you sure you want to withdraw your submission for <strong>{selectedAppToRemove.jobAppliedTo}</strong>?
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn-modern-outline"
                onClick={() => setSelectedAppToRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modern-danger"
                onClick={handleWithdrawApplication}
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
