import { useState, useRef } from 'react';
import { applyToJob } from '../api/api';
import { formatDate } from '../utils/formatDate';

function JobDetails({ job, user, onBack }) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!job) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
                <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Apply for this Job</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>{job.title} at {job.company}</p>
                
                <form onSubmit={handleApply} className="auth-form">
                  {error && <div className="error-alert">{error}</div>}
                  
                  {/* PREMIUM FILE UPLOAD ZONE */}
                  <div className="input-group">
                    <label>Resume / CV</label>
                    <div 
                      className="file-dropzone" 
                      onClick={() => fileInputRef.current.click()}
                    >
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange} 
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      {file ? (
                        <div className="file-selected">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          <span className="file-name">{file.name}</span>
                        </div>
                      ) : (
                        <div className="file-placeholder">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                          <span className="file-text">Click to upload or drag and drop</span>
                          <span className="file-subtext">PDF, DOC, or DOCX (max. 5MB)</span>
                        </div>
                      )}
                    </div>
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