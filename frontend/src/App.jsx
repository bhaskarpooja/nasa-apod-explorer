import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DatePicker from './components/DatePicker';
import Gallery from './components/Gallery';
import ApodDetail from './components/ApodDetail';
import './App.css';

function App() {
  const [selectedApod, setSelectedApod] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedApod(null);
  };

  const handleApodSelect = (apod) => {
    setSelectedApod(apod);
  };

  const handleCloseDetail = () => {
    setSelectedApod(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon">🌌</span>
              NASA APOD Explorer
            </h1>
            <nav className="nav-menu">
              <button
                className={`nav-button ${activeView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleViewChange('dashboard')}
              >
                Today
              </button>
              <button
                className={`nav-button ${activeView === 'datepicker' ? 'active' : ''}`}
                onClick={() => handleViewChange('datepicker')}
              >
                Browse Date
              </button>
              <button
                className={`nav-button ${activeView === 'gallery' ? 'active' : ''}`}
                onClick={() => handleViewChange('gallery')}
              >
                Gallery
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {activeView === 'dashboard' && (
            <Dashboard onApodSelect={handleApodSelect} />
          )}
          {activeView === 'datepicker' && (
            <DatePicker onApodSelect={handleApodSelect} />
          )}
          {activeView === 'gallery' && (
            <Gallery onApodSelect={handleApodSelect} />
          )}
        </div>
      </main>

      {selectedApod && (
        <ApodDetail apod={selectedApod} onClose={handleCloseDetail} />
      )}

      <footer className="app-footer">
        <div className="container">
          <p>
            Data provided by{' '}
            <a
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              NASA API
            </a>
            {' '}| APOD images from 1995 to present
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

