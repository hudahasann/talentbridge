import Job from '../models/Job.js';
export const getJobs = async (req, res) => { const jobs = await Job.find().populate('employerId', 'name company'); res.json(jobs); };
export const createJob = async (req, res) => {
  const { title, description, company, location, salary, skills } = req.body;
  const job = await Job.create({ title, description, company, location, salary, skills, employerId: req.session.userId });
  res.status(201).json(job);
};
export const getMyJobs = async (req, res) => { const jobs = await Job.find({ employerId: req.session.userId }); res.json(jobs); };
