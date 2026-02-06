# 📊 AI Metrics Dashboard

A comprehensive metrics dashboard for monitoring AI tool performance across your organization, built with **React + Vite**.

---

## 🚀 Features

- **Flexible Date Range Selection**: Custom date picker with presets (Last 7 Days, Last Month, Last Quarter, Last Year) and custom date ranges
- **Overview Dashboard**: Aggregated KPIs showing total requests, success rates, response times, and costs across all AI tools
- **Tool-Specific Drill-down**: Detailed trend charts and historical data for individual AI tools
- **Real-time Updates**: Dashboard automatically updates when date range changes
- **Modern UI**: Clean, responsive interface with color-coded status indicators
- **Performance Tracking**: Monitor usage, success rates, response times, and costs
- **Last-Updated Timestamp**: Always know when data was last refreshed

---

## 🛠️ Tech Stack

- **React** (Hooks + Context API)
- **Vite**
- **Recharts** (Data visualization)
- **React DatePicker** (Date range selection)
- **date-fns** (Date manipulation)

---

## 📦 Installation

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

---

## 📋 Features Implemented (EA-249)

### Date Range Filter
- ✅ Preset date ranges (Last 7 Days, Last Month, Last Quarter, Last Year)
- ✅ Custom start and end date selection
- ✅ Date range validation and boundary handling
- ✅ Persistent selection across dashboard views

### Dashboard Overview
- ✅ Aggregated KPIs across all AI tools
- ✅ Individual tool performance cards
- ✅ Color-coded status indicators
- ✅ Click-through to tool drill-down views

### Tool Drill-down
- ✅ Detailed trend charts (Usage, Success Rate, Response Time, Cost)
- ✅ Summary KPI cards for selected tool
- ✅ Historical data visualization
- ✅ Back navigation to overview

### State Management
- ✅ React Context for date range state
- ✅ Automatic data refresh on date range change
- ✅ Last-updated timestamp tracking

### Mock API
- ✅ Simulated metrics data generation
- ✅ Time-based aggregations
- ✅ Multiple AI tools support (ChatGPT, GitHub Copilot, Cursor, Claude, Midjourney)

---

