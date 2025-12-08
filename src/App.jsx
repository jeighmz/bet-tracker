import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BetProvider, useBets } from './context/BetContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';

// Component to handle migration when user logs in
const MigrationHandler = () => {
  const { currentUser } = useAuth();
  const { migrateFromLocalStorage } = useBets();
  const [migrationAttempted, setMigrationAttempted] = React.useState(false);

  useEffect(() => {
    // Only run migration once per user session
    if (currentUser && !migrationAttempted) {
      setMigrationAttempted(true);
      // Attempt migration on login (only once)
      migrateFromLocalStorage();
    }
    
    // Reset when user changes
    if (!currentUser) {
      setMigrationAttempted(false);
    }
  }, [currentUser, migrateFromLocalStorage, migrationAttempted]);

  return null;
};

function AppContent() {
  return (
    <BetProvider>
      <MigrationHandler />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </Layout>
      </Router>
    </BetProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
