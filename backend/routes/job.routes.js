const express = require('express');
const router = express.Router();
const JobModel = require('../models/Job');
const ApplicantModel = require('../models/applicant');

// POST /api/create-job
router.post('/create-job', async (req, res, next) => {
  try {
    const {
      employerName,
      name,
      skillsRequired,
      location,
      yearsOfExperience,
      dateCreated,
      description,
    } = req.body;

    if (!employerName || !name || !skillsRequired || !location || !yearsOfExperience || !description) {
      return res.status(400).json({ error: 'Please provide all required job fields' });
    }

    const newJob = new JobModel({
      employerName: employerName.trim(),
      name: name.trim(),
      skillsRequired,
      location,
      yearsOfExperience,
      dateCreated: dateCreated || Date.now(),
      description,
    });

    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs (all jobs with optional location/search query)
router.get('/jobs', async (req, res, next) => {
  try {
    const { location, search } = req.query;
    const filter = {};

    if (location && ['Onsite', 'Remote'].includes(location)) {
      filter.location = location;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { skillsRequired: { $regex: search, $options: 'i' } },
        { employerName: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await JobModel.find(filter).sort({ createdAt: -1, dateCreated: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
});

// GET /api/emp/jobs & GET /api/employer/jobs (jobs for employer, optimized with applicant counts)
const getEmployerJobs = async (req, res, next) => {
  try {
    const employerName = req.query.employerName;
    if (!employerName) {
      return res.status(400).json({ error: 'employerName query parameter is required' });
    }

    const jobs = await JobModel.find({ employerName }).sort({ createdAt: -1 });

    // Aggregate applicant counts to eliminate N+1 frontend requests
    const counts = await ApplicantModel.aggregate([
      { $match: { employerName } },
      { $group: { _id: '$jobAppliedTo', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const jobsWithCounts = jobs.map((j) => {
      const jobObj = j.toObject();
      jobObj.totalApplicants = countMap[j.name] || 0;
      return jobObj;
    });

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    next(error);
  }
};

router.get('/emp/jobs', getEmployerJobs);
router.get('/employer/jobs', getEmployerJobs);

// GET /api/jobs/:jobName/applicants (count applicants for a job)
router.get('/jobs/:jobName/applicants', async (req, res, next) => {
  try {
    const jobName = req.params.jobName;
    const count = await ApplicantModel.countDocuments({ jobAppliedTo: jobName });
    res.status(200).json({ totalApplicants: count });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/jobs/remove (delete job and cascade remove applicants)
router.delete('/jobs/remove', async (req, res, next) => {
  try {
    const { jobName, employerName, jobId } = req.body;

    let removedJob;
    if (jobId) {
      removedJob = await JobModel.findByIdAndDelete(jobId);
    } else if (jobName && employerName) {
      removedJob = await JobModel.findOneAndDelete({ name: jobName, employerName });
    } else {
      return res.status(400).json({ error: 'Please provide jobName and employerName or jobId' });
    }

    if (removedJob) {
      await ApplicantModel.deleteMany({ jobAppliedTo: removedJob.name });
    }

    res.status(200).json({ message: 'Job removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
