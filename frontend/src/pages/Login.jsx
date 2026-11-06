import { useState } from 'react';
import { loginUser } from '../api/api';

function Login({ setUser, setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setCurrentView(data.role === 'employer' ? 'dashboard' : 'jobs');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue to TalentBridge.</p>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>
          <button type="submit" className="full-width">Sign In</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <span onClick={() => setCurrentView('register')} className="auth-link">Sign Up</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;