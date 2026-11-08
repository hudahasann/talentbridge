import express from 'express';
import { register, login, logout, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // Need protect to know WHO is updating

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// The new onboarding route!
router.put('/profile', protect, updateProfile);

export default router;