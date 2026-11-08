import { useState } from 'react';
import { updateProfile } from '../api/api';

function Onboarding({ user, setUser, setCurrentView }) {
  // Pre-fill the form if the user already has data
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
      setCurrentView('jobs'); 
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-bar-fill"></div>
          </div>
          <h1>{user?.profileComplete ? 'Update Your Profile' : 'Complete Your Profile'}</h1>
          <p>{user?.profileComplete ? 'Keep your details up to date.' : 'Let employers know who you are. This will take less than 2 minutes.'}</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          
          <div className="input-group">
            <label>Professional Headline</label>
            <input 
              type="text" 
              placeholder="e.g. Senior Frontend Engineer | React Specialist" 
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
            <span className="helper-text">A short tagline that describes you best.</span>
          </div>

          <div className="input-group">
            <label>Bio</label>
            <textarea 
              rows="4" 
              placeholder="Tell us about your experience, your goals, and what you're looking for..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Skills</label>
            <div className="skills-input-wrapper">
              <input 
                type="text" 
                placeholder="Type a skill and press Enter (e.g. React)" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
              />
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

          <button type="submit" className="btn-primary-large full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (user?.profileComplete ? 'Save Changes' : 'Save & Continue to Job Board')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;