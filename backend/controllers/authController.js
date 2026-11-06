import User from '../models/User.js';
import bcrypt from 'bcryptjs';
export const register = async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role, skills });
    req.session.userId = user._id;
    req.session.role = user.role;
    res.status(201).json({ _id: user._id, name, email, role, skills: user.skills });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id;
      req.session.role = user.role;
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, skills: user.skills });
    } else { res.status(401).json({ message: 'Invalid email or password' }); }
  } catch (err) { res.status(500).json({ message: err.message }); }
};
export const logout = (req, res) => { req.session.destroy(); res.json({ message: 'Logged out' }); };
