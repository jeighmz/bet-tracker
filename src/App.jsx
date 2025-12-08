import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BetProvider } from './context/BetContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
// Import pages lazily or directly if they exist, for now we will create placeholders
import History from './pages/History';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </BetProvider>
  );
}

export default App;
