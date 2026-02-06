import { useState, useMemo } from 'react';
import { DATE_PRESETS, getPresetDateRange } from '../utils/datePresets';
import { DateRangeContext } from './dateRangeContextDefinition';

export const DateRangeProvider = ({ children }) => {
  const [selectedPreset, setSelectedPreset] = useState(DATE_PRESETS.LAST_WEEK);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  // Get the active date range based on preset or custom selection
  const dateRange = useMemo(() => {
    if (selectedPreset === DATE_PRESETS.CUSTOM && customStartDate && customEndDate) {
      return {
        startDate: customStartDate,
        endDate: customEndDate,
        label: 'Custom Range',
      };
    }
    return getPresetDateRange(selectedPreset);
  }, [selectedPreset, customStartDate, customEndDate]);

  // Compute last-updated timestamp when date range changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lastUpdated = useMemo(() => new Date(), [selectedPreset, customStartDate, customEndDate]);

  const setPreset = (preset) => {
    setSelectedPreset(preset);
    if (preset !== DATE_PRESETS.CUSTOM) {
      setCustomStartDate(null);
      setCustomEndDate(null);
    }
  };

  const setCustomRange = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setSelectedPreset(DATE_PRESETS.CUSTOM);
  };

  const value = {
    dateRange,
    selectedPreset,
    setPreset,
    setCustomRange,
    customStartDate,
    customEndDate,
    lastUpdated,
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
};
