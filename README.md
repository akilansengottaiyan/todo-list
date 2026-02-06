# 📊 Enterprise AI Metrics Dashboard

A comprehensive dashboard for tracking adoption, usage, and value realization across enterprise AI tools. Built with **React + Vite**, featuring advanced date range filtering and multi-tool analytics.

---

## 🚀 Features

### Date Range Filter (EA-249)
- **Presets**: Today, Yesterday, Last 7/14/30 days, This/Last week/month/quarter/year
- **Custom Range**: Calendar picker with start and end date selection
- **Granularity Selection**: Daily, Weekly, Monthly, Quarterly, Yearly views
- **Comparison Features**: Previous Period and Year-over-Year comparisons
- **Data Source Adaptation**: Automatically adjusts available options based on tool capabilities
- **Validation**: Enforces date range limits and prevents invalid selections
- **Persistence**: Remembers last-used filter settings via localStorage

### Dashboard Views
- **Overview**: High-level KPIs and trend visualizations across all metrics
- **Tool Breakdown**: Detailed analytics for individual AI tools
- **KPI Cards**: Active users, interactions, estimated value, engagement scores
- **Interactive Charts**: Line and bar charts with comparison overlays
- **Real-time Updates**: All views update automatically when filters change

### Data Source Support
- **ChatGPT**: Weekly/Monthly aggregation (web scraping)
- **Trupeer**: Full granularity support (Daily-Yearly via API)
- **Vercel**: Full granularity support (Daily-Yearly via API)
- **V0**: Full granularity support (Daily-Yearly via API)
- **Glean**: Weekly/Monthly aggregation (API)
- **Zoom AI Companion**: Weekly/Monthly (CSV/scraping)
- **Gemini**: Monthly only (limited historical data)

---

## 🛠️ Tech Stack

- **React** 19.2 (Hooks)
- **Vite** 7.2 (Build tool)
- **date-fns** (Date manipulation)
- **react-datepicker** (Date picker component)
- **recharts** (Data visualization)
- **localStorage API** (State persistence)

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/akilansengottaiyan/todo-list.git
cd todo-list
git checkout cursor/ai-metrics-date-filter-8efc
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📋 Usage

### Date Range Filter

1. Click the date range button to open the filter dropdown
2. Select a preset or choose "Custom Range" for specific dates
3. Choose your desired granularity (Daily, Weekly, etc.)
4. Optionally enable comparison (Previous Period or Year-over-Year)
5. Click "Apply" to update all dashboard views

### Data Source Selection

Use the data source dropdown to view metrics for:
- All Tools (aggregated view)
- Individual tools (ChatGPT, Trupeer, Vercel, etc.)

The filter automatically adjusts available granularities based on the selected tool's capabilities.

### Limitations Indicators

When a tool has limited data capabilities:
- Unsupported granularities are disabled with tooltips
- Information banners explain limitations
- The system prevents invalid selections

---

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── DateRangeFilter.jsx    # Main date filter component
│   ├── Dashboard.jsx           # Dashboard layout and orchestration
│   ├── KPICard.jsx            # Individual KPI display cards
│   └── Chart.jsx              # Recharts wrapper component
├── utils/
│   ├── dateUtils.js           # Date manipulation utilities
│   └── dataCapabilities.js    # Data source configuration
├── data/
│   └── mockData.js            # Mock data generation
└── App.jsx                    # Application root
```

### Key Concepts

**Date Utilities**: Centralized date manipulation using date-fns for:
- Preset date range calculations
- Comparison period generation
- Data point generation by granularity
- Date range validation

**Data Capabilities**: Configuration-driven approach to handle heterogeneous data sources:
- Define supported granularities per tool
- Specify historical data limits
- Document data collection methods
- Provide user-facing limitation messages

**Mock Data Layer**: Realistic data generation simulating:
- dim_date dimension table
- fact_tool_adoption_daily/weekly tables
- fact_tool_usage_event tables
- fact_credit_usage tables
- fact_value_realization tables

---

## 🧪 Testing

The implementation includes:

✅ Date preset calculations  
✅ Custom range validation  
✅ Granularity enforcement  
✅ Comparison period calculations  
✅ KPI aggregation logic  
✅ Chart data transformation  
✅ Empty and error states  
✅ localStorage persistence  

---

## 📝 Implementation Notes

### Acceptance Criteria Met

- [x] Users can select any supported preset or custom range
- [x] All dashboard views update correctly without errors
- [x] Granularity enforcement works with clear messaging
- [x] WoW/MoM/QoQ/YoY calculations are accurate
- [x] Performance is acceptable using pre-aggregated data patterns
- [x] Data freshness indicator remains visible
- [x] Validation prevents invalid date selections
- [x] Source constraints are enforced with helpful tooltips

### Future Enhancements

- Real API integration replacing mock data
- Backend query optimization for large date ranges
- Additional drill-down views (function, organization)
- Export functionality for reports
- Advanced filtering (by team, function, etc.)
- Timezone selection for global organizations

---

## 🤝 Contributing

See [Contributing.md](./Contributing.md) for:
- Branching conventions
- Commit message format
- Pull request guidelines

---

## 📄 License

This project is private and proprietary.

---

## 📞 Contact

For questions or issues, contact the dashboard team or create an issue in the repository.
