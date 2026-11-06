function Navbar({ user, setUser, setCurrentView }) {
  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setCurrentView(user ? 'jobs' : 'landing')}>
        TalentBridge
      </div>
      
      <div className="nav-links">
        {user ? (
          <>
            <button className="nav-link-btn" onClick={() => setCurrentView('jobs')}>Job Board</button>
            
            {/* Show My Applications only for applicants */}
            {user.role === 'applicant' && (
              <button className="nav-link-btn" onClick={() => setCurrentView('my-applications')}>My Applications</button>
            )}
            
            {user.role === 'employer' && (
              <button className="nav-link-btn" onClick={() => setCurrentView('dashboard')}>Dashboard</button>
            )}
            
            <div className="user-badge">
              <span className="role-dot" style={{width: '8px', height: '8px', background: '#10b981', borderRadius: '50%'}}></span>
              {user.name}
            </div>
            <button className="btn-outline-small" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button className="nav-link-btn" onClick={() => setCurrentView('login')}>Sign In</button>
            <button className="btn-primary-small" onClick={() => setCurrentView('register')}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;