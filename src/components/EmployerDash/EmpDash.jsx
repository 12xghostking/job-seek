import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { jobsApi, applicantsApi, notifApi, resumeApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle2,
  Bell,
  MapPin,
  Clock,
  Download,
  Trash2,
  Check,
  X,
  Send,
  Building2,
  Filter,
  AlertTriangle,
} from 'lucide-react';

const EmpDash = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const employerName = queryParams.get('name') || user?.name || 'Acme Corp';

  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(false);

  // State: Jobs
  const [jobs, setJobs] = useState([]);
  const [selectedJobToClose, setSelectedJobToClose] = useState(null);

  // State: Post Job Form
  const [jobForm, setJobForm] = useState({
    name: '',
    skillsRequired: '',
    location: 'Onsite',
    yearsOfExperience: '<1',
    description: '',
  });

  // State: Applications
  const [applicants, setApplicants] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [selectedApplicantDetails, setSelectedApplicantDetails] = useState(null);

  // State: Approved Applications
  const [approvedApplications, setApprovedApplications] = useState([]);

  // State: Notifications
  const [candidatesList, setCandidatesList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');

  // Fetch Jobs
  const loadJobs = async () => {
    try {
      const res = await jobsApi.getEmployerJobs(employerName);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  // Fetch Applicants
  const loadApplicants = async () => {
    try {
      const res = await applicantsApi.getEmployerApplicants(employerName);
      setApplicants(res.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    }
  };

  // Fetch Approved Applications
  const loadApproved = async () => {
    try {
      const res = await applicantsApi.getApprovedApplications(employerName);
      setApprovedApplications(res.data);
    } catch (err) {
      console.error('Error fetching approved:', err);
    }
  };

  // Fetch Unique Candidates for Messaging
  const loadCandidates = async () => {
    try {
      const res = await applicantsApi.getEmployerJobSeekers(employerName);
      setCandidatesList(res.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplicants();
    loadApproved();
    loadCandidates();
  }, [employerName]);

  // Handle Post Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobsApi.createJob({
        ...jobForm,
        employerName,
      });
      toast.success(`Job "${jobForm.name}" created successfully!`);
      setJobForm({
        name: '',
        skillsRequired: '',
        location: 'Onsite',
        yearsOfExperience: '<1',
        description: '',
      });
      await loadJobs();
      setActiveTab('jobs');
    } catch (err) {
      toast.error(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  // Handle Close / Delete Job
  const handleCloseJob = async () => {
    if (!selectedJobToClose) return;

    try {
      await jobsApi.removeJob({
        jobName: selectedJobToClose.name,
        employerName,
        jobId: selectedJobToClose._id,
      });
      toast.success(`Listing for "${selectedJobToClose.name}" closed.`);
      setSelectedJobToClose(null);
      await loadJobs();
      await loadApplicants();
    } catch (err) {
      toast.error(err.message || 'Failed to close job');
    }
  };

  // Handle Approve Application
  const handleApproveApplicant = async (applicant) => {
    try {
      await applicantsApi.approveApplication({
        userName: applicant.userName,
        jobAppliedTo: applicant.jobAppliedTo,
      });
      toast.success(`${applicant.userName} has been approved!`);
      await loadApplicants();
      await loadApproved();
      if (selectedApplicantDetails?._id === applicant._id) {
        setSelectedApplicantDetails(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to approve application');
    }
  };

  // Handle Reject Application
  const handleRejectApplicant = async (applicant) => {
    try {
      await applicantsApi.removeWithNotification({
        userName: applicant.userName,
        jobAppliedTo: applicant.jobAppliedTo,
      });
      toast.info(`Application from ${applicant.userName} removed.`);
      await loadApplicants();
      if (selectedApplicantDetails?._id === applicant._id) {
        setSelectedApplicantDetails(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reject application');
    }
  };

  // Handle Download Resume
  const handleDownloadResume = async (userName) => {
    try {
      toast.info(`Downloading resume for ${userName}...`);
      await resumeApi.downloadResume(userName);
    } catch (err) {
      toast.error(err.message || 'Resume not found for this candidate');
    }
  };

  // Handle Send Notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!selectedCandidate || !notificationMsg.trim()) {
      toast.error('Please select a candidate and write a message');
      return;
    }

    try {
      await notifApi.sendNotification({
        description: notificationMsg.trim(),
        receivedFrom: employerName,
        receivedBy: selectedCandidate,
      });
      toast.success(`Notification sent to ${selectedCandidate}!`);
      setNotificationMsg('');
    } catch (err) {
      toast.error(err.message || 'Failed to send notification');
    }
  };

  // Filtered applicants
  const filteredApplicants = applicants.filter((app) => {
    if (!selectedJobFilter) return true;
    return app.jobAppliedTo.toLowerCase().includes(selectedJobFilter.toLowerCase());
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface-alt)' }}>
      <Header />

      <div className="container py-4 flex-grow-1">
        {/* Employer Title Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2">
              <Building2 size={24} className="text-primary" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{employerName}</h1>
            </div>
            <p className="text-muted small mb-0 mt-1">Employer Management Dashboard & Hiring Pipeline</p>
          </div>
          <button
            type="button"
            className="btn-modern-primary"
            onClick={() => setActiveTab('post-job')}
          >
            <PlusCircle size={18} />
            Post New Job
          </button>
        </div>

        {/* Dashboard Tabs Header */}
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={17} />
            Active Listings <span className="tab-badge">{jobs.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'post-job' ? 'active' : ''}`}
            onClick={() => setActiveTab('post-job')}
          >
            <PlusCircle size={17} />
            Post a Job
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicants')}
          >
            <Users size={17} />
            Applications <span className="tab-badge">{applicants.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            <CheckCircle2 size={17} />
            Approved Hires <span className="tab-badge">{approvedApplications.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={17} />
            Messaging
          </button>
        </div>

        {/* TAB 1: ACTIVE JOBS LIST */}
        {activeTab === 'jobs' && (
          <div>
            {jobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={42} className="empty-state-icon" />
                <h4>No active job listings</h4>
                <p>Post your first open position to start receiving candidate applications.</p>
                <button
                  type="button"
                  className="btn-modern-primary"
                  onClick={() => setActiveTab('post-job')}
                >
                  <PlusCircle size={16} /> Post a Job
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {jobs.map((job) => (
                  <div className="col-lg-6" key={job._id || job.name}>
                    <div className="modern-card h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{job.name}</h3>
                          <span
                            className={`badge-status ${job.location === 'Remote' ? 'badge-approved' : 'badge-in-review'}`}
                          >
                            <MapPin size={12} /> {job.location}
                          </span>
                        </div>

                        <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                          <span className="d-flex align-items-center gap-1">
                            <Clock size={14} /> Exp: {job.yearsOfExperience} yrs
                          </span>
                          <span>•</span>
                          <span>
                            Posted {new Date(job.dateCreated || job.createdAt || Date.now()).toLocaleDateString()}
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
                                background: 'var(--primary-light)',
                                color: 'var(--primary)',
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600,
                              }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                        <span className="fw-semibold small text-primary d-flex align-items-center gap-1">
                          <Users size={16} /> {job.totalApplicants || 0} Applicants
                        </span>
                        <button
                          type="button"
                          className="btn-modern-danger"
                          onClick={() => setSelectedJobToClose(job)}
                        >
                          <Trash2 size={14} /> Close Listing
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POST A JOB FORM */}
        {activeTab === 'post-job' && (
          <div className="modern-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Create Open Role Listing</h2>
            <form onSubmit={handleCreateJob}>
              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="jobTitle">Job Title</label>
                <input
                  id="jobTitle"
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  className="form-control-modern"
                  value={jobForm.name}
                  onChange={(e) => setJobForm({ ...jobForm, name: e.target.value })}
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="skills">Required Skills (Comma separated)</label>
                <input
                  id="skills"
                  type="text"
                  required
                  placeholder="e.g. React, TypeScript, Node.js, GraphQL"
                  className="form-control-modern"
                  value={jobForm.skillsRequired}
                  onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label-modern" htmlFor="jobLocation">Location Type</label>
                  <select
                    id="jobLocation"
                    className="form-control-modern"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="col-sm-6">
                  <label className="form-label-modern" htmlFor="jobExp">Experience Required</label>
                  <select
                    id="jobExp"
                    className="form-control-modern"
                    value={jobForm.yearsOfExperience}
                    onChange={(e) => setJobForm({ ...jobForm, yearsOfExperience: e.target.value })}
                  >
                    <option value="<1">&lt; 1 year</option>
                    <option value="1-3">1 - 3 years</option>
                    <option value="3-5">3 - 5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </div>

              <div className="form-group-modern mb-4">
                <label className="form-label-modern" htmlFor="jobDesc">Job Description & Responsibilities</label>
                <textarea
                  id="jobDesc"
                  rows={5}
                  required
                  placeholder="Outline key deliverables, team structure, and qualifications..."
                  className="form-control-modern"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn-modern-outline"
                  onClick={() => setActiveTab('jobs')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-modern-primary"
                >
                  {loading ? 'Publishing...' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CANDIDATE APPLICATIONS */}
        {activeTab === 'applicants' && (
          <div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Review Candidate Applications</h2>
              <div className="d-flex align-items-center gap-2" style={{ maxWidth: '320px', width: '100%' }}>
                <Filter size={18} className="text-muted" />
                <input
                  type="text"
                  className="form-control-modern"
                  placeholder="Filter by job role..."
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                />
              </div>
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="empty-state">
                <Users size={42} className="empty-state-icon" />
                <h4>No applications found</h4>
                <p>
                  {selectedJobFilter
                    ? `No applications matching "${selectedJobFilter}".`
                    : 'Candidate submissions will appear here once candidates apply.'}
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {filteredApplicants.map((app) => (
                  <div className="col-lg-6" key={app._id || `${app.userName}-${app.jobAppliedTo}`}>
                    <div className="modern-card h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{app.userName}</h4>
                            <span className="text-primary fw-semibold small">Applied for: {app.jobAppliedTo}</span>
                          </div>
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

                        <p className="text-muted small mb-2">
                          <strong>Experience:</strong> {app.yearsOfExperience} years
                        </p>

                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '14px', lineHeight: 1.5 }}>
                          {app.description || 'No cover note provided.'}
                        </p>

                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {app.skills?.split(',').map((skill, i) => (
                            <span
                              key={i}
                              style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top mt-3">
                        <button
                          type="button"
                          className="btn-modern-outline"
                          style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                          onClick={() => handleDownloadResume(app.userName)}
                        >
                          <Download size={14} /> Resume
                        </button>

                        <div className="d-flex gap-2">
                          {app.status === 'in review' && (
                            <>
                              <button
                                type="button"
                                className="btn-modern-success"
                                onClick={() => handleApproveApplicant(app)}
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button
                                type="button"
                                className="btn-modern-danger"
                                onClick={() => handleRejectApplicant(app)}
                              >
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: APPROVED HIRES */}
        {activeTab === 'approved' && (
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Approved Candidates for Hiring</h2>
            {approvedApplications.length === 0 ? (
              <div className="empty-state">
                <CheckCircle2 size={42} className="empty-state-icon" />
                <h4>No approved candidates yet</h4>
                <p>When you approve candidates in the Applications tab, they will be listed here.</p>
              </div>
            ) : (
              <div className="row g-3">
                {approvedApplications.map((app) => (
                  <div className="col-md-6 col-lg-4" key={app._id}>
                    <div className="modern-card h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{app.userName}</h4>
                        <span className="badge-status badge-approved">Approved</span>
                      </div>
                      <p className="text-muted small mb-3">Role: {app.jobAppliedTo}</p>
                      <button
                        type="button"
                        className="btn-modern-outline w-100"
                        onClick={() => handleDownloadResume(app.userName)}
                      >
                        <Download size={14} /> Download Verified Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CANDIDATE MESSAGING */}
        {activeTab === 'notifications' && (
          <div className="modern-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Send Direct Candidate Notification</h2>
            <p className="text-muted small mb-4">Send status updates, interview invites, or inquiries directly to applicants.</p>

            <form onSubmit={handleSendNotification}>
              <div className="form-group-modern">
                <label className="form-label-modern" htmlFor="candidateSelect">Select Candidate</label>
                <select
                  id="candidateSelect"
                  required
                  className="form-control-modern"
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                >
                  <option value="">-- Choose Candidate --</option>
                  {candidatesList.map((c) => (
                    <option key={c.userName} value={c.userName}>
                      {c.userName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-modern mb-4">
                <label className="form-label-modern" htmlFor="candidateMsg">Message</label>
                <textarea
                  id="candidateMsg"
                  rows={4}
                  required
                  placeholder="Hi! We loved your profile and would like to schedule a 30-minute introductory conversation..."
                  className="form-control-modern"
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-modern-primary w-100">
                <Send size={16} /> Send Notification
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Confirmation Modal: Close Job Listing */}
      {selectedJobToClose && (
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
          <div className="glass-card p-4" style={{ maxWidth: '440px', width: '100%', background: '#ffffff' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'var(--danger-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--danger)',
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>Close Job Listing?</h4>
                <span className="text-muted small">This action will remove the listing and active applicants.</span>
              </div>
            </div>

            <p className="small text-muted mb-4">
              Are you sure you want to close <strong>{selectedJobToClose.name}</strong>? It will no longer accept submissions.
            </p>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn-modern-outline"
                onClick={() => setSelectedJobToClose(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modern-danger"
                onClick={handleCloseJob}
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpDash;
