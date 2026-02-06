# AI Metrics Dashboard

A comprehensive dashboard for tracking adoption, usage, value, and trend metrics across AI tools including Glean, ChatGPT, Zoom AI Companion, Trupeer, Vercel/V0, Gemini, and company-built agents.

## Features

### 📅 Advanced Date Range Filter

The dashboard includes a sophisticated date range filter that controls all time-based visualizations:

#### Preset Options
- **1W**: Last 7 days up to and including yesterday
- **1M**: Last 30 days up to and including yesterday (default on first load)
- **1Y**: Last 12 months up to yesterday
- **Past Month**: Last completed calendar month
- **Past Quarter**: Last completed quarter (Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec)
- **Past Half Year**: Last completed half year (Jan-Jun or Jul-Dec)

#### Custom Range Picker
- Select any start and end date within the allowed range
- Automatic validation ensures data integrity
- Clear error messages for invalid selections

#### Validation Rules
- ❌ No future dates allowed
- ❌ Dates must be within the last 12 months
- ✅ End date must be greater than or equal to start date
- ✅ Visual indication of disabled dates in the picker

#### Smart Features
- 🔄 Session persistence - your selected range is remembered during the session
- 📊 Unified control - one filter drives all charts, tables, and KPIs
- 🎯 Active preset highlighting
- 📱 Responsive design for mobile and desktop
- ♿ Full accessibility support (ARIA labels, keyboard navigation, screen readers)

### 📊 Dashboard Components

#### KPI Cards
- Total Users
- Active Users (with adoption rate)
- Total Sessions
- Average Session Duration
- Trend indicators (week-over-week, month-over-month)

#### Interactive Charts
- **Daily Usage Trends**: Line chart showing usage patterns over time
- **Users by Tool**: Pie chart displaying distribution across AI tools
- **Growth Trends**: Bar chart comparing week-over-week and month-over-month changes

#### Metrics Table
Comprehensive table showing per-tool metrics:
- User counts
- Session counts
- Adoption rates
- Value scores (color-coded: high/medium/low)
- Average session duration

### 🎨 Design Features
- Clean, modern UI with professional styling
- Color-coded visualizations for easy data interpretation
- Hover effects and smooth transitions
- Responsive grid layouts
- Loading states and error handling

## Technology Stack

- **React 19.2** - Modern UI framework
- **Vite 7.2** - Fast build tool and dev server
- **date-fns** - Comprehensive date utilities
- **Recharts** - Composable charting library
- **ESLint** - Code quality and consistency

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173` to see the dashboard.

### Build

Create a production build:

```bash
npm run build
```

### Lint

Check code quality:

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AIMetricsDashboard.jsx      # Main dashboard component
│   ├── AIMetricsDashboard.css
│   ├── DateRangeFilter.jsx         # Date range filter with presets
│   ├── DateRangeFilter.css
│   ├── KPICard.jsx                 # Reusable KPI card component
│   └── KPICard.css
├── services/
│   └── mockDataService.js          # Mock data generation for testing
├── utils/
│   └── dateUtils.js                # Date calculation and validation utilities
├── App.jsx                         # Root application component
├── App.css
├── index.css                       # Global styles
└── main.jsx                        # Application entry point
```

## Usage Examples

### Default Behavior
On first load, the dashboard displays the last 30 days of data (1M preset), with the date range clearly shown and the 1M button highlighted.

### Selecting a Preset
Click any preset button (1W, 1M, 1Y, etc.) to instantly update all visualizations to that time range. The selected preset is highlighted and the date range display updates.

### Using Custom Range
1. Click "▶ Custom Range" to expand the date picker
2. Select your desired start and end dates
3. Click "Apply Custom Range"
4. All visualizations update to show data for your custom range
5. The preset highlight clears, indicating a custom selection

### Validation Examples
- Attempting to select tomorrow: **Disabled in picker**
- Selecting a date 13 months ago: **Disabled in picker**
- Setting end date before start date: **Error message displayed**
- Valid range applied successfully: **All visuals refresh**

## Accessibility

The dashboard follows WCAG 2.1 guidelines:
- ✅ Keyboard navigation support for all interactive elements
- ✅ ARIA labels and roles for screen readers
- ✅ Focus indicators on all focusable elements
- ✅ Live regions for dynamic content updates
- ✅ Semantic HTML structure
- ✅ Sufficient color contrast ratios

## Contributing

Please refer to [Contributing.md](./Contributing.md) for:
- Git branching conventions
- Commit message format
- Pull request guidelines

## License

Private repository - All rights reserved.

## Support

For issues or questions, please create a GitHub issue or contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Ticket Reference**: EA-249
