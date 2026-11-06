import { useState } from 'react';
import { registerUser } from '../api/api';

function Register({ setUser, setCurrentView }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'applicant', skills: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean) };
      const data = await registerUser(payload);
      setUser(data);
      setCurrentView(data.role === 'employer' ? 'dashboard' : 'jobs');
    } catch (err) { setError(err.message); }
  };

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
            <input type="password" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
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
          <button type="submit" className="full-width">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Register;