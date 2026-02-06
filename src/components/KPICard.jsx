import './KPICard.css';

const KPICard = ({ title, value, subtitle, trend, icon }) => {
  const trendClass = trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral';
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  return (
    <div className="kpi-card" role="article" aria-label={`${title} KPI`}>
      <div className="kpi-header">
        <span className="kpi-icon" aria-hidden="true">{icon}</span>
        <h3 className="kpi-title">{title}</h3>
      </div>
      <div className="kpi-value" aria-label={`Value: ${value}`}>{value}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      {trend !== undefined && (
        <div className={`kpi-trend ${trendClass}`} aria-label={`Trend: ${trend}%`}>
          <span className="trend-icon">{trendIcon}</span>
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
