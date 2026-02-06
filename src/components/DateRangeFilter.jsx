import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  getPresetDates,
  formatDateRange,
  isValidDateRange,
  getMinAllowedDate,
  getMaxAllowedDate,
  shouldDisableDate,
  formatDisplayDate
} from '../utils/dateUtils';
import './DateRangeFilter.css';

const PRESETS = [
  { id: '1W', label: '1W', description: 'Last 7 days' },
  { id: '1M', label: '1M', description: 'Last 30 days' },
  { id: '1Y', label: '1Y', description: 'Last 12 months' },
  { id: 'PAST_MONTH', label: 'Past Month', description: 'Last completed month' },
  { id: 'PAST_QUARTER', label: 'Past Quarter', description: 'Last completed quarter' },
  { id: 'PAST_HALF_YEAR', label: 'Past Half Year', description: 'Last completed half year' }
];

const DateRangeFilter = ({ onDateRangeChange, initialStartDate, initialEndDate }) => {
  const [activePreset, setActivePreset] = useState('1M');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [error, setError] = useState('');

  // Initialize with default (1M) on first load
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      const start = new Date(initialStartDate);
      const end = new Date(initialEndDate);
      setStartDate(start);
      setEndDate(end);
      setCustomStartDate(format(start, 'yyyy-MM-dd'));
      setCustomEndDate(format(end, 'yyyy-MM-dd'));
    } else {
      const { start, end } = getPresetDates('1M');
      setStartDate(start);
      setEndDate(end);
      setCustomStartDate(format(start, 'yyyy-MM-dd'));
      setCustomEndDate(format(end, 'yyyy-MM-dd'));
      if (onDateRangeChange) {
        onDateRangeChange(start, end);
      }
    }
  }, []);

  const handlePresetClick = (presetId) => {
    setError('');
    const { start, end } = getPresetDates(presetId);
    setStartDate(start);
    setEndDate(end);
    setActivePreset(presetId);
    setCustomStartDate(format(start, 'yyyy-MM-dd'));
    setCustomEndDate(format(end, 'yyyy-MM-dd'));
    
    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
  };

  const handleCustomDateChange = (field, value) => {
    if (field === 'start') {
      setCustomStartDate(value);
    } else {
      setCustomEndDate(value);
    }
    setActivePreset(null); // Clear preset highlight when custom dates are modified
  };

  const applyCustomRange = () => {
    setError('');
    
    if (!customStartDate || !customEndDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(customStartDate);
    const end = new Date(customEndDate);

    if (!isValidDateRange(start, end)) {
      setError('Select a valid range within the last 12 months, no future dates');
      return;
    }

    setStartDate(start);
    setEndDate(end);
    setActivePreset(null);
    
    if (onDateRangeChange) {
      onDateRangeChange(start, end);
    }
    
    setShowCustomPicker(false);
  };

  const minDate = format(getMinAllowedDate(), 'yyyy-MM-dd');
  const maxDate = format(getMaxAllowedDate(), 'yyyy-MM-dd');

  return (
    <div className="date-range-filter">
      <div className="filter-header">
        <h3>Date Range Filter</h3>
        {startDate && endDate && (
          <div className="selected-range" aria-live="polite">
            {formatDateRange(startDate, endDate)}
          </div>
        )}
      </div>

      <div className="preset-buttons" role="group" aria-label="Date range presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset.id)}
            className={`preset-btn ${activePreset === preset.id ? 'active' : ''}`}
            aria-pressed={activePreset === preset.id}
            title={preset.description}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="custom-range-section">
        <button
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          className="toggle-custom-btn"
          aria-expanded={showCustomPicker}
        >
          {showCustomPicker ? '▼' : '▶'} Custom Range
        </button>

        {showCustomPicker && (
          <div className="custom-picker" role="region" aria-label="Custom date range picker">
            <div className="date-input-group">
              <label htmlFor="start-date">
                Start Date:
                <input
                  id="start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  min={minDate}
                  max={maxDate}
                  aria-describedby="date-range-error"
                />
              </label>

              <label htmlFor="end-date">
                End Date:
                <input
                  id="end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  min={minDate}
                  max={maxDate}
                  aria-describedby="date-range-error"
                />
              </label>
            </div>

            <button onClick={applyCustomRange} className="apply-btn">
              Apply Custom Range
            </button>

            {error && (
              <div className="error-message" role="alert" id="date-range-error">
                {error}
              </div>
            )}

            <div className="date-constraints">
              <small>
                Valid range: {formatDisplayDate(getMinAllowedDate())} to {formatDisplayDate(getMaxAllowedDate())}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
