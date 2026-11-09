import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 
  resume: { type: String }, 
  
  status: { type: String, enum: ['Applied', 'Interviewing', 'Hired', 'Rejected'], default: 'Applied' },
  feedback: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);