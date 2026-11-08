import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, skills } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    // Create user with safe defaults
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role, 
      skills: skills || [], // Fallback to empty array if undefined
      profileComplete: false // Explicitly set for new users
    });
    
    req.session.userId = user._id;
    req.session.role = user.role;
    
    res.status(201).json({ 
      _id: user._id, name: user.name, email: user.email, role: user.role, 
      skills: user.skills, headline: user.headline, bio: user.bio, profileComplete: user.profileComplete 
    });
  } catch (err) { 
    console.error("Register Error:", err); // Added log to see the exact error
    res.status(500).json({ message: err.message }); 
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id;
      req.session.role = user.role;
      
      res.json({ 
        _id: user._id, name: user.name, email: user.email, role: user.role, 
        skills: user.skills, headline: user.headline, bio: user.bio, profileComplete: user.profileComplete 
      });
    } else { res.status(401).json({ message: 'Invalid email or password' }); }
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const logout = (req, res) => { req.session.destroy(); res.json({ message: 'Logged out' }); };

// --- NEW ONBOARDING CONTROLLER ---
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
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, 
      skills: updatedUser.skills, headline: updatedUser.headline, bio: updatedUser.bio, profileComplete: updatedUser.profileComplete 
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: err.message });
  }
};