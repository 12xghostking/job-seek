const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/applicant');
const NotificationModel = require('../models/notif');

// ==========================================
// 1. APPLICATIONS SUBMISSION & RETRIEVAL
// ==========================================

// Handlers
const handleApply = async (req, res, next) => {
  try {
    const { userName, skills, description, jobAppliedTo, employerName, yearsOfExperience } = req.body;

    if (!userName || !jobAppliedTo || !employerName) {
      return res.status(400).json({ error: 'Missing required applicant fields' });
    }

    // Check duplicate
    const existing = await ApplicantModel.findOne({ userName, jobAppliedTo });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const newApplicant = new ApplicantModel({
      userName: userName.trim(),
      skills: skills || '',
      description: description || '',
      jobAppliedTo: jobAppliedTo.trim(),
      employerName: employerName.trim(),
      yearsOfExperience: yearsOfExperience || '<1',
      status: 'in review',
    });

    await newApplicant.save();

    // Notification for employer
    const notif = new NotificationModel({
      description: `${userName} applied for ${jobAppliedTo}`,
      receivedFrom: userName,
      receivedBy: employerName,
    });
    await notif.save().catch(() => {});

    res.status(201).json({ message: 'Application submitted successfully', applicant: newApplicant });
  } catch (error) {
    next(error);
  }
};

const handleGetSeekerApplications = async (req, res, next) => {
  try {
    const { userName } = req.query;
    if (!userName) {
      return res.status(400).json({ error: 'userName query parameter is required' });
    }

    const applications = await ApplicantModel.find({ userName }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

const handleRemoveApplication = async (req, res, next) => {
  try {
    const { userName, jobTitle, applicationId } = req.body;

    if (applicationId) {
      await ApplicantModel.findByIdAndDelete(applicationId);
    } else if (userName && jobTitle) {
      await ApplicantModel.findOneAndDelete({ userName, jobAppliedTo: jobTitle });
    } else {
      return res.status(400).json({ error: 'Provide userName and jobTitle or applicationId' });
    }

    res.status(200).json({ message: 'Application removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Route bindings for Application (Seeker)
router.post('/applicants/apply', handleApply);
router.post('/apply', handleApply);

router.get('/applicants', handleGetSeekerApplications);
router.get('/', handleGetSeekerApplications);

router.delete('/applicants/remove', handleRemoveApplication);
router.delete('/remove', handleRemoveApplication);

// ==========================================
// 2. EMPLOYER APPLICANTS & JOB SEEKERS
// ==========================================

const handleGetEmployerApplicants = async (req, res, next) => {
  try {
    const { employerName } = req.query;
    if (!employerName) {
      return res.status(400).json({ error: 'employerName query parameter is required' });
    }

    const applicants = await ApplicantModel.find({ employerName }).sort({ createdAt: -1 });
    res.status(200).json(applicants);
  } catch (error) {
    next(error);
  }
};

const handleGetJobSeekers = async (req, res, next) => {
  try {
    const { employerName } = req.query;
    if (!employerName) {
      return res.status(400).json({ error: 'employerName query parameter is required' });
    }

    const applicants = await ApplicantModel.find({ employerName }).select('userName');
    const uniqueUserNames = [...new Set(applicants.map(a => a.userName))].map(userName => ({ userName }));
    res.status(200).json(uniqueUserNames);
  } catch (error) {
    next(error);
  }
};

// Route bindings for Employer Applicant queries
router.get('/employer/applicants', handleGetEmployerApplicants);
router.get('/employers/applicants', handleGetEmployerApplicants);
router.get('/applicants/employer', handleGetEmployerApplicants);
router.get('/employer', handleGetEmployerApplicants);

router.get('/employers/jobseekers', handleGetJobSeekers);
router.get('/employer/jobseekers', handleGetJobSeekers);
router.get('/applicants/jobseekers', handleGetJobSeekers);
router.get('/jobseekers', handleGetJobSeekers);

// ==========================================
// 3. APPROVED APPLICATIONS
// ==========================================

const handleGetApprovedApplications = async (req, res, next) => {
  try {
    const { employerName } = req.query;
    const filter = { status: 'approved' };
    if (employerName) filter.employerName = employerName;

    const approved = await ApplicantModel.find(filter).sort({ updatedAt: -1 });
    res.status(200).json(approved);
  } catch (error) {
    next(error);
  }
};

router.get('/approved-applications', handleGetApprovedApplications);
router.get('/approved', handleGetApprovedApplications);

// ==========================================
// 4. APPROVALS & REJECTIONS
// ==========================================

const handleApprove = async (req, res, next) => {
  try {
    const { userName, jobAppliedTo } = req.body;
    const application = await ApplicantModel.findOne({ userName, jobAppliedTo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'approved';
    await application.save();

    const notif = new NotificationModel({
      description: `Your application for ${jobAppliedTo} has been approved!`,
      receivedFrom: application.employerName,
      receivedBy: userName,
    });
    await notif.save().catch(() => {});

    res.status(200).json({ message: 'Application approved successfully', application });
  } catch (error) {
    next(error);
  }
};

const handleReject = async (req, res, next) => {
  try {
    const { userName, jobAppliedTo } = req.body;
    const application = await ApplicantModel.findOne({ userName, jobAppliedTo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = 'rejected';
    await application.save();

    res.status(200).json({ message: 'Application rejected successfully', application });
  } catch (error) {
    next(error);
  }
};

const handleApproveAndRemove = async (req, res, next) => {
  try {
    const { userName, jobAppliedTo } = req.body;
    const removedApplication = await ApplicantModel.findOneAndDelete({ userName, jobAppliedTo });
    if (!removedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const approvalNotification = new NotificationModel({
      description: `Congratulations! You have been officially approved for the role of ${jobAppliedTo}. We will contact you shortly with onboarding steps.`,
      receivedFrom: removedApplication.employerName,
      receivedBy: userName,
    });
    await approvalNotification.save();

    res.status(200).json({ message: 'Application approved and removed successfully', removedApplication });
  } catch (error) {
    next(error);
  }
};

const handleRemoveWithNotification = async (req, res, next) => {
  try {
    const { userName, jobAppliedTo } = req.body;
    const removed = await ApplicantModel.findOneAndDelete({ userName, jobAppliedTo });
    if (!removed) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const notification = new NotificationModel({
      description: `You have been removed from consideration for the ${jobAppliedTo} role. Thank you for your time.`,
      receivedFrom: removed.employerName,
      receivedBy: userName,
    });
    await notification.save();

    res.status(200).json({ message: 'Application removed successfully' });
  } catch (error) {
    next(error);
  }
};

router.post('/approve', handleApprove);
router.post('/reject', handleReject);
router.post('/approve-application', handleApproveAndRemove);
router.post('/approve-and-remove', handleApproveAndRemove);
router.post('/remove-application', handleRemoveWithNotification);
router.post('/remove-with-notification', handleRemoveWithNotification);

module.exports = router;
