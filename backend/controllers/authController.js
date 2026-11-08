import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const user = await User.create({ 
      name, email, password, role, 
      skills: skills || [], 
      profileComplete: false 
    });
    
    req.session.userId = user._id;
    req.session.role = user.role;
    
    res.status(201).json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      skills: user.skills || [], 
      headline: user.headline || '', 
      bio: user.bio || '', 
      profileComplete: false 
    });
  } catch (err) { 
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message }); 
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    
    // BULLETPROOF: Force strict boolean and default values for everything
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      skills: user.skills || [], 
      headline: user.headline || '', 
      bio: user.bio || '', 
      profileComplete: user.profileComplete === true // Strict boolean
    });
    
  } catch (err) { 
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login' }); 
  }
};

export const logout = (req, res) => { 
  req.session.destroy(); 
  res.json({ message: 'Logged out' }); 
};

export const updateProfile = async (req, res) => {
  try {
    const { headline, bio, skills } = req.body;
    
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.headline = headline || user.headline;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.profileComplete = true; 

    const updatedUser = await user.save();
    
    res.json({ 
      _id: updatedUser._id, 
      name: updatedUser.name, 
      email: updatedUser.email, 
      role: updatedUser.role, 
      skills: updatedUser.skills || [], 
      headline: updatedUser.headline || '', 
      bio: updatedUser.bio || '', 
      profileComplete: true 
    });
  } catch (err) { 
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: err.message }); 
  }
};