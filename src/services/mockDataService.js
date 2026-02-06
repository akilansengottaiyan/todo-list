import { differenceInDays, eachDayOfInterval, format, addDays } from 'date-fns';

// AI Tools being tracked
const AI_TOOLS = [
  'Glean',
  'ChatGPT',
  'Zoom AI Companion',
  'Trupeer',
  'Vercel/V0',
  'Gemini',
  'Company Agents'
];

/**
 * Generate mock data for a given date range
 */
const generateMockData = (startDate, endDate) => {
  const days = differenceInDays(endDate, startDate) + 1;
  
  // Generate daily data for time series
  const dailyData = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const toolData = {};
    
    AI_TOOLS.forEach(tool => {
      // Random usage with some variance
      const baseUsage = Math.floor(Math.random() * 100) + 50;
      toolData[tool] = baseUsage + Math.floor(Math.random() * 30);
    });
    
    return {
      date: dateStr,
      ...toolData
    };
  });

  // Calculate aggregate metrics
  const totalUsers = Math.floor(Math.random() * 500) + 1000;
  const activeUsers = Math.floor(totalUsers * (0.6 + Math.random() * 0.3));
  const totalSessions = Math.floor(activeUsers * (5 + Math.random() * 10));
  const avgSessionDuration = Math.floor(Math.random() * 20) + 10; // minutes

  // Tool-specific metrics
  const toolMetrics = AI_TOOLS.map(tool => {
    const users = Math.floor(Math.random() * 300) + 100;
    const sessions = Math.floor(users * (3 + Math.random() * 5));
    const valueScore = (Math.random() * 30 + 70).toFixed(1); // 70-100 value score
    
    return {
      tool,
      users,
      sessions,
      valueScore: parseFloat(valueScore),
      adoptionRate: ((users / totalUsers) * 100).toFixed(1),
      avgDuration: Math.floor(Math.random() * 30) + 5
    };
  });

  // Trend data (week over week comparison)
  const trendsData = AI_TOOLS.map(tool => {
    const weekOverWeekChange = (Math.random() * 40 - 10).toFixed(1); // -10% to +30%
    const monthOverMonthChange = (Math.random() * 60 - 5).toFixed(1); // -5% to +55%
    
    return {
      tool,
      weekOverWeek: parseFloat(weekOverWeekChange),
      monthOverMonth: parseFloat(monthOverMonthChange)
    };
  });

  return {
    dateRange: {
      start: format(startDate, 'yyyy-MM-dd'),
      end: format(endDate, 'yyyy-MM-dd')
    },
    kpis: {
      totalUsers,
      activeUsers,
      totalSessions,
      avgSessionDuration,
      adoptionRate: ((activeUsers / totalUsers) * 100).toFixed(1)
    },
    dailyData,
    toolMetrics,
    trendsData
  };
};

/**
 * Fetch metrics data for a given date range
 * Simulates an API call with a delay
 */
export const fetchMetricsData = async (startDate, endDate) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return generateMockData(startDate, endDate);
};

/**
 * Get top performing tools
 */
export const getTopTools = (toolMetrics, metric = 'users', limit = 5) => {
  return [...toolMetrics]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, limit);
};

/**
 * Calculate growth trends
 */
export const calculateGrowthTrend = (dailyData, tool) => {
  if (dailyData.length < 2) return 0;
  
  const firstWeek = dailyData.slice(0, 7);
  const lastWeek = dailyData.slice(-7);
  
  const firstWeekAvg = firstWeek.reduce((sum, day) => sum + (day[tool] || 0), 0) / firstWeek.length;
  const lastWeekAvg = lastWeek.reduce((sum, day) => sum + (day[tool] || 0), 0) / lastWeek.length;
  
  if (firstWeekAvg === 0) return 0;
  
  return (((lastWeekAvg - firstWeekAvg) / firstWeekAvg) * 100).toFixed(1);
};

/**
 * Export mock data for testing
 */
export const getMockDataForTesting = () => {
  const today = new Date();
  const startDate = addDays(today, -30);
  return generateMockData(startDate, today);
};
