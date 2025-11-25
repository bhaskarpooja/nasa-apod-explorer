import React, { useState, useEffect } from 'react';
import { apodService } from '../services/apodService';
import ApodCard from './ApodCard';
import './Dashboard.css';

function Dashboard({ onApodSelect }) {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodayApod();
  }, []);

  const fetchTodayApod = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apodService.getTodayApod();
      setApod(data);
    } catch (err) {
      setError(err.message || 'Failed to load today\'s APOD');
      console.error('Error fetching today APOD:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Today's Astronomy Picture</h2>
          <p className="subtitle">Discover the cosmos!</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading today's amazing picture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Today's Astronomy Picture</h2>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button onClick={fetchTodayApod} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!apod) {
    return null;
  }

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h2>Today's Astronomy Picture</h2>
        <p className="subtitle">
          {apod.date ? new Date(apod.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'Today'}
        </p>
      </div>
      <div className="dashboard-content">
        <div className="today-apod-featured">
          <div className="featured-image-container">
            {apod.media_type === 'video' ? (
              <iframe
                src={apod.url}
                title={apod.title}
                className="featured-media"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={apod.hdurl || apod.url}
                alt={apod.title}
                className="featured-image"
                loading="lazy"
              />
            )}
            <div className="media-type-badge">
              {apod.media_type === 'video' ? '🎥 Video' : '🖼️ Image'}
            </div>
          </div>
          <div className="featured-content">
            <h1 className="featured-title">{apod.title}</h1>
            {apod.copyright && (
              <p className="featured-copyright">
                <span className="copyright-icon">©</span> {apod.copyright}
              </p>
            )}
            <p className="featured-explanation">{apod.explanation}</p>
            <div className="featured-actions">
              <button
                onClick={() => onApodSelect(apod)}
                className="view-detail-button"
              >
                View Full Details
              </button>
              {apod.hdurl && apod.media_type === 'image' && (
                <a
                  href={apod.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hd-link-button"
                >
                  View HD Version
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

