export const protect = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  res.status(401).json({ message: 'Not authorized, please log in' });
};

export const employerOnly = (req, res, next) => {
  if (req.session && req.session.role === 'employer') return next();
  res.status(403).json({ message: 'Access denied: Employers only' });
};