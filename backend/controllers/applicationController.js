import Application from '../models/Application.js';

export const applyToJob = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a resume file' });
    
    const existing = await Application.findOne({ jobId: req.params.jobId, applicantId: req.session.userId });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    // Convert file buffer to Base64 string for MongoDB storage
    const base64File = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const resumeData = `data:${mimeType};base64,${base64File}`;

    const application = await Application.create({
      jobId: req.params.jobId,
      applicantId: req.session.userId,
      resume: resumeData, // Saving the Base64 string
      status: 'Applied'
    });

    res.status(201).json(application);
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId }).populate('applicantId', 'name email');
    res.json(applications); // Sending array directly
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.session.userId }).populate('jobId');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};