import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInQuarters,
  differenceInYears,
  parseISO,
  isAfter,
  isBefore,
  isValid,
} from 'date-fns';

// Date range presets
export const DATE_PRESETS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_14_DAYS: 'last_14_days',
  LAST_30_DAYS: 'last_30_days',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
};

// Granularity levels
export const GRANULARITY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
};

// Comparison types
export const COMPARISON_TYPE = {
  NONE: 'none',
  PREVIOUS_PERIOD: 'previous_period',
  YEAR_OVER_YEAR: 'year_over_year',
};

/**
 * Get date range based on preset
 * @param {string} preset - Preset identifier
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {{startDate: Date, endDate: Date}}
 */
export const getPresetDateRange = (preset, referenceDate = new Date()) => {
  const now = referenceDate;

  switch (preset) {
    case DATE_PRESETS.TODAY:
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };

    case DATE_PRESETS.YESTERDAY:
      return {
        startDate: startOfDay(subDays(now, 1)),
        endDate: endOfDay(subDays(now, 1)),
      };

    case DATE_PRESETS.LAST_7_DAYS:
      return {
        startDate: startOfDay(subDays(now, 6)),
        endDate: endOfDay(now),
      };

    case DATE_PRESETS.LAST_14_DAYS:
      return {
        startDate: startOfDay(subDays(now, 13)),
        endDate: endOfDay(now),
      };

    case DATE_PRESETS.LAST_30_DAYS:
      return {
        startDate: startOfDay(subDays(now, 29)),
        endDate: endOfDay(now),
      };

    case DATE_PRESETS.THIS_WEEK:
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }), // Monday
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
      };

    case DATE_PRESETS.LAST_WEEK:
      return {
        startDate: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        endDate: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      };

    case DATE_PRESETS.THIS_MONTH:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };

    case DATE_PRESETS.LAST_MONTH:
      return {
        startDate: startOfMonth(subMonths(now, 1)),
        endDate: endOfMonth(subMonths(now, 1)),
      };

    case DATE_PRESETS.THIS_QUARTER:
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now),
      };

    case DATE_PRESETS.LAST_QUARTER:
      return {
        startDate: startOfQuarter(subQuarters(now, 1)),
        endDate: endOfQuarter(subQuarters(now, 1)),
      };

    case DATE_PRESETS.THIS_YEAR:
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      };

    case DATE_PRESETS.LAST_YEAR:
      return {
        startDate: startOfYear(subYears(now, 1)),
        endDate: endOfYear(subYears(now, 1)),
      };

    default:
      return {
        startDate: startOfDay(subDays(now, 29)),
        endDate: endOfDay(now),
      };
  }
};

/**
 * Get comparison date range
 * @param {Date} startDate - Current period start date
 * @param {Date} endDate - Current period end date
 * @param {string} comparisonType - Type of comparison
 * @returns {{startDate: Date, endDate: Date}}
 */
export const getComparisonDateRange = (startDate, endDate, comparisonType) => {
  const daysDiff = differenceInDays(endDate, startDate);

  switch (comparisonType) {
    case COMPARISON_TYPE.PREVIOUS_PERIOD:
      return {
        startDate: subDays(startDate, daysDiff + 1),
        endDate: subDays(endDate, daysDiff + 1),
      };

    case COMPARISON_TYPE.YEAR_OVER_YEAR:
      return {
        startDate: subYears(startDate, 1),
        endDate: subYears(endDate, 1),
      };

    default:
      return null;
  }
};

/**
 * Generate data points based on granularity
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {string} granularity
 * @returns {Array<{date: Date, label: string}>}
 */
export const generateDataPoints = (startDate, endDate, granularity) => {
  switch (granularity) {
    case GRANULARITY.DAILY:
      return eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
        date,
        label: format(date, 'MMM dd'),
        fullLabel: format(date, 'MMM dd, yyyy'),
      }));

    case GRANULARITY.WEEKLY:
      return eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 }
      ).map((date) => ({
        date,
        label: `W${format(date, 'ww')}`,
        fullLabel: `Week of ${format(date, 'MMM dd, yyyy')}`,
      }));

    case GRANULARITY.MONTHLY:
      return eachMonthOfInterval({ start: startDate, end: endDate }).map((date) => ({
        date,
        label: format(date, 'MMM yy'),
        fullLabel: format(date, 'MMMM yyyy'),
      }));

    case GRANULARITY.QUARTERLY:
      const quarters = [];
      let currentQuarter = startOfQuarter(startDate);
      const lastQuarter = startOfQuarter(endDate);

      while (
        isBefore(currentQuarter, lastQuarter) ||
        format(currentQuarter, 'Q yyyy') === format(lastQuarter, 'Q yyyy')
      ) {
        quarters.push({
          date: currentQuarter,
          label: `Q${format(currentQuarter, 'Q yy')}`,
          fullLabel: `Q${format(currentQuarter, 'Q yyyy')}`,
        });
        currentQuarter = startOfQuarter(subQuarters(currentQuarter, -1));
      }
      return quarters;

    case GRANULARITY.YEARLY:
      const years = [];
      let currentYear = startOfYear(startDate);
      const lastYear = startOfYear(endDate);

      while (
        isBefore(currentYear, lastYear) ||
        format(currentYear, 'yyyy') === format(lastYear, 'yyyy')
      ) {
        years.push({
          date: currentYear,
          label: format(currentYear, 'yyyy'),
          fullLabel: format(currentYear, 'yyyy'),
        });
        currentYear = startOfYear(subYears(currentYear, -1));
      }
      return years;

    default:
      return [];
  }
};

/**
 * Validate date range
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {number} maxDays - Maximum allowed days
 * @returns {{valid: boolean, error: string}}
 */
export const validateDateRange = (startDate, endDate, maxDays = 730) => {
  if (!isValid(startDate) || !isValid(endDate)) {
    return { valid: false, error: 'Invalid date' };
  }

  if (isAfter(startDate, endDate)) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  const daysDiff = differenceInDays(endDate, startDate);
  if (daysDiff > maxDays) {
    return { valid: false, error: `Date range cannot exceed ${maxDays} days` };
  }

  const now = new Date();
  if (isAfter(startDate, now)) {
    return { valid: false, error: 'Start date cannot be in the future' };
  }

  return { valid: true, error: null };
};

/**
 * Format date range for display
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {string}
 */
export const formatDateRangeDisplay = (startDate, endDate) => {
  const start = format(startDate, 'MMM dd, yyyy');
  const end = format(endDate, 'MMM dd, yyyy');
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
};

/**
 * Get preset label
 * @param {string} preset
 * @returns {string}
 */
export const getPresetLabel = (preset) => {
  const labels = {
    [DATE_PRESETS.TODAY]: 'Today',
    [DATE_PRESETS.YESTERDAY]: 'Yesterday',
    [DATE_PRESETS.LAST_7_DAYS]: 'Last 7 Days',
    [DATE_PRESETS.LAST_14_DAYS]: 'Last 14 Days',
    [DATE_PRESETS.LAST_30_DAYS]: 'Last 30 Days',
    [DATE_PRESETS.THIS_WEEK]: 'This Week',
    [DATE_PRESETS.LAST_WEEK]: 'Last Week',
    [DATE_PRESETS.THIS_MONTH]: 'This Month',
    [DATE_PRESETS.LAST_MONTH]: 'Last Month',
    [DATE_PRESETS.THIS_QUARTER]: 'This Quarter',
    [DATE_PRESETS.LAST_QUARTER]: 'Last Quarter',
    [DATE_PRESETS.THIS_YEAR]: 'This Year',
    [DATE_PRESETS.LAST_YEAR]: 'Last Year',
    [DATE_PRESETS.CUSTOM]: 'Custom Range',
  };
  return labels[preset] || preset;
};
