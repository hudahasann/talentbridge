import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['applicant', 'employer', 'recruiter'], default: 'applicant' },
  skills: [{ type: String }],
  
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  profileComplete: { type: Boolean, default: false },
  
  // NEW IMAGE FIELDS
  profileImage: { type: String, default: '' },
  coverImage: { type: String, default: '' }
  
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);