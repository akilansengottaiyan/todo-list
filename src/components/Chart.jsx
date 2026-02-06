import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

const Chart = ({ 
  data, 
  dataKeys, 
  title, 
  type = 'line',
  height = 300,
  showComparison = false,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="chart-container loading">
        <div className="chart-skeleton"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No data available for the selected date range</p>
        </div>
      </div>
    );
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const comparisonColors = ['#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#c4b5fd'];

  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const DataComponent = type === 'bar' ? Bar : Line;

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="label" 
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
              padding: '12px',
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          
          {dataKeys.map((key, index) => {
            if (type === 'bar') {
              return (
                <Bar 
                  key={key.key}
                  dataKey={key.key}
                  name={key.name}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              );
            } else {
              return (
                <Line
                  key={key.key}
                  type="monotone"
                  dataKey={key.key}
                  name={key.name}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              );
            }
          })}
          
          {showComparison && dataKeys.map((key, index) => {
            const comparisonKey = `${key.key}_comparison`;
            if (data[0] && data[0][comparisonKey] !== undefined) {
              if (type === 'bar') {
                return (
                  <Bar
                    key={comparisonKey}
                    dataKey={comparisonKey}
                    name={`${key.name} (Previous)`}
                    fill={comparisonColors[index % comparisonColors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                );
              } else {
                return (
                  <Line
                    key={comparisonKey}
                    type="monotone"
                    dataKey={comparisonKey}
                    name={`${key.name} (Previous)`}
                    stroke={comparisonColors[index % comparisonColors.length]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 2 }}
                  />
                );
              }
            }
            return null;
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
