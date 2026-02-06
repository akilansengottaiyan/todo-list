import { format, subDays, startOfDay } from 'date-fns';
import { DATA_SOURCES } from '../utils/dataCapabilities';
import { generateDataPoints } from '../utils/dateUtils';

/**
 * Generate mock adoption data (DAU/WAU/MAU)
 */
export const generateAdoptionData = (dataPoints, dataSource = DATA_SOURCES.ALL_TOOLS) => {
  const baseUsers = {
    [DATA_SOURCES.ALL_TOOLS]: 850,
    [DATA_SOURCES.CHATGPT]: 320,
    [DATA_SOURCES.TRUPEER]: 150,
    [DATA_SOURCES.VERCEL]: 200,
    [DATA_SOURCES.V0]: 180,
    [DATA_SOURCES.GLEAN]: 250,
    [DATA_SOURCES.ZOOM_AI]: 140,
    [DATA_SOURCES.GEMINI]: 90,
  };

  const base = baseUsers[dataSource] || 100;

  return dataPoints.map((point, index) => {
    const variance = Math.sin(index * 0.5) * 30 + Math.random() * 40;
    const trend = index * 2; // Slight upward trend

    return {
      date: format(point.date, 'yyyy-MM-dd'),
      label: point.label,
      fullLabel: point.fullLabel,
      activeUsers: Math.round(base + variance + trend),
      newUsers: Math.round((base + variance + trend) * 0.08 + Math.random() * 10),
      adoptionRate: Math.round((base + variance + trend) / 10) / 100, // Percentage
    };
  });
};

/**
 * Generate mock usage data (sessions, interactions)
 */
export const generateUsageData = (dataPoints, dataSource = DATA_SOURCES.ALL_TOOLS) => {
  const baseInteractions = {
    [DATA_SOURCES.ALL_TOOLS]: 5200,
    [DATA_SOURCES.CHATGPT]: 2100,
    [DATA_SOURCES.TRUPEER]: 800,
    [DATA_SOURCES.VERCEL]: 1100,
    [DATA_SOURCES.V0]: 950,
    [DATA_SOURCES.GLEAN]: 1500,
    [DATA_SOURCES.ZOOM_AI]: 650,
    [DATA_SOURCES.GEMINI]: 420,
  };

  const base = baseInteractions[dataSource] || 500;

  return dataPoints.map((point, index) => {
    const variance = Math.sin(index * 0.3) * 200 + Math.random() * 150;
    const trend = index * 15;

    return {
      date: format(point.date, 'yyyy-MM-dd'),
      label: point.label,
      fullLabel: point.fullLabel,
      totalInteractions: Math.round(base + variance + trend),
      sessions: Math.round((base + variance + trend) * 0.3),
      avgSessionDuration: Math.round(180 + Math.random() * 120), // seconds
      engagementScore: Math.round((60 + Math.random() * 30) * 10) / 10,
    };
  });
};

/**
 * Generate mock value realization data (cost savings, productivity)
 */
export const generateValueData = (dataPoints, dataSource = DATA_SOURCES.ALL_TOOLS) => {
  const baseValue = {
    [DATA_SOURCES.ALL_TOOLS]: 125000,
    [DATA_SOURCES.CHATGPT]: 45000,
    [DATA_SOURCES.TRUPEER]: 22000,
    [DATA_SOURCES.VERCEL]: 35000,
    [DATA_SOURCES.V0]: 28000,
    [DATA_SOURCES.GLEAN]: 38000,
    [DATA_SOURCES.ZOOM_AI]: 18000,
    [DATA_SOURCES.GEMINI]: 12000,
  };

  const base = baseValue[dataSource] || 10000;

  return dataPoints.map((point, index) => {
    const variance = Math.random() * 5000;
    const trend = index * 800;

    return {
      date: format(point.date, 'yyyy-MM-dd'),
      label: point.label,
      fullLabel: point.fullLabel,
      estimatedValue: Math.round(base + variance + trend),
      timeSaved: Math.round((base + variance + trend) / 50), // hours
      costSavings: Math.round((base + variance + trend) * 0.8),
    };
  });
};

/**
 * Generate mock credit usage data
 */
export const generateCreditUsageData = (dataPoints, dataSource = DATA_SOURCES.ALL_TOOLS) => {
  const baseCredits = {
    [DATA_SOURCES.ALL_TOOLS]: 85000,
    [DATA_SOURCES.CHATGPT]: 28000,
    [DATA_SOURCES.TRUPEER]: 15000,
    [DATA_SOURCES.VERCEL]: 22000,
    [DATA_SOURCES.V0]: 18000,
    [DATA_SOURCES.GLEAN]: 0, // No credit system
    [DATA_SOURCES.ZOOM_AI]: 12000,
    [DATA_SOURCES.GEMINI]: 8000,
  };

  const base = baseCredits[dataSource] || 5000;

  if (base === 0) {
    return dataPoints.map((point) => ({
      date: format(point.date, 'yyyy-MM-dd'),
      label: point.label,
      fullLabel: point.fullLabel,
      creditsUsed: 0,
      creditsCost: 0,
    }));
  }

  return dataPoints.map((point, index) => {
    const variance = Math.random() * 3000;
    const trend = index * 400;

    const credits = Math.round(base + variance + trend);
    return {
      date: format(point.date, 'yyyy-MM-dd'),
      label: point.label,
      fullLabel: point.fullLabel,
      creditsUsed: credits,
      creditsCost: Math.round(credits * 0.002 * 100) / 100, // $0.002 per credit
    };
  });
};

/**
 * Get mock KPI summary
 */
export const getKPISummary = (
  startDate,
  endDate,
  dataSource = DATA_SOURCES.ALL_TOOLS,
  granularity = 'daily'
) => {
  const dataPoints = generateDataPoints(startDate, endDate, granularity);
  const adoptionData = generateAdoptionData(dataPoints, dataSource);
  const usageData = generateUsageData(dataPoints, dataSource);
  const valueData = generateValueData(dataPoints, dataSource);
  const creditData = generateCreditUsageData(dataPoints, dataSource);

  // Calculate totals and averages
  const totalActiveUsers = Math.max(...adoptionData.map((d) => d.activeUsers));
  const avgActiveUsers = Math.round(
    adoptionData.reduce((sum, d) => sum + d.activeUsers, 0) / adoptionData.length
  );

  const totalInteractions = usageData.reduce((sum, d) => sum + d.totalInteractions, 0);
  const totalSessions = usageData.reduce((sum, d) => sum + d.sessions, 0);

  const totalValue = Math.round(valueData.reduce((sum, d) => sum + d.estimatedValue, 0));
  const totalTimeSaved = Math.round(valueData.reduce((sum, d) => sum + d.timeSaved, 0));

  const totalCredits = creditData.reduce((sum, d) => sum + d.creditsUsed, 0);
  const totalCost = Math.round(creditData.reduce((sum, d) => sum + d.creditsCost, 0) * 100) / 100;

  return {
    adoption: {
      totalActiveUsers,
      avgActiveUsers,
      peakUsers: totalActiveUsers,
      adoptionRate: Math.round((totalActiveUsers / 1000) * 100 * 10) / 10,
    },
    usage: {
      totalInteractions,
      totalSessions,
      avgSessionsPerDay: Math.round(totalSessions / dataPoints.length),
      avgEngagement: Math.round(
        (usageData.reduce((sum, d) => sum + d.engagementScore, 0) / usageData.length) * 10
      ) / 10,
    },
    value: {
      totalValue,
      totalTimeSaved,
      avgValuePerUser: Math.round(totalValue / totalActiveUsers),
      costSavings: Math.round(totalValue * 0.8),
    },
    credits: {
      totalCredits,
      totalCost,
      avgCreditPerUser: totalActiveUsers > 0 ? Math.round(totalCredits / totalActiveUsers) : 0,
    },
  };
};

/**
 * Get comparison KPIs
 */
export const getComparisonKPIs = (
  currentKPIs,
  previousKPIs
) => {
  const calculateChange = (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  return {
    adoption: {
      activeUsersChange: calculateChange(
        currentKPIs.adoption.totalActiveUsers,
        previousKPIs.adoption.totalActiveUsers
      ),
      adoptionRateChange: calculateChange(
        currentKPIs.adoption.adoptionRate,
        previousKPIs.adoption.adoptionRate
      ),
    },
    usage: {
      interactionsChange: calculateChange(
        currentKPIs.usage.totalInteractions,
        previousKPIs.usage.totalInteractions
      ),
      engagementChange: calculateChange(
        currentKPIs.usage.avgEngagement,
        previousKPIs.usage.avgEngagement
      ),
    },
    value: {
      valueChange: calculateChange(
        currentKPIs.value.totalValue,
        previousKPIs.value.totalValue
      ),
      timeSavedChange: calculateChange(
        currentKPIs.value.totalTimeSaved,
        previousKPIs.value.totalTimeSaved
      ),
    },
    credits: {
      creditsChange: calculateChange(
        currentKPIs.credits.totalCredits,
        previousKPIs.credits.totalCredits
      ),
      costChange: calculateChange(
        currentKPIs.credits.totalCost,
        previousKPIs.credits.totalCost
      ),
    },
  };
};

/**
 * Get last updated timestamp
 */
export const getLastUpdated = () => {
  // Simulate nightly update - set to 2 AM today
  const lastUpdate = startOfDay(new Date());
  lastUpdate.setHours(2, 0, 0, 0);
  
  // If it's before 2 AM, use yesterday's 2 AM
  if (new Date() < lastUpdate) {
    return subDays(lastUpdate, 1);
  }
  
  return lastUpdate;
};

/**
 * Get tool breakdown data
 */
export const getToolBreakdown = (startDate, endDate, granularity = 'daily') => {
  const tools = [
    DATA_SOURCES.CHATGPT,
    DATA_SOURCES.TRUPEER,
    DATA_SOURCES.VERCEL,
    DATA_SOURCES.V0,
    DATA_SOURCES.GLEAN,
    DATA_SOURCES.ZOOM_AI,
    DATA_SOURCES.GEMINI,
  ];

  return tools.map((tool) => {
    const kpis = getKPISummary(startDate, endDate, tool, granularity);
    return {
      tool,
      name: tool.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      ...kpis,
    };
  });
};
