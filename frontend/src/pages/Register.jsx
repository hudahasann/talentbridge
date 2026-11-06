import { useState } from 'react';
import { registerUser } from '../api/api';

function Register({ setUser, setCurrentView }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'applicant', skills: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) return setError('Password must be at least 8 characters long.');
    if (!/\d/.test(formData.password)) return setError('Password must contain at least one number.');

    try {
      const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) };
      await registerUser(payload);
      setSuccess(true);
      setTimeout(() => setCurrentView('login'), 2000);
    } catch (err) { setError(err.message); }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1rem' }}>Registration Successful!</h2>
          <p className="auth-subtitle">Redirecting you to the login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join TalentBridge to find your next role.</p>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input type={showPassword ? "text" : "password"} placeholder="Create a password (min 8 chars, 1 number)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          <div className="input-group">
            <label>I am a...</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="applicant">Job Seeker (Applicant)</option>
              <option value="employer">Employer (Hiring)</option>
            </select>
          </div>
          {formData.role === 'applicant' && (
            <div className="input-group">
              <label>Skills</label>
              <input type="text" placeholder="e.g. React, Node.js, MongoDB" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
            </div>
          )}
          <button type="submit" className="full-width">Sign Up</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <span onClick={() => setCurrentView('login')} className="auth-link">Sign In</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;