import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyToJob = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a resume file' });
    const existing = await Application.findOne({ jobId: req.params.jobId, applicantId: req.session.userId });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });
    
    const host = req.get('host');
    const protocol = req.protocol;
    const resumeLink = protocol + '://' + host + '/uploads/' + req.file.filename;

    const application = await Application.create({ 
      jobId: req.params.jobId, 
      applicantId: req.session.userId, 
      resumeLink 
    });
    
    res.status(201).json(application);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (job.employerId.toString() !== req.session.userId) return res.status(403).json({ message: 'Not authorized' });
    const applications = await Application.find({ jobId: req.params.jobId }).populate('applicantId', 'name email skills');
    res.json({ job, applications });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    application.status = status;
    if (feedback) application.feedback = feedback;
    await application.save();
    res.json(application);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.session.userId }).populate('jobId', 'title company location salary skills');
    res.json(applications);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
