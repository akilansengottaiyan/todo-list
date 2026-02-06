import { useState, useEffect } from 'react';
import DateRangeFilter from './DateRangeFilter';
import KPICard from './KPICard';
import Chart from './Chart';
import { DATA_SOURCES, SOURCE_CAPABILITIES } from '../utils/dataCapabilities';
import { COMPARISON_TYPE, generateDataPoints } from '../utils/dateUtils';
import {
  getKPISummary,
  getComparisonKPIs,
  generateAdoptionData,
  generateUsageData,
  generateValueData,
  generateCreditUsageData,
  getLastUpdated,
  getToolBreakdown,
} from '../data/mockData';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedDataSource, setSelectedDataSource] = useState(DATA_SOURCES.ALL_TOOLS);
  const [dateRangeConfig, setDateRangeConfig] = useState(null);
  const [currentKPIs, setCurrentKPIs] = useState(null);
  const [comparisonKPIs, setComparisonKPIs] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [toolBreakdown, setToolBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview'); // overview, tools, functions

  useEffect(() => {
    if (dateRangeConfig) {
      updateDashboardData();
    }
  }, [dateRangeConfig, selectedDataSource]);

  const updateDashboardData = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const { startDate, endDate, granularity, comparisonType, comparisonRange } = dateRangeConfig;

    // Generate data points
    const dataPoints = generateDataPoints(startDate, endDate, granularity);

    // Get current period KPIs
    const currentPeriodKPIs = getKPISummary(startDate, endDate, selectedDataSource, granularity);
    setCurrentKPIs(currentPeriodKPIs);

    // Get comparison data if enabled
    if (comparisonType !== COMPARISON_TYPE.NONE && comparisonRange) {
      const previousPeriodKPIs = getKPISummary(
        comparisonRange.startDate,
        comparisonRange.endDate,
        selectedDataSource,
        granularity
      );
      const comparison = getComparisonKPIs(currentPeriodKPIs, previousPeriodKPIs);
      setComparisonKPIs(comparison);
    } else {
      setComparisonKPIs(null);
    }

    // Generate chart data
    const adoptionData = generateAdoptionData(dataPoints, selectedDataSource);
    const usageData = generateUsageData(dataPoints, selectedDataSource);
    const valueData = generateValueData(dataPoints, selectedDataSource);
    const creditData = generateCreditUsageData(dataPoints, selectedDataSource);

    // Combine data for charts
    const combinedChartData = dataPoints.map((point, index) => ({
      label: point.label,
      fullLabel: point.fullLabel,
      activeUsers: adoptionData[index].activeUsers,
      newUsers: adoptionData[index].newUsers,
      interactions: usageData[index].totalInteractions,
      sessions: usageData[index].sessions,
      engagement: usageData[index].engagementScore,
      value: valueData[index].estimatedValue,
      timeSaved: valueData[index].timeSaved,
      credits: creditData[index].creditsUsed,
      cost: creditData[index].creditsCost,
    }));

    setChartData(combinedChartData);

    // Get tool breakdown for tools view
    if (selectedDataSource === DATA_SOURCES.ALL_TOOLS) {
      const breakdown = getToolBreakdown(startDate, endDate, granularity);
      setToolBreakdown(breakdown);
    }

    setLoading(false);
  };

  const handleDateRangeChange = (config) => {
    setDateRangeConfig(config);
  };

  const getKPIChange = (category, metric) => {
    if (!comparisonKPIs) return null;
    return comparisonKPIs[category]?.[`${metric}Change`] || null;
  };

  const lastUpdated = getLastUpdated();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Enterprise AI Metrics Dashboard</h1>
          <p className="dashboard-subtitle">
            Track adoption, usage, and value realization across AI tools
          </p>
        </div>
        
        <div className="header-controls">
          <select 
            className="data-source-selector"
            value={selectedDataSource}
            onChange={(e) => setSelectedDataSource(e.target.value)}
          >
            {Object.entries(SOURCE_CAPABILITIES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="dashboard-filters">
        <DateRangeFilter 
          dataSource={selectedDataSource}
          onChange={handleDateRangeChange}
        />
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        {selectedDataSource === DATA_SOURCES.ALL_TOOLS && (
          <button 
            className={`tab ${activeView === 'tools' ? 'active' : ''}`}
            onClick={() => setActiveView('tools')}
          >
            Tool Breakdown
          </button>
        )}
      </div>

      {activeView === 'overview' && (
        <div className="dashboard-content">
          <section className="kpi-section">
            <h2>Key Metrics</h2>
            <div className="kpi-grid">
              <KPICard
                icon="👥"
                title="Active Users"
                value={currentKPIs?.adoption.totalActiveUsers}
                subtitle={`Avg: ${currentKPIs?.adoption.avgActiveUsers || 0}`}
                change={getKPIChange('adoption', 'activeUsers')}
                loading={loading}
              />
              <KPICard
                icon="⚡"
                title="Total Interactions"
                value={currentKPIs?.usage.totalInteractions}
                subtitle={`${currentKPIs?.usage.totalSessions || 0} sessions`}
                change={getKPIChange('usage', 'interactions')}
                loading={loading}
              />
              <KPICard
                icon="💰"
                title="Estimated Value"
                value={`$${currentKPIs?.value.totalValue.toLocaleString() || 0}`}
                subtitle={`${currentKPIs?.value.totalTimeSaved || 0} hours saved`}
                change={getKPIChange('value', 'value')}
                loading={loading}
              />
              <KPICard
                icon="🎯"
                title="Engagement Score"
                value={currentKPIs?.usage.avgEngagement}
                subtitle="Out of 100"
                change={getKPIChange('usage', 'engagement')}
                loading={loading}
              />
            </div>
          </section>

          <section className="charts-section">
            <h2>Trends & Analytics</h2>
            
            <Chart
              title="Active Users Over Time"
              data={chartData}
              dataKeys={[
                { key: 'activeUsers', name: 'Active Users' },
                { key: 'newUsers', name: 'New Users' },
              ]}
              type="line"
              height={350}
              showComparison={comparisonKPIs !== null}
              loading={loading}
            />

            <Chart
              title="Usage Activity"
              data={chartData}
              dataKeys={[
                { key: 'interactions', name: 'Interactions' },
                { key: 'sessions', name: 'Sessions' },
              ]}
              type="bar"
              height={350}
              showComparison={comparisonKPIs !== null}
              loading={loading}
            />

            <div className="chart-row">
              <div className="chart-half">
                <Chart
                  title="Value Realization"
                  data={chartData}
                  dataKeys={[
                    { key: 'value', name: 'Estimated Value ($)' },
                  ]}
                  type="line"
                  height={300}
                  loading={loading}
                />
              </div>
              <div className="chart-half">
                <Chart
                  title="Engagement Score"
                  data={chartData}
                  dataKeys={[
                    { key: 'engagement', name: 'Score' },
                  ]}
                  type="line"
                  height={300}
                  loading={loading}
                />
              </div>
            </div>

            {currentKPIs?.credits.totalCredits > 0 && (
              <Chart
                title="Credit Usage"
                data={chartData}
                dataKeys={[
                  { key: 'credits', name: 'Credits Used' },
                ]}
                type="bar"
                height={300}
                loading={loading}
              />
            )}
          </section>

          <section className="metadata-section">
            <div className="metadata-card">
              <span className="metadata-label">Last Updated:</span>
              <span className="metadata-value">{format(lastUpdated, 'MMM dd, yyyy HH:mm')}</span>
            </div>
            <div className="metadata-card">
              <span className="metadata-label">Data Source:</span>
              <span className="metadata-value">
                {SOURCE_CAPABILITIES[selectedDataSource]?.name || 'All Tools'}
              </span>
            </div>
            <div className="metadata-card">
              <span className="metadata-label">Freshness:</span>
              <span className="metadata-value">
                {SOURCE_CAPABILITIES[selectedDataSource]?.freshness || 'N/A'}
              </span>
            </div>
          </section>
        </div>
      )}

      {activeView === 'tools' && selectedDataSource === DATA_SOURCES.ALL_TOOLS && (
        <div className="dashboard-content">
          <section className="tools-section">
            <h2>Tool Breakdown</h2>
            <div className="tools-grid">
              {toolBreakdown.map((tool) => (
                <div key={tool.tool} className="tool-card">
                  <h3>{tool.name}</h3>
                  <div className="tool-metrics">
                    <div className="tool-metric">
                      <span className="metric-label">Active Users</span>
                      <span className="metric-value">{tool.adoption.totalActiveUsers}</span>
                    </div>
                    <div className="tool-metric">
                      <span className="metric-label">Interactions</span>
                      <span className="metric-value">{tool.usage.totalInteractions.toLocaleString()}</span>
                    </div>
                    <div className="tool-metric">
                      <span className="metric-label">Value</span>
                      <span className="metric-value">${tool.value.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="tool-metric">
                      <span className="metric-label">Engagement</span>
                      <span className="metric-value">{tool.usage.avgEngagement}/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
