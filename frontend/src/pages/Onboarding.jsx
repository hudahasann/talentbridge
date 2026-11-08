import { useState } from 'react';
import { updateProfile } from '../api/api';

function Onboarding({ user, setUser, setCurrentView }) {
  const [isEditing, setIsEditing] = useState(!user?.profileComplete);
  
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const updatedUser = await updateProfile({ headline, bio, skills });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsSubmitting(false);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  // --- VIEW MODE (READ ONLY) ---
  if (!isEditing) {
    return (
      <div className="onboarding-container">
        <div className="profile-view-card">
          <div className="profile-header-banner">
            <div className="profile-avatar-large">{user?.name?.charAt(0)}</div>
          </div>
          
          <div className="profile-view-content">
            <div className="profile-title-row">
              <div>
                <h1>{user?.name}</h1>
                <p className="profile-headline-text">{user?.headline}</p>
              </div>
              <button className="btn-outline-small" onClick={() => setIsEditing(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit Profile
              </button>
            </div>

            <div className="profile-section">
              <h3>About</h3>
              <p>{user?.bio}</p>
            </div>

            <div className="profile-section">
              <h3>Skills</h3>
              <div className="skills-tags">
                {user?.skills?.map((skill, index) => (
                  <span key={index} className="skill-tag read-only-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
               <button className="btn-primary-large" onClick={() => setCurrentView('jobs')}>
                 Back to Job Board
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EDIT MODE (THE FORM) ---
  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-bar-fill"></div>
          </div>
          <h1>{user?.profileComplete ? 'Edit Your Profile' : 'Complete Your Profile'}</h1>
          <p>{user?.profileComplete ? 'Update your details below.' : 'Let employers know who you are.'}</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="input-group">
            <label>Professional Headline</label>
            <input type="text" placeholder="e.g. Senior Frontend Engineer" value={headline} onChange={(e) => setHeadline(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Bio</label>
            <textarea rows="4" placeholder="Tell us about your experience..." value={bio} onChange={(e) => setBio(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Skills</label>
            <div className="skills-input-wrapper">
              <input type="text" placeholder="Type a skill and press Enter" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)} />
              <button type="button" onClick={handleAddSkill} className="add-skill-btn">Add</button>
            </div>
            <div className="skills-tags">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {user?.profileComplete && (
              <button type="button" className="btn-secondary-large" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary-large" style={{ flex: 2 }} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (user?.profileComplete ? 'Save Changes' : 'Save & Continue to Job Board')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;