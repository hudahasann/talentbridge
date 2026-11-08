import { useState, useEffect } from 'react';
import { getJobApplications, updateApplicationStatus } from '../api/api';

function Applicants({ job, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchApplicants = async () => {
    try {
      const data = await getJobApplications(job._id);
      setApplicants(Array.isArray(data) ? data : data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [job]);

  const calculateMatch = (applicantSkills) => {
    if (!job.skills || job.skills.length === 0) return 100;
    if (!applicantSkills || applicantSkills.length === 0) return 0;
    const matched = job.skills.filter(skill => 
      applicantSkills.some(aSkill => aSkill.toLowerCase() === skill.toLowerCase())
    );
    return Math.round((matched.length / job.skills.length) * 100);
  };

  const handleMove = async (id, newStatus, feedback = null) => {
    try {
      await updateApplicationStatus(id, newStatus, feedback);
      setApplicants(applicants.map(app => 
        app._id === id ? { ...app, status: newStatus, feedback: feedback || app.feedback } : app
      ));
      setFeedbackModal(null);
      setFeedbackText('');
    } catch (err) {
      alert(err.message);
    }
  };

  // --- THE FIX FOR OPENING THE PDF ---
  const handleOpenResume = (base64Data) => {
    if (!base64Data) return;
    
    // Convert Base64 to Blob
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'});

    // Create a Blob URL and open it
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  };

  const columns = ['Applied', 'Interviewing', 'Hired', 'Rejected'];

  return (
    <div className="modal-overlay">
      <div style={{ background: '#f8fafc', borderRadius: '16px', width: '100%', maxWidth: '1200px', height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <div style={{ padding: '2rem 2.5rem', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Applicants for: {job.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', margin: 0 }}>Manage candidates in the hiring pipeline.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {loading ? (
            <p>Loading applicants...</p>
          ) : applicants.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No applicants yet.</p>
          ) : (
            <div className="kanban-board" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {columns.map(col => (
                <div key={col} className="kanban-column">
                  <div className="kanban-column-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ margin: 0 }}>{col}</h3>
                      <span className="count-badge">{applicants.filter(a => a.status === col).length}</span>
                    </div>
                  </div>
                  
                  <div className="kanban-cards">
                    {applicants.filter(a => a.status === col).map(app => {
                      const matchScore = calculateMatch(app.applicantId?.skills);
                      return (
                        <div key={app._id} className="kanban-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                              {app.applicantId?.name?.charAt(0) || '?'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{app.applicantId?.name || 'Unknown'}</h4>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.applicantId?.email}</p>
                            </div>
                            <span className={`match-badge ${matchScore >= 70 ? 'high' : 'medium'}`} style={{ fontSize: '0.7rem' }}>
                              {matchScore}%
                            </span>
                          </div>

                          {app.feedback && (
                            <p style={{ fontSize: '0.7rem', color: '#b91c1c', background: '#fef2f2', padding: '0.4rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                              Reason: {app.feedback}
                            </p>
                          )}
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            
                            {/* FIXED BUTTON */}
                            <button 
                              onClick={() => handleOpenResume(app.resume)}
                              style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                              Resume
                            </button>
                            
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {col !== 'Applied' && (
                                <button className="icon-btn" onClick={() => handleMove(app._id, 'Applied')} title="Move Back">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                </button>
                              )}
                              {col !== 'Hired' && col !== 'Rejected' && (
                                <button className="icon-btn" onClick={() => handleMove(app._id, col === 'Applied' ? 'Interviewing' : 'Hired')} title="Move Forward">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                              )}
                              {col !== 'Rejected' && (
                                <button 
                                  className="reject-btn" 
                                  onClick={() => setFeedbackModal(app._id)} 
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {feedbackModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="auth-card" style={{ maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Rejection Feedback</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>This feedback will be shown to the candidate to improve transparency.</p>
            <textarea 
              rows="3" 
              value={feedbackText} 
              onChange={(e) => setFeedbackText(e.target.value)} 
              placeholder="e.g., Lacks required React experience" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'Inter', marginBottom: '1rem', resize: 'vertical' }} 
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary-large" onClick={() => setFeedbackModal(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary-large" onClick={() => handleMove(feedbackModal, 'Rejected', feedbackText)} style={{ flex: 1, background: '#b91c1c' }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;