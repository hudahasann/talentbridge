import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // VERCEL FIX: Check for manual header injection first
  if (req.headers['x-user-id'] && (!req.session || !req.session.userId)) {
    try {
      const user = await User.findById(req.headers['x-user-id']);
      if (user) {
        if (!req.session) req.session = {};
        req.session.userId = user._id;
        req.session.role = user.role;
      }
    } catch (err) {
      console.error('Header Auth Error:', err);
    }
  }

  if (req.session && req.session.userId) {
    return next();
  }
  
  res.status(401).json({ message: 'Not authorized, please log in' });
};

export const employerOnly = (req, res, next) => {
  // VERCEL FIX: Because the session is set in `protect`, this will now work
  if (req.session && req.session.role === 'employer') return next();
  res.status(403).json({ message: 'Access denied: Employers only' });
};
