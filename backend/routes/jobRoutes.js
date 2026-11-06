import User from '../models/User.js';
import express from 'express';
import { getJobs, createJob, getMyJobs } from '../controllers/jobController.js';
import { protect, employerOnly } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(getJobs).post(protect, employerOnly, createJob);
router.get('/my-jobs', protect, async (req, res, next) => {
  // BULLETPROOF FIX: If session role is missing, check header ID and DB directly
  if ((!req.session || req.session.role !== 'employer') && req.headers['x-user-id']) {
    try {
      const user = await User.findById(req.headers['x-user-id']);
      if (user && user.role === 'employer') {
        req.session.role = 'employer';
        req.session.userId = user._id;
      } else {
        return res.status(403).json({ message: 'Access denied: Employers only' });
      }
    } catch (e) {
      return res.status(401).json({ message: 'Invalid User ID' });
    }
  }
  next();
}, getMyJobs);
export default router;

