import express from 'express';
import { applyToJob, getJobApplications, updateApplicationStatus, getMyApplications } from '../controllers/applicationController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// 1. Specific routes MUST go first
router.get('/my-applications', protect, getMyApplications);

// 2. Dynamic routes go after
router.post('/:jobId', protect, upload.single('resume'), applyToJob);
router.get('/:jobId', protect, employerOnly, getJobApplications);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

export default router;