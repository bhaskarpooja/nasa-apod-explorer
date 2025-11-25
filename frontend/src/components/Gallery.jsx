import React, { useState, useEffect } from 'react';
import { apodService } from '../services/apodService';
import ApodCard from './ApodCard';
import './Gallery.css';

function Gallery({ onApodSelect }) {
  const [apods, setApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(12);

  useEffect(() => {
    fetchRecentApods();
  }, [count]);

  const fetchRecentApods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apodService.getRecentApods(count);
      setApods(data);
    } catch (err) {
      setError(err.message || 'Failed to load gallery');
      console.error('Error fetching recent APODs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setCount(prev => prev + 12);
  };

  if (loading && apods.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery-header">
          <h2>Recent Images Gallery</h2>
          <p className="subtitle">Browse through recent Astronomy Pictures of the Day</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading amazing images...</p>
        </div>
      </div>
    );
  }

  if (error && apods.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery-header">
          <h2>Recent Images Gallery</h2>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">{error}</p>
          <button onClick={fetchRecentApods} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery fade-in">
      <div className="gallery-header">
        <h2>Recent Images Gallery</h2>
        <p className="subtitle">Browse through recent Astronomy Pictures of the Day</p>
        <div className="gallery-controls">
          <label htmlFor="count-select" className="count-label">
            Show:
          </label>
          <select
            id="count-select"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="count-select"
          >
            <option value={6}>6 images</option>
            <option value={12}>12 images</option>
            <option value={24}>24 images</option>
            <option value={36}>36 images</option>
          </select>
        </div>
      </div>

      {apods.length > 0 && (
        <>
          <div className="gallery-grid">
            {apods.map((apod, index) => (
              <ApodCard
                key={apod.date || index}
                apod={apod}
                onSelect={onApodSelect}
              />
            ))}
          </div>

          {loading && (
            <div className="loading-more">
              <div className="spinner-small"></div>
              <p>Loading more images...</p>
            </div>
          )}

          {!loading && apods.length >= count && (
            <div className="gallery-actions">
              <button onClick={handleLoadMore} className="load-more-button">
                Load More Images
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && apods.length === 0 && (
        <div className="empty-state">
          <p className="empty-message">No images found</p>
        </div>
      )}
    </div>
  );
}

export default Gallery;

