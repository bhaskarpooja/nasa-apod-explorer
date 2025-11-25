import React, { useEffect } from 'react';
import './ApodDetail.css';

function ApodDetail({ apod, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!apod) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="apod-detail-overlay" onClick={handleBackdropClick}>
      <div className="apod-detail-modal">
        <button className="close-button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="apod-detail-content">
          <div className="apod-detail-media-container">
            {apod.media_type === 'video' ? (
              <div className="apod-detail-video-wrapper">
                <iframe
                  src={apod.url}
                  title={apod.title}
                  className="apod-detail-media"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="apod-detail-image-wrapper">
                <img
                  src={apod.hdurl || apod.url}
                  alt={apod.title}
                  className="apod-detail-image"
                />
                {apod.hdurl && (
                  <a
                    href={apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hd-badge"
                  >
                    HD Version
                  </a>
                )}
              </div>
            )}
            <div className="media-type-badge-large">
              {apod.media_type === 'video' ? '🎥 Video' : '🖼️ Image'}
            </div>
          </div>

          <div className="apod-detail-info">
            <div className="apod-detail-header">
              <h1 className="apod-detail-title">{apod.title}</h1>
              <p className="apod-detail-date">{formatDate(apod.date)}</p>
            </div>

            {apod.copyright && (
              <div className="apod-detail-copyright">
                <span className="copyright-icon">©</span>
                <span>{apod.copyright}</span>
              </div>
            )}

            <div className="apod-detail-explanation">
              <h2 className="explanation-heading">Explanation</h2>
              <p className="explanation-text">{apod.explanation}</p>
            </div>

            <div className="apod-detail-actions">
              {apod.url && (
                <a
                  href={apod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button primary"
                >
                  Open Original
                </a>
              )}
              {apod.hdurl && apod.media_type === 'image' && (
                <a
                  href={apod.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-button secondary"
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

export default ApodDetail;

