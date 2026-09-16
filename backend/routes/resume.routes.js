const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ResumeModel = require('../models/resume');

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Secure Multer storage with UUID timestamp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

// File filter for documents only
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are permitted.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// POST /api/upload-resume
router.post('/upload-resume', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file rejected' });
    }

    const userName = req.query.userName || (req.user && req.user.name);
    if (!userName) {
      // Remove uploaded file if no user specified
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'userName parameter is required' });
    }

    const { filename, originalname } = req.file;

    let resume = await ResumeModel.findOne({ uploadedBy: userName });
    if (resume) {
      // Clean up old file if it exists
      const oldFilePath = path.join(UPLOADS_DIR, resume.filePath);
      if (fs.existsSync(oldFilePath) && fs.lstatSync(oldFilePath).isFile()) {
        fs.unlinkSync(oldFilePath);
      }

      resume.filePath = filename;
      resume.originalFileName = originalname;
      await resume.save();
    } else {
      resume = new ResumeModel({
        filePath: filename,
        originalFileName: originalname,
        uploadedBy: userName,
      });
      await resume.save();
    }

    res.status(201).json({
      message: 'Resume uploaded successfully',
      fileName: originalname,
      uploadedBy: userName,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/fetch-resume/:userName
router.get('/fetch-resume/:userName', async (req, res, next) => {
  try {
    const { userName } = req.params;
    const resume = await ResumeModel.findOne({ uploadedBy: userName });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found for this candidate' });
    }

    // Path traversal prevention: resolve strictly within UPLOADS_DIR
    const safePath = path.resolve(UPLOADS_DIR, path.basename(resume.filePath));
    if (!safePath.startsWith(UPLOADS_DIR) || !fs.existsSync(safePath)) {
      return res.status(404).json({ error: 'Resume file is not available on server storage' });
    }

    const downloadName = resume.originalFileName || `${userName}_resume.pdf`;
    res.download(safePath, downloadName, (err) => {
      if (err && !res.headersSent) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
