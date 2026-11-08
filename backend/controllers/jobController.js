import Job from '../models/Job.js';

export const getJobs = async (req, res) => {
  try {
    // Fetch jobs without populate first to ensure it doesn't crash
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Get Jobs Error:", err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;
    
    const job = await Job.create({ 
      title, 
      description, 
      company, 
      location, 
      salary, 
      skills, 
      employerId: req.session.userId 
    });
    
    res.status(201).json(job);
  } catch (err) {
    console.error("Create Job Error:", err);
    res.status(500).json({ message: 'Failed to create job' });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.session.userId });
    res.json(jobs);
  } catch (err) {
    console.error("Get My Jobs Error:", err);
    res.status(500).json({ message: 'Failed to fetch your jobs' });
  }
};