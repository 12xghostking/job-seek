const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./models/user');
const ApplicantModel = require('./models/applicant');
const ResumeModel = require('./models/Resume');
const NotificationModel = require('./models/notif');
const JobModel = require('./models/Job');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
require('dotenv').config();
const mongodbUrl = process.env.MONGODB_URL;
// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Uploads will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(' ').join('-');
    cb(null, fileName); // Set the file name to a unique value based on the current timestamp
  },
});


const upload = multer({ storage });
// MongoDB connection
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/api/signup', async (req, res) => {
  try {
    const { role, name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new user document
    const newUser = new UserModel({
      role,
      name,
      email,
      password,
    });

    // Save the user document to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/login', async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Successfully authenticated
    const { _id, name } = user;

    // Redirect based on the role
    if (role === 'user') {
      return res.json({ userId: _id, name });
    } else if (role === 'employer') {
      return res.json({ userId: _id, name });
    } else {
      return res.status(401).json({ error: 'Invalid role' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/create-job', async (req, res) => {
  try {
    const { employerName, name, skillsRequired, location, yearsOfExperience, dateCreated, description } = req.body;

    // Create a new job document
    const newJob = new JobModel({
      employerName,
      name,
      skillsRequired,
      location,
      yearsOfExperience,
      dateCreated,
      description,
    });

    // Save the job document to the database
    await newJob.save();

    res.status(201).json({ message: 'Job created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    const { originalname } = req.file;
  
    // You can access the user's name or ID from the request, e.g., req.query.userName
    const uploadedBy = req.query.userName;

    // Create a new resume document with the file path and user information
    const newResume = new ResumeModel({
      filePath: originalname,
      uploadedBy,
    });

    // Save the resume document to the database
    await newResume.save();

    res.status(201).json({ message: 'Resume uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/fetch-resume/:userName', async (req, res) => {
  try {
    const userName = req.params.userName;

    // Use await to query the database and find the resume document
    const resume = await ResumeModel.findOne({ uploadedBy: userName }).exec();

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Send the resume file as a response
    res.download(`uploads/${resume.filePath}`, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    // Fetch the list of jobs from the database
    const jobs = await JobModel.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch jobs for a particular employer
app.get('/api/emp/jobs', async (req, res) => {
  try {
    const employerName = req.query.employerName;
    const jobs = await JobModel.find({ employerName });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch the number of applicants for a particular job
app.get('/api/jobs/:jobName/applicants', async (req, res) => {
  try {
    const jobName = req.params.jobName;
    const count = await ApplicantModel.countDocuments({ jobAppliedTo: jobName });
    res.status(200).json({ totalApplicants: count });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Remove a job by its job name and employer name
app.delete('/api/jobs/remove', async (req, res) => {
  try {
    const { jobName, employerName } = req.body;

    // Find and remove the job that matches the job name and employer name
    await JobModel.findOneAndRemove({ name: jobName, employerName });

    // Remove applicants with the matching jobAppliedTo value
    await ApplicantModel.deleteMany({ jobAppliedTo: jobName });

    res.status(200).json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error('Error removing job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/applicants/apply', async (req, res) => {
  try {
    // Destructure the applicant details from the request body
    const { userName,skills, description, jobAppliedTo, employerName, yearsOfExperience } = req.body;

    // Extract the userName from the user's query parameter
    

    // Create a new applicant document
    const newApplicant = new ApplicantModel({
      userName,
      skills,
      description,
      jobAppliedTo,
      employerName,
      yearsOfExperience, // Include yearsOfExperience
      status: 'in review', // Set the initial status as 'In Review'
    });

    // Save the applicant document to the database
    await newApplicant.save();

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/applicants', async (req, res) => {
  try {
    const { userName } = req.query;

    // Fetch applications based on the userName
    const applications = await ApplicantModel.find({ userName });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/applicants/remove', async (req, res) => {
  try {
    
    const { userName, jobTitle } = req.body;

    // Find and remove the application that matches the userName and jobTitle
    await ApplicantModel.findOneAndRemove({ userName, jobAppliedTo: jobTitle });

    res.status(200).json({ message: 'Application removed successfully' });
  } catch (error) {
    console.error('Error removing application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/employers/jobseekers', async (req, res) => {
  try {
    const employerName = req.query.employerName;
    const jobSeekers = await ApplicantModel.find({ employerName }).select('userName');
    res.status(200).json(jobSeekers);
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notifications/send', async (req, res) => {
  try {
    const { description, receivedFrom, receivedBy } = req.body;

    // Create a new notification document
    const newNotification = new NotificationModel({
      description,
      receivedFrom,
      receivedBy,
    });

    // Save the notification to the database
    await newNotification.save();

    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/notifications/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const notifications = await NotificationModel.find({ receivedBy: username });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/api/notifications/remove', async (req, res) => {
  try {
    const { description, username } = req.body;
    console.log(description, username);
    // Find and remove notifications that match the description and username
    await NotificationModel.deleteMany({ description, receivedBy: username });

    res.status(200).json({ message: 'Notifications removed successfully' });
  } catch (error) {
    console.error('Error removing notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/employer/jobs', async (req, res) => {
  try {
    const employerName = req.query.employerName;
    
    // Use the employerName query parameter to filter jobs
    const jobs = await JobModel.find({ employerName });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch applicants for a particular employer
app.get('/api/employer/applicants', async (req, res) => {
  try {
    const employerName = req.query.employerName;
    // Find all applicants with the given employerName
    const applicants = await ApplicantModel.find({ employerName });
    res.status(200).json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/approve', async (req, res) => {
  try {
    const { userName, jobAppliedTo } = req.body;

    // Find the application by userName and jobAppliedTo
    const application = await ApplicantModel.findOne({ userName, jobAppliedTo });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update the status to 'approved'
    application.status = 'approved';
    await application.save();
   
    res.json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to reject an application
app.post('/reject', async (req, res) => {
  try {
    const { userName, jobAppliedTo } = req.body;
    
    // Find the application by userName and jobAppliedTo
    const application = await ApplicantModel.findOne({ userName, jobAppliedTo });
   
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }


    application.status = 'rejected';
    await application.save();
    
    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/remove-application', async (req, res) => {
  try {
    const { userName, jobAppliedTo } = req.body;

    // Find and remove the application based on userName and jobAppliedTo
    const removedApplication = await ApplicantModel.findOneAndRemove({
      userName,
      jobAppliedTo,
    }).exec();

    if (!removedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create and save a notification
    const notification = new NotificationModel({
      description: `You have been removed from consideration in the ${jobAppliedTo} role. Thank you.`,
      receivedFrom: removedApplication.employerName, // Assuming it's from the system
      receivedBy: userName, // The user who was removed
    });
    
    await notification.save();

    // Application removed successfully
    return res.status(200).json({ message: 'Application removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/approved-applications', async (req, res) => {
  try {
    const { employerName } = req.query;

    // Fetch approved applications by employer name
    const approvedApplications = await ApplicantModel.find({
      employerName,
      status: 'approved', // Assuming 'Approved' is the status for approved applications
    });

    res.status(200).json(approvedApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/approve-application', async (req, res) => {
  try {
    const { userName, jobAppliedTo } = req.body;

    // Find and remove the application based on userName and jobAppliedTo
    const removedApplication = await ApplicantModel.findOneAndRemove({
      userName,
      jobAppliedTo,
    }).exec();

    if (!removedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create and save an approval notification
    const approvalNotification = new NotificationModel({
      description: `You have been approved for the role of ${jobAppliedTo}. We will contact you shortly to discuss further steps.`,
      receivedFrom: removedApplication.employerName, // Assuming it's from the system
      receivedBy: userName, // The user who was approved
    });

    await approvalNotification.save();

    // Application approved and removed successfully, return removed application data
    return res.status(200).json({ message: 'Application approved and removed successfully', removedApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});