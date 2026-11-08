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

// MODERN MONGOOSE STYLE: No 'next' callback needed
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return; // Just return, no next() needed
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);