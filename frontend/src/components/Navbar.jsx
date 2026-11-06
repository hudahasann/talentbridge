function Navbar({ user, setCurrentView, currentView, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <div className="brand-logo" onClick={() => setCurrentView(user ? 'jobs' : 'landing')} style={{ cursor: 'pointer' }}>
            TalentBridge
          </div>
          <div className="nav-links">
            <button className="nav-link-btn" onClick={() => setCurrentView('jobs')}>Job Board</button>
            {user && user.role === 'applicant' && (
              <button className="nav-link-btn" onClick={() => setCurrentView('my-applications')}>My Applications</button>
            )}
            {user && user.role === 'employer' && (
              <button className="nav-link-btn" onClick={() => setCurrentView('dashboard')}>Dashboard</button>
            )}
          </div>
        </div>
        <div className="nav-right">
          {user ? (
            <div className="user-controls">
              <div className="user-badge">
                <span className="role-dot" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>
                {user.name}
              </div>
              <button className="btn-outline-small" onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <>
              <button className="nav-link-btn" onClick={() => setCurrentView('login')}>Sign In</button>
              <button className="btn-primary-small" onClick={() => setCurrentView('register')}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;