import { useState, useEffect } from 'react';
import { useDateRange } from '../hooks/useDateRange';
import { fetchToolTrendData } from '../services/metricsApi';
import DateRangePicker from '../components/DateRangePicker';
import KPICard from '../components/KPICard';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import './ToolDrilldown.css';

const ToolDrilldown = ({ toolId, onBack }) => {
  const { dateRange, lastUpdated } = useDateRange();
  const [loading, setLoading] = useState(true);
  const [toolData, setToolData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchToolTrendData(toolId, dateRange.startDate, dateRange.endDate);
        setToolData(data);
      } catch (error) {
        console.error('Error loading tool data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (toolId) {
      loadData();
    }
  }, [toolId, dateRange]);

  if (loading) {
    return (
      <div className="drilldown-container">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading tool metrics...</p>
        </div>
      </div>
    );
  }

  if (!toolData) {
    return (
      <div className="drilldown-container">
        <p>No data available</p>
      </div>
    );
  }

  const formattedTrends = toolData.trends.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
    successRate: parseFloat(item.successRate),
  }));

  return (
    <div className="drilldown-container">
      <div className="drilldown-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Overview
        </button>
        <div className="header-content">
          <div>
            <h1 className="drilldown-title">
              {toolData.toolName}
              <span className="tool-category-badge">{toolData.category}</span>
            </h1>
            <p className="drilldown-subtitle">Detailed performance metrics and trends</p>
          </div>
          <div className="last-updated">
            Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm:ss')}
          </div>
        </div>
      </div>

      <DateRangePicker />

      {/* Summary KPIs */}
      <div className="summary-grid">
        <KPICard
          title="Total Usage"
          value={toolData.summary.totalUsage.toLocaleString()}
          subtitle="Total requests in period"
          icon="📈"
          status="good"
        />
        <KPICard
          title="Success Rate"
          value={`${toolData.summary.successRate}%`}
          subtitle="Successful requests"
          icon="✅"
          status={toolData.summary.successRate >= 95 ? 'excellent' : toolData.summary.successRate >= 90 ? 'good' : 'warning'}
        />
        <KPICard
          title="Avg Response Time"
          value={`${toolData.summary.avgResponseTime}ms`}
          subtitle="Average latency"
          icon="⚡"
          status={toolData.summary.avgResponseTime < 400 ? 'excellent' : 'good'}
        />
        <KPICard
          title="Total Cost"
          value={`$${parseFloat(toolData.summary.totalCost).toLocaleString()}`}
          subtitle="Estimated cost"
          icon="💰"
          status="good"
        />
      </div>

      {/* Trend Charts */}
      <div className="charts-section">
        {/* Usage Trend */}
        <div className="chart-card">
          <h3 className="chart-title">Usage Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedTrends}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="usage" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUsage)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate Trend */}
        <div className="chart-card">
          <h3 className="chart-title">Success Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                formatter={(value) => `${value}%`}
              />
              <Line 
                type="monotone" 
                dataKey="successRate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Trend */}
        <div className="chart-card">
          <h3 className="chart-title">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                formatter={(value) => `${value}ms`}
              />
              <Bar 
                dataKey="responseTime" 
                fill="#f59e0b" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Trend */}
        <div className="chart-card">
          <h3 className="chart-title">Daily Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedTrends}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Area 
                type="monotone" 
                dataKey="cost" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCost)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ToolDrilldown;
