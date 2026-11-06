import { useState } from 'react';
import { registerUser } from '../api/api';

function Register({ setUser, setCurrentView }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'applicant' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) return setError('Password must be at least 8 characters long.');
    if (!/\d/.test(formData.password)) return setError('Password must contain at least one number.');

    try {
      await registerUser(formData);
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
            <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a secure password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <button 
                type="button" 
                className="eye-icon-btn" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>I am joining as a...</label>
            <div className="role-toggle-group">
              <div 
                className={`role-toggle-card ${formData.role === 'applicant' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'applicant'})}
              >
                <div className="role-icon">🎯</div>
                <div className="role-info">
                  <h4>Job Seeker</h4>
                  <p>I want to find a job</p>
                </div>
              </div>
              
              <div 
                className={`role-toggle-card ${formData.role === 'employer' ? 'active' : ''}`}
                onClick={() => setFormData({...formData, role: 'employer'})}
              >
                <div className="role-icon">🏢</div>
                <div className="role-info">
                  <h4>Employer</h4>
                  <p>I want to hire talent</p>
                </div>
              </div>
            </div>
          </div>
          
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