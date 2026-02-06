import './KPICard.css';

const KPICard = ({ title, value, subtitle, status, icon, trend }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return '#10b981'; // green
      case 'good':
        return '#3b82f6'; // blue
      case 'warning':
        return '#f59e0b'; // amber
      case 'error':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'warning':
        return 'Needs Attention';
      case 'error':
        return 'Critical';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className="kpi-icon" style={{ backgroundColor: `${getStatusColor()}15` }}>
          {icon}
        </div>
        {status && (
          <div 
            className="kpi-status-badge" 
            style={{ 
              backgroundColor: `${getStatusColor()}15`,
              color: getStatusColor()
            }}
          >
            {getStatusLabel()}
          </div>
        )}
      </div>
      
      <div className="kpi-content">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-value">{value}</div>
        {subtitle && <p className="kpi-subtitle">{subtitle}</p>}
        
        {trend && (
          <div className="kpi-trend">
            <span className={`trend-indicator ${trend.direction}`}>
              {trend.direction === 'up' ? '↑' : '↓'}
              {trend.value}
            </span>
            <span className="trend-label">vs previous period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
