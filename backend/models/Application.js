import mongoose from 'mongoose';
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeLink: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Interviewing', 'Hired', 'Rejected'], default: 'Applied' },
  feedback: { type: String },
}, { timestamps: true });
export default mongoose.model('Application', applicationSchema);
