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
      }, 2500);
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
        {/* LEFT COLUMN */}
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

        {/* RIGHT COLUMN */}
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

            {/* ONLY APPLICANTS CAN SEE THE APPLY BUTTON */}
            {user && user.role === 'applicant' ? (
              <button className="btn-primary-large full-width" onClick={() => setShowApplyModal(true)}>
                Apply for this Job
              </button>
            ) : (
              !user && (
                <button className="btn-primary-large full-width" onClick={() => alert("Please log in as an applicant to apply.")}>
                  Log in to Apply
                </button>
              )
            )}
            
            <p className="apply-note">Takes less than 2 minutes to apply.</p>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="auth-card" style={{ maxWidth: '500px', width: '100%', animation: 'slideUpFade 0.3s ease-out' }}>
            {success ? (
              <div className="success-card" style={{ padding: '2rem 0' }}>
                <div className="success-icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2>Application Sent</h2>
                <p className="auth-subtitle">Your application for {job.title} has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <h2 style={{ marginBottom: '0.5rem' }}>Apply for {job.title}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>at {job.company}</p>
                
                <form onSubmit={handleApply} className="auth-form">
                  {error && <div className="error-alert">{error}</div>}
                  <div className="input-group">
                    <label>Upload Resume (PDF or Word)</label>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFile(e.target.files[0])} 
                      required 
                      style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" className="btn-secondary-large" onClick={() => setShowApplyModal(false)} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn-primary-large" style={{ flex: 1 }}>Submit Application</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;