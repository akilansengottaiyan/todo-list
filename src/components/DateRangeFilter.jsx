import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  DATE_PRESETS,
  GRANULARITY,
  COMPARISON_TYPE,
  getPresetDateRange,
  getComparisonDateRange,
  validateDateRange,
  formatDateRangeDisplay,
  getPresetLabel,
} from '../utils/dateUtils';
import {
  DATA_SOURCES,
  isGranularitySupported,
  getGranularityTooltip,
  getMaxHistoricalDays,
  getDataFreshness,
  getSourceLimitations,
  getDefaultGranularity,
} from '../utils/dataCapabilities';
import './DateRangeFilter.css';

const DateRangeFilter = ({ 
  dataSource = DATA_SOURCES.ALL_TOOLS, 
  onChange,
  initialPreset = DATE_PRESETS.LAST_30_DAYS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(initialPreset);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [granularity, setGranularity] = useState(() => getDefaultGranularity(dataSource));
  const [comparisonType, setComparisonType] = useState(COMPARISON_TYPE.NONE);
  const [validationError, setValidationError] = useState(null);
  const dropdownRef = useRef(null);

  // Load saved preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dateRangeFilter');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.preset) setSelectedPreset(parsed.preset);
        if (parsed.granularity && isGranularitySupported(dataSource, parsed.granularity)) {
          setGranularity(parsed.granularity);
        }
        if (parsed.comparisonType) setComparisonType(parsed.comparisonType);
      } catch (e) {
        console.error('Failed to load saved preferences', e);
      }
    }
  }, []);

  // Update granularity when data source changes
  useEffect(() => {
    if (!isGranularitySupported(dataSource, granularity)) {
      setGranularity(getDefaultGranularity(dataSource));
    }
  }, [dataSource]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notify parent of changes
  useEffect(() => {
    const { startDate, endDate } = getCurrentDateRange();
    if (startDate && endDate) {
      const comparisonRange = comparisonType !== COMPARISON_TYPE.NONE
        ? getComparisonDateRange(startDate, endDate, comparisonType)
        : null;

      // Save to localStorage
      localStorage.setItem('dateRangeFilter', JSON.stringify({
        preset: selectedPreset,
        granularity,
        comparisonType,
      }));

      onChange({
        startDate,
        endDate,
        granularity,
        comparisonType,
        comparisonRange,
        preset: selectedPreset,
      });
    }
  }, [selectedPreset, customStartDate, customEndDate, granularity, comparisonType]);

  const getCurrentDateRange = () => {
    if (selectedPreset === DATE_PRESETS.CUSTOM) {
      return {
        startDate: customStartDate,
        endDate: customEndDate,
      };
    }
    return getPresetDateRange(selectedPreset);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setValidationError(null);
    if (preset !== DATE_PRESETS.CUSTOM) {
      setIsOpen(false);
    }
  };

  const handleCustomDateChange = (start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);

    if (start && end) {
      const maxDays = getMaxHistoricalDays(dataSource);
      const validation = validateDateRange(start, end, maxDays);
      
      if (!validation.valid) {
        setValidationError(validation.error);
      } else {
        setValidationError(null);
        setIsOpen(false);
      }
    }
  };

  const handleGranularityChange = (newGranularity) => {
    if (isGranularitySupported(dataSource, newGranularity)) {
      setGranularity(newGranularity);
    }
  };

  const handleComparisonToggle = (type) => {
    setComparisonType(comparisonType === type ? COMPARISON_TYPE.NONE : type);
  };

  const { startDate, endDate } = getCurrentDateRange();
  const displayText = startDate && endDate 
    ? formatDateRangeDisplay(startDate, endDate)
    : getPresetLabel(selectedPreset);

  const presets = [
    { value: DATE_PRESETS.TODAY, label: 'Today' },
    { value: DATE_PRESETS.YESTERDAY, label: 'Yesterday' },
    { value: DATE_PRESETS.LAST_7_DAYS, label: 'Last 7 Days' },
    { value: DATE_PRESETS.LAST_14_DAYS, label: 'Last 14 Days' },
    { value: DATE_PRESETS.LAST_30_DAYS, label: 'Last 30 Days' },
    { value: DATE_PRESETS.THIS_WEEK, label: 'This Week' },
    { value: DATE_PRESETS.LAST_WEEK, label: 'Last Week' },
    { value: DATE_PRESETS.THIS_MONTH, label: 'This Month' },
    { value: DATE_PRESETS.LAST_MONTH, label: 'Last Month' },
    { value: DATE_PRESETS.THIS_QUARTER, label: 'This Quarter' },
    { value: DATE_PRESETS.LAST_QUARTER, label: 'Last Quarter' },
    { value: DATE_PRESETS.THIS_YEAR, label: 'This Year' },
    { value: DATE_PRESETS.LAST_YEAR, label: 'Last Year' },
    { value: DATE_PRESETS.CUSTOM, label: 'Custom Range' },
  ];

  const granularities = [
    { value: GRANULARITY.DAILY, label: 'Daily' },
    { value: GRANULARITY.WEEKLY, label: 'Weekly' },
    { value: GRANULARITY.MONTHLY, label: 'Monthly' },
    { value: GRANULARITY.QUARTERLY, label: 'Quarterly' },
    { value: GRANULARITY.YEARLY, label: 'Yearly' },
  ];

  const sourceLimitations = getSourceLimitations(dataSource);

  return (
    <div className="date-range-filter" ref={dropdownRef}>
      <div className="filter-header">
        <button 
          className="filter-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="filter-icon">📅</span>
          <span className="filter-text">{displayText}</span>
          <span className="filter-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
        
        <div className="filter-meta">
          <span className="data-freshness" title={`Data freshness: ${getDataFreshness(dataSource)}`}>
            🔄 Last updated: {getDataFreshness(dataSource)}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="dropdown-section">
            <h4>Date Range</h4>
            <div className="preset-grid">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  className={`preset-button ${selectedPreset === preset.value ? 'active' : ''}`}
                  onClick={() => handlePresetChange(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {selectedPreset === DATE_PRESETS.CUSTOM && (
              <div className="custom-date-picker">
                <div className="date-picker-row">
                  <div className="date-picker-field">
                    <label>Start Date</label>
                    <DatePicker
                      selected={customStartDate}
                      onChange={(date) => handleCustomDateChange(date, customEndDate)}
                      selectsStart
                      startDate={customStartDate}
                      endDate={customEndDate}
                      maxDate={new Date()}
                      dateFormat="MMM dd, yyyy"
                      placeholderText="Select start date"
                    />
                  </div>
                  <div className="date-picker-field">
                    <label>End Date</label>
                    <DatePicker
                      selected={customEndDate}
                      onChange={(date) => handleCustomDateChange(customStartDate, date)}
                      selectsEnd
                      startDate={customStartDate}
                      endDate={customEndDate}
                      minDate={customStartDate}
                      maxDate={new Date()}
                      dateFormat="MMM dd, yyyy"
                      placeholderText="Select end date"
                    />
                  </div>
                </div>
                {validationError && (
                  <div className="validation-error">
                    ⚠️ {validationError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dropdown-section">
            <h4>Granularity</h4>
            <div className="granularity-buttons">
              {granularities.map((gran) => {
                const isSupported = isGranularitySupported(dataSource, gran.value);
                const tooltip = getGranularityTooltip(dataSource, gran.value);
                
                return (
                  <button
                    key={gran.value}
                    className={`granularity-button ${granularity === gran.value ? 'active' : ''} ${!isSupported ? 'disabled' : ''}`}
                    onClick={() => handleGranularityChange(gran.value)}
                    disabled={!isSupported}
                    title={tooltip || gran.label}
                  >
                    {gran.label}
                  </button>
                );
              })}
            </div>
            {sourceLimitations && (
              <div className="limitations-notice">
                ℹ️ {sourceLimitations}
              </div>
            )}
          </div>

          <div className="dropdown-section">
            <h4>Compare To</h4>
            <div className="comparison-toggles">
              <label className="comparison-toggle">
                <input
                  type="checkbox"
                  checked={comparisonType === COMPARISON_TYPE.PREVIOUS_PERIOD}
                  onChange={() => handleComparisonToggle(COMPARISON_TYPE.PREVIOUS_PERIOD)}
                />
                <span>Previous Period</span>
              </label>
              <label className="comparison-toggle">
                <input
                  type="checkbox"
                  checked={comparisonType === COMPARISON_TYPE.YEAR_OVER_YEAR}
                  onChange={() => handleComparisonToggle(COMPARISON_TYPE.YEAR_OVER_YEAR)}
                />
                <span>Year over Year</span>
              </label>
            </div>
          </div>

          <div className="dropdown-actions">
            <button 
              className="apply-button"
              onClick={() => setIsOpen(false)}
              disabled={!!validationError}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
