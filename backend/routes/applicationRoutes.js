import express from 'express';
import multer from 'multer';
import { applyToJob, getJobApplications, updateApplicationStatus, getMyApplications } from '../controllers/applicationController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Custom middleware to catch Multer errors explicitly
const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g. file too large)
      console.error("Multer Error:", err);
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred (e.g. wrong file type)
      console.error("Unknown Upload Error:", err);
      return res.status(400).json({ message: err.message });
    }
    // Everything went fine.
    next();
  });
};

// 1. Specific routes MUST go first
router.get('/my-applications', protect, getMyApplications);

// 2. Dynamic routes go after (using the new handleUpload middleware)
router.post('/:jobId', protect, handleUpload, applyToJob);
router.get('/:jobId', protect, employerOnly, getJobApplications);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

export default router;