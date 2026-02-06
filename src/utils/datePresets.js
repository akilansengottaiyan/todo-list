import { subDays, subMonths, subYears, startOfQuarter, subQuarters, endOfYesterday } from 'date-fns';

// Date range presets
export const DATE_PRESETS = {
  LAST_WEEK: 'last_week',
  LAST_MONTH: 'last_month',
  LAST_QUARTER: 'last_quarter',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
};

export const getPresetDateRange = (preset) => {
  const endDate = endOfYesterday(); // Use yesterday as end date to avoid incomplete data for today
  
  switch (preset) {
    case DATE_PRESETS.LAST_WEEK:
      return {
        startDate: subDays(endDate, 6), // Last 7 days including today
        endDate,
        label: 'Last 7 Days',
      };
    case DATE_PRESETS.LAST_MONTH:
      return {
        startDate: subMonths(endDate, 1),
        endDate,
        label: 'Last Month',
      };
    case DATE_PRESETS.LAST_QUARTER:
      return {
        startDate: startOfQuarter(subQuarters(endDate, 1)),
        endDate,
        label: 'Last Quarter',
      };
    case DATE_PRESETS.LAST_YEAR:
      return {
        startDate: subYears(endDate, 1),
        endDate,
        label: 'Last Year',
      };
    default:
      return {
        startDate: subDays(endDate, 6),
        endDate,
        label: 'Last 7 Days',
      };
  }
};
