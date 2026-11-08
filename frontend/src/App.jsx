import { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import JobBoard from './pages/JobBoard';
import Dashboard from './pages/Dashboard';
import MyApplications from './pages/MyApplications';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // BULLETPROOF REDIRECT ON REFRESH:
      if (parsedUser.role === 'applicant' && !parsedUser.profileComplete) {
        setCurrentView('onboarding');
      } else if (parsedUser.role === 'employer' || parsedUser.role === 'recruiter') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('jobs');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="app-container">
      <Navbar user={user} setUser={setUser} setCurrentView={setCurrentView} currentView={currentView} handleLogout={handleLogout} />
      
      <main className="main-content">
        {currentView === 'landing' && <Landing setCurrentView={setCurrentView} />}
        {currentView === 'login' && <Login setUser={setUser} setCurrentView={setCurrentView} />}
        {currentView === 'register' && <Register setUser={setUser} setCurrentView={setCurrentView} />}
        {currentView === 'onboarding' && <Onboarding user={user} setUser={setUser} setCurrentView={setCurrentView} />}
        {currentView === 'jobs' && <JobBoard user={user} />}
        {currentView === 'dashboard' && <Dashboard user={user} />}
        {currentView === 'my-applications' && <MyApplications setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}

export default App;