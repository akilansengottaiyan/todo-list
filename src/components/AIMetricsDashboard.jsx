import { useState, useEffect } from 'react';
import DateRangeFilter from './DateRangeFilter';
import KPICard from './KPICard';
import { fetchMetricsData } from '../services/mockDataService';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './AIMetricsDashboard.css';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4', '#FFC107'];

const AIMetricsDashboard = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(() => {
    // Try to load from session storage
    const saved = sessionStorage.getItem('aiMetricsDateRange');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (dateRange) {
      loadMetricsData(dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  const loadMetricsData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const data = await fetchMetricsData(startDate, endDate);
      setMetricsData(data);
    } catch (error) {
      console.error('Error loading metrics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (startDate, endDate) => {
    const range = { start: startDate, end: endDate };
    setDateRange(range);
    
    // Persist to session storage
    sessionStorage.setItem('aiMetricsDateRange', JSON.stringify(range));
  };

  if (loading && !metricsData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>AI Metrics Dashboard</h1>
          <p>Centralized adoption, usage, value, and trend metrics across AI tools</p>
        </div>
        <DateRangeFilter 
          onDateRangeChange={handleDateRangeChange}
          initialStartDate={dateRange?.start}
          initialEndDate={dateRange?.end}
        />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading metrics data...</p>
        </div>
      </div>
    );
  }

  if (!metricsData) {
    return null;
  }

  const { kpis, dailyData, toolMetrics, trendsData } = metricsData;

  // Prepare data for pie chart
  const pieChartData = toolMetrics.map(tool => ({
    name: tool.tool,
    value: tool.users
  }));

  // Prepare data for trends chart
  const trendsChartData = trendsData.map(trend => ({
    tool: trend.tool,
    'Week over Week': trend.weekOverWeek,
    'Month over Month': trend.monthOverMonth
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>AI Metrics Dashboard</h1>
          <p>Centralized adoption, usage, value, and trend metrics across AI tools</p>
        </div>
        {loading && <div className="loading-indicator">Updating...</div>}
      </div>

      <DateRangeFilter 
        onDateRangeChange={handleDateRangeChange}
        initialStartDate={dateRange?.start}
        initialEndDate={dateRange?.end}
      />

      <section className="kpi-section" aria-label="Key Performance Indicators">
        <div className="kpi-grid">
          <KPICard
            title="Total Users"
            value={kpis.totalUsers.toLocaleString()}
            icon="👥"
            subtitle="Registered users"
          />
          <KPICard
            title="Active Users"
            value={kpis.activeUsers.toLocaleString()}
            icon="✨"
            subtitle={`${kpis.adoptionRate}% adoption rate`}
            trend={12.5}
          />
          <KPICard
            title="Total Sessions"
            value={kpis.totalSessions.toLocaleString()}
            icon="📊"
            subtitle="In selected period"
            trend={8.3}
          />
          <KPICard
            title="Avg Session Duration"
            value={`${kpis.avgSessionDuration} min`}
            icon="⏱️"
            subtitle="Per session"
            trend={-2.1}
          />
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card full-width">
          <h2>Daily Usage Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ChatGPT" stroke="#2196F3" strokeWidth={2} />
              <Line type="monotone" dataKey="Glean" stroke="#4CAF50" strokeWidth={2} />
              <Line type="monotone" dataKey="Gemini" stroke="#FF9800" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-row">
          <div className="chart-card">
            <h2>Users by Tool</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Growth Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tool" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: 'Change %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Week over Week" fill="#4CAF50" />
                <Bar dataKey="Month over Month" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="table-section">
        <h2>Tool Metrics Summary</h2>
        <div className="table-container">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Users</th>
                <th>Sessions</th>
                <th>Adoption Rate</th>
                <th>Value Score</th>
                <th>Avg Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {toolMetrics.map((tool, index) => (
                <tr key={index}>
                  <td className="tool-name">{tool.tool}</td>
                  <td>{tool.users.toLocaleString()}</td>
                  <td>{tool.sessions.toLocaleString()}</td>
                  <td>{tool.adoptionRate}%</td>
                  <td>
                    <span className={`value-score ${tool.valueScore > 85 ? 'high' : tool.valueScore > 75 ? 'medium' : 'low'}`}>
                      {tool.valueScore}
                    </span>
                  </td>
                  <td>{tool.avgDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AIMetricsDashboard;
