import { differenceInDays, eachDayOfInterval, format } from 'date-fns';

// Mock AI tools
const AI_TOOLS = [
  { id: 'chatgpt', name: 'ChatGPT', category: 'Chat' },
  { id: 'github-copilot', name: 'GitHub Copilot', category: 'Code' },
  { id: 'midjourney', name: 'Midjourney', category: 'Image' },
  { id: 'cursor', name: 'Cursor', category: 'Code' },
  { id: 'claude', name: 'Claude', category: 'Chat' },
];

// Generate mock metrics data for a given date range
const generateMockData = (startDate, endDate, toolId) => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(date => {
    const baseUsage = Math.floor(Math.random() * 1000) + 500;
    const successRate = 0.85 + Math.random() * 0.12; // 85-97%
    const avgResponseTime = Math.floor(Math.random() * 500) + 200; // 200-700ms
    
    return {
      date: format(date, 'yyyy-MM-dd'),
      toolId,
      usage: baseUsage,
      successCount: Math.floor(baseUsage * successRate),
      failureCount: Math.floor(baseUsage * (1 - successRate)),
      avgResponseTime,
      uniqueUsers: Math.floor(Math.random() * 100) + 50,
      totalCost: (baseUsage * (Math.random() * 0.05 + 0.02)).toFixed(2),
    };
  });
};

// Aggregate metrics for overview KPIs
const aggregateMetrics = (data) => {
  return data.reduce((acc, item) => {
    return {
      totalUsage: acc.totalUsage + item.usage,
      totalSuccess: acc.totalSuccess + item.successCount,
      totalFailure: acc.totalFailure + item.failureCount,
      avgResponseTime: acc.avgResponseTime + item.avgResponseTime,
      uniqueUsers: Math.max(acc.uniqueUsers, item.uniqueUsers),
      totalCost: acc.totalCost + parseFloat(item.totalCost),
      count: acc.count + 1,
    };
  }, {
    totalUsage: 0,
    totalSuccess: 0,
    totalFailure: 0,
    avgResponseTime: 0,
    uniqueUsers: 0,
    totalCost: 0,
    count: 0,
  });
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API: Fetch overview metrics for all tools
export const fetchOverviewMetrics = async (startDate, endDate) => {
  await delay(300); // Simulate network delay
  
  const toolsData = AI_TOOLS.map(tool => {
    const data = generateMockData(startDate, endDate, tool.id);
    const aggregated = aggregateMetrics(data);
    
    const successRate = ((aggregated.totalSuccess / aggregated.totalUsage) * 100).toFixed(1);
    const avgResponseTime = Math.floor(aggregated.avgResponseTime / aggregated.count);
    
    return {
      toolId: tool.id,
      toolName: tool.name,
      category: tool.category,
      totalUsage: aggregated.totalUsage,
      successRate: parseFloat(successRate),
      avgResponseTime,
      uniqueUsers: aggregated.uniqueUsers,
      totalCost: aggregated.totalCost.toFixed(2),
      status: successRate >= 95 ? 'excellent' : successRate >= 90 ? 'good' : 'warning',
    };
  });
  
  return toolsData;
};

// Mock API: Fetch detailed trend data for a specific tool
export const fetchToolTrendData = async (toolId, startDate, endDate) => {
  await delay(400); // Simulate network delay
  
  const tool = AI_TOOLS.find(t => t.id === toolId);
  if (!tool) {
    throw new Error(`Tool ${toolId} not found`);
  }
  
  const dailyData = generateMockData(startDate, endDate, toolId);
  const aggregated = aggregateMetrics(dailyData);
  
  return {
    toolId: tool.id,
    toolName: tool.name,
    category: tool.category,
    summary: {
      totalUsage: aggregated.totalUsage,
      successRate: ((aggregated.totalSuccess / aggregated.totalUsage) * 100).toFixed(1),
      avgResponseTime: Math.floor(aggregated.avgResponseTime / aggregated.count),
      uniqueUsers: aggregated.uniqueUsers,
      totalCost: aggregated.totalCost.toFixed(2),
    },
    trends: dailyData.map(item => ({
      date: item.date,
      usage: item.usage,
      successRate: ((item.successCount / item.usage) * 100).toFixed(1),
      responseTime: item.avgResponseTime,
      users: item.uniqueUsers,
      cost: parseFloat(item.totalCost),
    })),
  };
};

// Mock API: Fetch aggregated stats across all tools
export const fetchAggregatedStats = async (startDate, endDate) => {
  await delay(250);
  
  const allToolsData = AI_TOOLS.map(tool => 
    generateMockData(startDate, endDate, tool.id)
  ).flat();
  
  const aggregated = aggregateMetrics(allToolsData);
  const dayCount = differenceInDays(endDate, startDate) + 1;
  
  return {
    totalRequests: aggregated.totalUsage,
    avgDailyRequests: Math.floor(aggregated.totalUsage / dayCount),
    overallSuccessRate: ((aggregated.totalSuccess / aggregated.totalUsage) * 100).toFixed(1),
    avgResponseTime: Math.floor(aggregated.avgResponseTime / aggregated.count),
    totalActiveUsers: aggregated.uniqueUsers * AI_TOOLS.length, // Simplified
    totalCost: aggregated.totalCost.toFixed(2),
    toolCount: AI_TOOLS.length,
  };
};

export { AI_TOOLS };
