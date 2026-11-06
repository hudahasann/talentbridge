import { useState, useEffect } from 'react';
import { getMyApplications } from '../api/api';

function MyApplications({ setCurrentView }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return { bg: '#fef3c7', color: '#b45309' };
      case 'Interviewing': return { bg: '#dbeafe', color: '#1e40af' };
      case 'Hired': return { bg: '#dcfce7', color: '#15803d' };
      case 'Rejected': return { bg: '#fee2e2', color: '#b91c1c' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      
      {/* Header with Back Button */}
      <div className="dashboard-header">
        <div>
          <h1>My Applications</h1>
          <p>Track the status of your job applications.</p>
        </div>
        <button className="btn-secondary-large" onClick={() => setCurrentView('jobs')}>
          ← Back to Job Board
        </button>
      </div>

      {applications.length === 0 ? (
        <div style={{ background: 'white', padding: '4rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You haven't applied to any jobs yet.</p>
          <button className="btn-primary-large" onClick={() => setCurrentView('jobs')} style={{ marginTop: '1.5rem' }}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map(app => {
            const statusStyle = getStatusColor(app.status);
            return (
              <div key={app._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Top Row: Job Info and Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                      {app.jobId?.title || 'Job Removed'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      {app.jobId?.company} • {app.jobId?.location}
                    </p>
                  </div>
                  
                  <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {app.status}
                  </span>
                </div>

                {/* Bottom Row: Feedback (Only if rejected) */}
                {app.feedback && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#b91c1c', margin: 0 }}>
                      <strong>Employer Feedback:</strong> {app.feedback}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;