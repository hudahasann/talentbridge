import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['applicant', 'employer', 'recruiter'], default: 'applicant' },
  skills: [{ type: String }],
  
  // --- NEW ONBOARDING FIELDS ---
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  profileComplete: { type: Boolean, default: false }
  
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Added return here to prevent double hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);