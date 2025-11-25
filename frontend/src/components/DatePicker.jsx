import React, { useState } from 'react';
import DatePickerLib from 'react-datepicker';
import { apodService } from '../services/apodService';
import ApodCard from './ApodCard';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';

function DatePicker({ onApodSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const minDate = new Date('1995-06-16');
  const maxDate = new Date();

  const handleDateChange = async (date) => {
    if (!date) return;
    
    setSelectedDate(date);
    setError(null);
    setLoading(true);
    
    try {
      const dateStr = formatDate(date);
      const data = await apodService.getApodByDate(dateStr);
      setApod(data);
    } catch (err) {
      setError(err.message || 'Failed to load APOD for selected date');
      setApod(null);
      console.error('Error fetching APOD:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="date-picker-view fade-in">
      <div className="date-picker-header">
        <h2>Browse by Date</h2>
        <p className="subtitle">Select any date from June 16, 1995 to today</p>
      </div>

      <div className="date-picker-controls">
        <div className="date-picker-wrapper">
          <label htmlFor="apod-date-picker" className="date-label">
            Select Date:
          </label>
          <DatePickerLib
            id="apod-date-picker"
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="MMMM d, yyyy"
            className="custom-date-picker"
            wrapperClassName="date-picker-input-wrapper"
            placeholderText="Select a date"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
        </div>
      </div>

      <div className="date-picker-result">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading APOD for selected date...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && !error && apod && (
          <div className="selected-apod">
            <ApodCard apod={apod} onSelect={onApodSelect} />
          </div>
        )}

        {!loading && !error && !apod && (
          <div className="empty-state">
            <p className="empty-message">
              Select a date above to view the Astronomy Picture of the Day
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePicker;

