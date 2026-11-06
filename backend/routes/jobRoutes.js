import express from 'express';
import { getJobs, createJob, getMyJobs } from '../controllers/jobController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(getJobs).post(protect, employerOnly, createJob);
router.get('/my-jobs', protect, employerOnly, getMyJobs);
export default router;