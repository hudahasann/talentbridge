import { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import JobBoard from './pages/JobBoard';
import Dashboard from './pages/Dashboard';
import MyApplications from './pages/MyApplications';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="app-container">
      <Navbar 
        user={user} 
        setUser={setUser} 
        setCurrentView={setCurrentView} 
        currentView={currentView} 
      />
      
      <main className="main-content">
        {currentView === 'landing' && <Landing setCurrentView={setCurrentView} />}
        {currentView === 'login' && <Login setUser={setUser} setCurrentView={setCurrentView} />}
        {currentView === 'register' && <Register setUser={setUser} setCurrentView={setCurrentView} />}
        {currentView === 'jobs' && <JobBoard user={user} />}
        {currentView === 'dashboard' && <Dashboard user={user} />}
        {currentView === 'my-applications' && <MyApplications setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}

export default App;