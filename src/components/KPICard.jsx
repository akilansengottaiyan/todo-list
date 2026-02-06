import './KPICard.css';

const KPICard = ({ title, value, subtitle, change, icon, loading = false }) => {
  if (loading) {
    return (
      <div className="kpi-card loading">
        <div className="kpi-skeleton"></div>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (change === null || change === undefined || change === 0) return null;
    return change > 0 ? '↑' : '↓';
  };

  const getTrendClass = () => {
    if (change === null || change === undefined || change === 0) return '';
    return change > 0 ? 'positive' : 'negative';
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className="kpi-title">{title}</span>
      </div>
      
      <div className="kpi-value">{formatValue(value)}</div>
      
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      
      {change !== null && change !== undefined && (
        <div className={`kpi-change ${getTrendClass()}`}>
          <span className="change-icon">{getTrendIcon()}</span>
          <span className="change-value">{Math.abs(change)}%</span>
          <span className="change-label">vs comparison</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
