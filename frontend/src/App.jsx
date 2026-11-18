import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SoilForm from './components/SoilForm';
import RecommendationResult from './components/RecommendationResult';
import History from './components/History';
import SupportWidget from './components/SupportWidget';

const MainApp = ({ theme, toggleTheme }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resultData, setResultData] = useState(null);

  // If user is not authenticated, display Login/Signup
  if (!token) {
    return <Auth theme={theme} toggleTheme={toggleTheme} />;
  }

  // Router matching for screens
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} setResultData={setResultData} />;
      case 'form':
        return <SoilForm setActiveTab={setActiveTab} setResultData={setResultData} />;
      case 'result':
        return <RecommendationResult resultData={resultData} setActiveTab={setActiveTab} />;
      case 'history':
        return <History setActiveTab={setActiveTab} setResultData={setResultData} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} setResultData={setResultData} />;
    }
  };

  return (
    <div style={styles.appLayout}>
      <Navbar theme={theme} toggleTheme={toggleTheme} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.mainContent}>
        {renderActiveScreen()}
      </main>
      <SupportWidget />
    </div>
  );
};

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp theme={theme} toggleTheme={toggleTheme} />
      </LanguageProvider>
    </AuthProvider>
  );
};

const styles = {
  appLayout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-main)'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }
};

export default App;
