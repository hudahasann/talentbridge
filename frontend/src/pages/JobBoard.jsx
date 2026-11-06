import { useState, useEffect } from 'react';
import { getJobs } from '../api/api';
import JobDetails from './JobDetails';
import { formatDate } from '../utils/formatDate';

function JobBoard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (!user) {
    return <div className="auth-container"><h2>Please log in to view jobs.</h2></div>;
  }

  if (selectedJob) {
    return (
      <JobDetails 
        job={selectedJob} 
        user={user} 
        onBack={() => setSelectedJob(null)} 
      />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Find your next role</h1>
        <p>Browse open positions from top companies.</p>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="job-card" 
              onClick={() => setSelectedJob(job)} 
              style={{ cursor: 'pointer' }}
            >
              <div className="job-card-header">
                <span className="job-company">{job.company}</span>
                <span className="job-location">{job.location} • {formatDate(job.createdAt)}</span>
              </div>
              <h3>{job.title}</h3>
              <p className="job-desc">{job.description}</p>
              <div className="job-footer">
                <span className="job-salary">{job.salary || 'Salary not disclosed'}</span>
                <button className="btn-primary-small">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobBoard;