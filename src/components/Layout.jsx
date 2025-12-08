import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const linkStyle = (path) => ({
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: isActive(path) ? 'var(--bg-card-hover)' : 'transparent',
    color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: isActive(path) ? '500' : 'normal',
    transition: 'all 0.2s',
    display: 'block',
    marginBottom: '0.5rem'
  });

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .layout-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            z-index: 1000;
            width: 280px !important;
          }
          .layout-sidebar.mobile-open {
            transform: translateX(0);
          }
          .layout-main {
            margin-left: 0 !important;
            padding: 1rem !important;
            padding-top: 4rem !important;
          }
          .mobile-menu-button {
            display: flex !important;
          }
          .mobile-overlay {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .layout-sidebar {
            transform: translateX(0) !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
          .mobile-overlay {
            display: none !important;
          }
        }
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease-in-out;
        }
        .mobile-overlay.active {
          opacity: 1;
          pointer-events: all;
        }
      `}</style>
      
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '44px',
          minHeight: '44px'
        }}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <span style={{ fontSize: '1.5rem' }}>✕</span>
        ) : (
          <span style={{ fontSize: '1.5rem' }}>☰</span>
        )}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside className={`layout-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{
          width: '250px',
          backgroundColor: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>BetTracker</h1>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/" style={linkStyle('/')}>
              Dashboard
            </Link>
            <Link to="/history" style={linkStyle('/history')}>
              History
            </Link>
            <Link to="/analytics" style={linkStyle('/analytics')}>
              Analytics
            </Link>
          </nav>

          <div style={{ marginTop: 'auto' }}>
            {/* We can add a mini-summary here later if needed */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="layout-main" style={{ flex: 1, padding: '2rem', marginLeft: '250px', width: '100%' }}>
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
