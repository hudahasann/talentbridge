import { useState, useEffect } from 'react';
import { getMyJobs, createJob } from '../api/api';
import Applicants from './Applicants';
import JobDetails from './JobDetails';
import { formatDate } from '../utils/formatDate';

function Dashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', description: '', skills: '' });

  const fetchMyJobs = async () => {
    try { const data = await getMyJobs(); setJobs(data); } catch (err) { console.error(err); }
  };

  useEffect(() => { if (user && (user.role === 'employer' || user.role === 'recruiter')) fetchMyJobs(); }, [user]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newJob, skills: newJob.skills.split(',').map(s => s.trim()).filter(Boolean) };
      await createJob(payload);
      setShowModal(false);
      setNewJob({ title: '', company: '', location: '', salary: '', description: '', skills: '' });
      fetchMyJobs();
    } catch (err) { alert(err.message); }
  };

  if (!user || (user.role !== 'employer' && user.role !== 'recruiter')) return <div className="auth-container"><h2>Access Denied. Employers/Recruiters only.</h2></div>;

  if (viewJob) return <JobDetails job={viewJob} user={user} onBack={() => setViewJob(null)} onApply={() => {}} />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Employer Dashboard</h1>
          <p>Manage your job postings and candidate pipelines.</p>
        </div>
        <button className="btn-primary-large" onClick={() => setShowModal(true)}>+ Post New Job</button>
      </div>

      {jobs.length === 0 ? (
        /* PREMIUM EMPTY STATE */
        <div className="empty-state-container">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <h2>Welcome to TalentBridge, {user.name}</h2>
          <p>You haven't posted any jobs yet. Create your first job posting to start receiving applications from top talent.</p>
          <button className="btn-primary-large" onClick={() => setShowModal(true)}>Create Your First Job</button>
        </div>
      ) : (
        /* JOB GRID */
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job._id} className="job-card" onClick={() => setViewJob(job)} style={{ cursor: 'pointer' }}>
              <div className="job-card-header">
                <span className="job-company">{job.company}</span>
                <span className="job-location">{job.location} • {formatDate(job.createdAt)}</span>
              </div>
              <h3>{job.title}</h3>
              <p className="job-desc">{job.description}</p>
              <div className="job-footer">
                <span className="job-salary">{job.salary || 'Salary not disclosed'}</span>
                <button className="btn-primary-small" onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}>View Applicants</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Post a New Job</h2>
            <form onSubmit={handleCreateJob} className="auth-form">
              <div className="input-group"><label>Job Title</label><input type="text" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} required /></div>
              <div className="input-group"><label>Company Name</label><input type="text" value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group"><label>Location</label><input type="text" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} required /></div>
                <div className="input-group"><label>Salary</label><input type="text" value={newJob.salary} onChange={(e) => setNewJob({...newJob, salary: e.target.value})} /></div>
              </div>
              <div className="input-group"><label>Required Skills</label><input type="text" placeholder="e.g. React, Node.js, MongoDB" value={newJob.skills} onChange={(e) => setNewJob({...newJob, skills: e.target.value})} required /></div>
              <div className="input-group"><label>Description</label><textarea rows="3" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} required></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary-large" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary-large" style={{ flex: 1 }}>Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedJob && <Applicants job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}

export default Dashboard;