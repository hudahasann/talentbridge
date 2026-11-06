import { useState } from 'react';
import { applyToJob } from '../api/api';
import { formatDate } from '../utils/formatDate';

function JobDetails({ job, user, onBack }) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!job) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!file) {
      return setError('Please select a resume file');
    }

    try {
      await applyToJob(job._id, file);
      setSuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        setSuccess(false);
        setFile(null);
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="job-details-page">
      <div className="job-details-header">
        <button onClick={onBack} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Jobs
        </button>
      </div>

      <div className="job-details-container">
        <div className="job-main-content">
          <div className="job-title-section">
            <h1>{job.title}</h1>
            <div className="job-meta-top">
              <span className="company-name">{job.company}</span>
              <span className="meta-divider">•</span>
              <span className="location">{job.location}</span>
            </div>
          </div>

          <div className="job-section">
            <h2>About the Role</h2>
            <p className="job-description-text">{job.description}</p>
          </div>

          <div className="job-section">
            <h2>Requirements</h2>
            <ul className="job-requirements-list">
              <li>Proven experience in a similar role.</li>
              <li>Strong problem-solving skills.</li>
              <li>Excellent communication and teamwork.</li>
            </ul>
          </div>
        </div>

        <div className="job-sidebar">
          <div className="apply-card">
            <div className="salary-display">
              <span className="salary-label">Salary</span>
              <span className="salary-amount">{job.salary || 'Not Disclosed'}</span>
            </div>
            
            <div className="job-details-summary">
              <div className="summary-item">
                <span className="summary-label">Job Type</span>
                <span className="summary-value">Full-time</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Posted</span>
                <span className="summary-value">{formatDate(job.createdAt)}</span>
              </div>
            </div>

            {user && user.role === 'applicant' && (
              <button className="btn-primary-large full-width" onClick={() => setShowApplyModal(true)}>
                Apply for this Job
              </button>
            )}
            
            <p className="apply-note">Takes less than 2 minutes to apply.</p>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-overlay">
          <div className="auth-card" style={{ maxWidth: '500px', width: '100%' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Apply for {job.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>at {job.company}</p>
            
            {success ? (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', fontWeight: '600' }}>
                Application submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleApply} className="auth-form">
                {error && <div className="error-alert">{error}</div>}
                <div className="input-group">
                  <label>Upload Resume (PDF or Word)</label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])} 
                    required 
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn-secondary-large" onClick={() => setShowApplyModal(false)} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary-large" style={{ flex: 1 }}>Submit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;