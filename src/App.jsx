import { useState } from 'react';
import { DateRangeProvider } from './contexts/DateRangeContext';
import DashboardOverview from './pages/DashboardOverview';
import ToolDrilldown from './pages/ToolDrilldown';
import './App.css';

function App() {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
  };

  const handleBackToOverview = () => {
    setSelectedTool(null);
  };

  return (
    <DateRangeProvider>
      <div className="app">
        {selectedTool ? (
          <ToolDrilldown 
            toolId={selectedTool} 
            onBack={handleBackToOverview}
          />
        ) : (
          <DashboardOverview 
            onToolSelect={handleToolSelect}
          />
        )}
      </div>
    </DateRangeProvider>
  );
}

export default App;