import { 
  subDays, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter,
  startOfYear,
  isAfter,
  isBefore,
  isValid,
  format,
  parseISO
} from 'date-fns';

/**
 * Get today's date at midnight
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get yesterday's date
 */
export const getYesterday = () => {
  const today = getToday();
  return subDays(today, 1);
};

/**
 * Get the earliest allowed date (12 months ago from today)
 */
export const getMinAllowedDate = () => {
  const today = getToday();
  return subMonths(today, 12);
};

/**
 * Get the latest allowed date (yesterday)
 */
export const getMaxAllowedDate = () => {
  return getYesterday();
};

/**
 * Validate if a date is within allowed range
 */
export const isDateInAllowedRange = (date) => {
  if (!isValid(date)) return false;
  
  const minDate = getMinAllowedDate();
  const maxDate = getMaxAllowedDate();
  
  return !isBefore(date, minDate) && !isAfter(date, maxDate);
};

/**
 * Validate if a date range is valid
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!isValid(startDate) || !isValid(endDate)) return false;
  if (isAfter(startDate, endDate)) return false;
  
  return isDateInAllowedRange(startDate) && isDateInAllowedRange(endDate);
};

/**
 * Format date for display (e.g., "01 Jan 2026")
 */
export const formatDisplayDate = (date) => {
  if (!isValid(date)) return '';
  return format(date, 'dd MMM yyyy');
};

/**
 * Format date range for display
 */
export const formatDateRange = (startDate, endDate) => {
  return `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
};

/**
 * Preset calculations
 */

// 1W: Last 7 days up to and including yesterday
export const getPreset1W = () => {
  const end = getYesterday();
  const start = subDays(end, 6); // 7 days total including end date
  return { start, end };
};

// 1M: Last 30 days up to and including yesterday
export const getPreset1M = () => {
  const end = getYesterday();
  const start = subDays(end, 29); // 30 days total including end date
  return { start, end };
};

// 1Y: Last 12 months up to yesterday
export const getPreset1Y = () => {
  const end = getYesterday();
  const start = subMonths(end, 12);
  return { start, end };
};

// Past month: Last completed calendar month
export const getPresetPastMonth = () => {
  const today = getToday();
  const lastMonth = subMonths(today, 1);
  const start = startOfMonth(lastMonth);
  const end = endOfMonth(lastMonth);
  return { start, end };
};

// Past quarter: Last completed quarter (Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec)
export const getPresetPastQuarter = () => {
  const today = getToday();
  const lastQuarter = subMonths(today, 3);
  const start = startOfQuarter(lastQuarter);
  const end = endOfQuarter(lastQuarter);
  return { start, end };
};

// Past half year: Last completed half year (Jan-Jun or Jul-Dec)
export const getPresetPastHalfYear = () => {
  const today = getToday();
  const currentMonth = today.getMonth(); // 0-11
  
  let start, end;
  if (currentMonth >= 6) {
    // If we're in Jul-Dec, return Jan-Jun
    start = new Date(today.getFullYear(), 0, 1); // Jan 1
    end = new Date(today.getFullYear(), 5, 30); // Jun 30
  } else {
    // If we're in Jan-Jun, return Jul-Dec of previous year
    start = new Date(today.getFullYear() - 1, 6, 1); // Jul 1 prev year
    end = new Date(today.getFullYear() - 1, 11, 31); // Dec 31 prev year
  }
  
  return { start, end };
};

/**
 * Get preset by name
 */
export const getPresetDates = (presetName) => {
  switch (presetName) {
    case '1W':
      return getPreset1W();
    case '1M':
      return getPreset1M();
    case '1Y':
      return getPreset1Y();
    case 'PAST_MONTH':
      return getPresetPastMonth();
    case 'PAST_QUARTER':
      return getPresetPastQuarter();
    case 'PAST_HALF_YEAR':
      return getPresetPastHalfYear();
    default:
      return getPreset1M(); // Default to 1M
  }
};

/**
 * Get default date range (1M)
 */
export const getDefaultDateRange = () => {
  return getPreset1M();
};

/**
 * Check if a date should be disabled in the picker
 */
export const shouldDisableDate = (date) => {
  if (!isValid(date)) return true;
  
  const today = getToday();
  const minDate = getMinAllowedDate();
  
  // Disable if after today
  if (isAfter(date, today)) return true;
  
  // Disable if before 12 months ago
  if (isBefore(date, minDate)) return true;
  
  return false;
};
