import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDateRange } from '../hooks/useDateRange';
import { DATE_PRESETS } from '../utils/datePresets';
import { format } from 'date-fns';
import './DateRangePicker.css';

const DateRangePicker = () => {
  const {
    dateRange,
    selectedPreset,
    setPreset,
    setCustomRange,
    customStartDate,
    customEndDate,
  } = useDateRange();

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(customStartDate);
  const [tempEndDate, setTempEndDate] = useState(customEndDate);

  const presetOptions = [
    { value: DATE_PRESETS.LAST_WEEK, label: 'Last 7 Days' },
    { value: DATE_PRESETS.LAST_MONTH, label: 'Last Month' },
    { value: DATE_PRESETS.LAST_QUARTER, label: 'Last Quarter' },
    { value: DATE_PRESETS.LAST_YEAR, label: 'Last Year' },
    { value: DATE_PRESETS.CUSTOM, label: 'Custom Range' },
  ];

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    setPreset(preset);
    if (preset === DATE_PRESETS.CUSTOM) {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      if (tempStartDate > tempEndDate) {
        alert('Start date must be before end date');
        return;
      }
      setCustomRange(tempStartDate, tempEndDate);
      setShowCustomPicker(false);
    } else {
      alert('Please select both start and end dates');
    }
  };

  const handleCancelCustomRange = () => {
    setShowCustomPicker(false);
    if (!customStartDate || !customEndDate) {
      setPreset(DATE_PRESETS.LAST_WEEK);
    }
  };

  const formatDateRange = () => {
    return `${format(dateRange.startDate, 'MMM dd, yyyy')} - ${format(dateRange.endDate, 'MMM dd, yyyy')}`;
  };

  return (
    <div className="date-range-picker-container">
      <div className="date-range-header">
        <div className="date-range-label">
          <span className="label-text">Time Period:</span>
          <span className="date-range-value">{formatDateRange()}</span>
        </div>
      </div>
      
      <div className="date-range-controls">
        <select 
          className="preset-selector"
          value={selectedPreset}
          onChange={handlePresetChange}
        >
          {presetOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {showCustomPicker && (
          <div className="custom-date-picker-modal">
            <div className="custom-date-picker-content">
              <h3>Select Custom Date Range</h3>
              <div className="date-picker-inputs">
                <div className="date-input-group">
                  <label>Start Date</label>
                  <DatePicker
                    selected={tempStartDate}
                    onChange={setTempStartDate}
                    selectsStart
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    maxDate={new Date()}
                    dateFormat="MMM dd, yyyy"
                    className="custom-date-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>End Date</label>
                  <DatePicker
                    selected={tempEndDate}
                    onChange={setTempEndDate}
                    selectsEnd
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    minDate={tempStartDate}
                    maxDate={new Date()}
                    dateFormat="MMM dd, yyyy"
                    className="custom-date-input"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={handleCancelCustomRange}>
                  Cancel
                </button>
                <button className="btn-apply" onClick={handleApplyCustomRange}>
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
