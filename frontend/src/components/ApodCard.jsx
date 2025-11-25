import React from 'react';
import './ApodCard.css';

function ApodCard({ apod, onSelect }) {
  if (!apod) return null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(apod);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="apod-card" onClick={handleClick}>
      <div className="apod-card-image-container">
        {apod.media_type === 'video' ? (
          <div className="apod-card-video-container">
            <iframe
              src={apod.url}
              title={apod.title}
              className="apod-card-media"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="media-type-overlay">
              <span className="media-type-icon">🎥</span>
            </div>
          </div>
        ) : (
          <>
            <img
              src={apod.url}
              alt={apod.title}
              className="apod-card-image"
              loading="lazy"
            />
            <div className="media-type-overlay">
              <span className="media-type-icon">🖼️</span>
            </div>
          </>
        )}
        <div className="apod-card-overlay">
          <span className="view-details-text">View Details</span>
        </div>
      </div>
      <div className="apod-card-content">
        <h3 className="apod-card-title">{apod.title}</h3>
        <p className="apod-card-date">{formatDate(apod.date)}</p>
        {apod.copyright && (
          <p className="apod-card-copyright">© {apod.copyright}</p>
        )}
      </div>
    </div>
  );
}

export default ApodCard;

