import { useState, useEffect } from 'react';
import { useDateRange } from '../hooks/useDateRange';
import { fetchOverviewMetrics, fetchAggregatedStats } from '../services/metricsApi';
import KPICard from '../components/KPICard';
import DateRangePicker from '../components/DateRangePicker';
import { format } from 'date-fns';
import './DashboardOverview.css';

const DashboardOverview = ({ onToolSelect }) => {
  const { dateRange, lastUpdated } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [toolMetrics, setToolMetrics] = useState([]);
  const [aggregatedStats, setAggregatedStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tools, stats] = await Promise.all([
          fetchOverviewMetrics(dateRange.startDate, dateRange.endDate),
          fetchAggregatedStats(dateRange.startDate, dateRange.endDate),
        ]);
        setToolMetrics(tools);
        setAggregatedStats(stats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">AI Metrics Dashboard</h1>
          <p className="dashboard-subtitle">Monitor and analyze AI tool performance across your organization</p>
        </div>
        <div className="last-updated">
          Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm:ss')}
        </div>
      </div>

      <DateRangePicker />

      {/* Aggregated Stats */}
      {aggregatedStats && (
        <div className="stats-grid">
          <KPICard
            title="Total Requests"
            value={aggregatedStats.totalRequests.toLocaleString()}
            subtitle={`${aggregatedStats.avgDailyRequests.toLocaleString()} per day avg`}
            icon="📊"
            status="good"
          />
          <KPICard
            title="Success Rate"
            value={`${aggregatedStats.overallSuccessRate}%`}
            subtitle="Across all tools"
            icon="✅"
            status={aggregatedStats.overallSuccessRate >= 95 ? 'excellent' : 'good'}
          />
          <KPICard
            title="Avg Response Time"
            value={`${aggregatedStats.avgResponseTime}ms`}
            subtitle="Average across tools"
            icon="⚡"
            status={aggregatedStats.avgResponseTime < 400 ? 'excellent' : 'good'}
          />
          <KPICard
            title="Total Cost"
            value={`$${parseFloat(aggregatedStats.totalCost).toLocaleString()}`}
            subtitle="Estimated spending"
            icon="💰"
            status="good"
          />
        </div>
      )}

      {/* Tools Overview */}
      <div className="tools-section">
        <h2 className="section-title">AI Tools Performance</h2>
        <div className="tools-grid">
          {toolMetrics.map(tool => (
            <div 
              key={tool.toolId} 
              className="tool-card"
              onClick={() => onToolSelect(tool.toolId)}
            >
              <div className="tool-header">
                <h3 className="tool-name">{tool.toolName}</h3>
                <span className="tool-category">{tool.category}</span>
              </div>
              
              <div className="tool-metrics">
                <div className="metric-row">
                  <span className="metric-label">Total Usage</span>
                  <span className="metric-value">{tool.totalUsage.toLocaleString()}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Success Rate</span>
                  <span className="metric-value" style={{ 
                    color: tool.successRate >= 95 ? '#10b981' : tool.successRate >= 90 ? '#3b82f6' : '#f59e0b' 
                  }}>
                    {tool.successRate}%
                  </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Avg Response</span>
                  <span className="metric-value">{tool.avgResponseTime}ms</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Unique Users</span>
                  <span className="metric-value">{tool.uniqueUsers}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Cost</span>
                  <span className="metric-value">${tool.totalCost}</span>
                </div>
              </div>
              
              <div className="tool-footer">
                <span 
                  className={`status-indicator status-${tool.status}`}
                >
                  {tool.status === 'excellent' ? '● Excellent' : 
                   tool.status === 'good' ? '● Good' : '● Needs Attention'}
                </span>
                <span className="view-details">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
