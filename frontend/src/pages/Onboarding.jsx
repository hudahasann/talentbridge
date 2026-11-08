import { useState } from 'react';
import { updateProfile } from '../api/api';

function Onboarding({ user, setUser, setCurrentView }) {
  const [isEditing, setIsEditing] = useState(!user?.profileComplete);
  
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  
  // Image states
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [coverImage, setCoverImage] = useState(user?.coverImage || '');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Check file size (e.g., max 2MB) to prevent DB bloat
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const updatedUser = await updateProfile({ 
        headline, bio, skills, profileImage, coverImage 
      });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsSubmitting(false);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  // --- VIEW MODE ---
  if (!isEditing) {
    return (
      <div className="onboarding-container">
        <div className="profile-view-card">
          
          <div className="profile-header-banner" style={user?.coverImage ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <div className="profile-avatar-large">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="avatar-image" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
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

  // --- EDIT MODE ---
  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>{user?.profileComplete ? 'Edit Your Profile' : 'Complete Your Profile'}</h1>
          <p>{user?.profileComplete ? 'Update your details below.' : 'Let employers know who you are.'}</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          
          {/* IMAGE UPLOAD SECTION */}
          <div className="form-row">
            <div className="input-group">
              <label>Profile Photo</label>
              <div className="image-upload-wrapper">
                {profileImage && (
                  <div className="image-preview-container">
                    <img src={profileImage} alt="Preview" className="image-preview-circle" />
                    <button type="button" className="remove-image-btn" onClick={() => setProfileImage('')}>×</button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProfileImage)} className="file-input-hidden" id="profile-upload" />
                <label htmlFor="profile-upload" className="btn-outline-small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Upload Photo
                </label>
              </div>
            </div>
            
            <div className="input-group">
              <label>Cover Photo</label>
              <div className="image-upload-wrapper">
                {coverImage && (
                  <div className="image-preview-container">
                    <img src={coverImage} alt="Preview" className="image-preview-banner" />
                    <button type="button" className="remove-image-btn" onClick={() => setCoverImage('')}>×</button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCoverImage)} className="file-input-hidden" id="cover-upload" />
                <label htmlFor="cover-upload" className="btn-outline-small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Upload Cover
                </label>
              </div>
            </div>
          </div>

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