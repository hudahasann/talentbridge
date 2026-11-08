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
      
      // If they are an applicant and haven't finished onboarding, force them there.
      if (parsedUser.role === 'applicant' && parsedUser.profileComplete === false) {
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

  // This wrapper prevents them from clicking away from onboarding if they haven't finished
  const handleNavigation = (view) => {
    if (user && user.role === 'applicant' && user.profileComplete === false && view !== 'onboarding') {
      alert("Please complete your profile first to access other pages.");
      return;
    }
    setCurrentView(view);
  };

  return (
    <div className="app-container">
      <Navbar user={user} setUser={setUser} setCurrentView={handleNavigation} currentView={currentView} handleLogout={handleLogout} />
      
      <main className="main-content">
        {currentView === 'landing' && <Landing setCurrentView={handleNavigation} />}
        {currentView === 'login' && <Login setUser={setUser} setCurrentView={handleNavigation} />}
        {currentView === 'register' && <Register setUser={setUser} setCurrentView={handleNavigation} />}
        {currentView === 'onboarding' && <Onboarding user={user} setUser={setUser} setCurrentView={handleNavigation} />}
        {currentView === 'jobs' && <JobBoard user={user} />}
        {currentView === 'dashboard' && <Dashboard user={user} />}
        {currentView === 'my-applications' && <MyApplications setCurrentView={handleNavigation} />}
      </main>
    </div>
  );
}

export default App;