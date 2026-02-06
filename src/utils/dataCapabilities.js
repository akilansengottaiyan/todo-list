import { GRANULARITY } from './dateUtils';

/**
 * Data source capabilities configuration
 * Defines what granularities and date ranges each tool supports
 */

export const DATA_SOURCES = {
  ALL_TOOLS: 'all_tools',
  CHATGPT: 'chatgpt',
  TRUPEER: 'trupeer',
  VERCEL: 'vercel',
  V0: 'v0',
  GLEAN: 'glean',
  ZOOM_AI: 'zoom_ai',
  GEMINI: 'gemini',
};

export const SOURCE_CAPABILITIES = {
  [DATA_SOURCES.ALL_TOOLS]: {
    name: 'All Tools',
    supportedGranularities: [
      GRANULARITY.DAILY,
      GRANULARITY.WEEKLY,
      GRANULARITY.MONTHLY,
      GRANULARITY.QUARTERLY,
      GRANULARITY.YEARLY,
    ],
    maxHistoricalDays: 730,
    dataMethod: 'aggregated',
    freshness: 'Daily (nightly)',
    limitations: null,
  },
  [DATA_SOURCES.CHATGPT]: {
    name: 'ChatGPT',
    supportedGranularities: [GRANULARITY.WEEKLY, GRANULARITY.MONTHLY],
    maxHistoricalDays: 365,
    dataMethod: 'scraping',
    freshness: 'Weekly',
    limitations: 'Data collected via web scraping. Only weekly and monthly aggregations available.',
  },
  [DATA_SOURCES.TRUPEER]: {
    name: 'Trupeer',
    supportedGranularities: [
      GRANULARITY.DAILY,
      GRANULARITY.WEEKLY,
      GRANULARITY.MONTHLY,
      GRANULARITY.QUARTERLY,
      GRANULARITY.YEARLY,
    ],
    maxHistoricalDays: 730,
    dataMethod: 'api',
    freshness: 'Daily',
    limitations: null,
  },
  [DATA_SOURCES.VERCEL]: {
    name: 'Vercel',
    supportedGranularities: [
      GRANULARITY.DAILY,
      GRANULARITY.WEEKLY,
      GRANULARITY.MONTHLY,
      GRANULARITY.QUARTERLY,
      GRANULARITY.YEARLY,
    ],
    maxHistoricalDays: 730,
    dataMethod: 'api',
    freshness: 'Daily',
    limitations: null,
  },
  [DATA_SOURCES.V0]: {
    name: 'V0',
    supportedGranularities: [
      GRANULARITY.DAILY,
      GRANULARITY.WEEKLY,
      GRANULARITY.MONTHLY,
      GRANULARITY.QUARTERLY,
      GRANULARITY.YEARLY,
    ],
    maxHistoricalDays: 730,
    dataMethod: 'api',
    freshness: 'Daily',
    limitations: null,
  },
  [DATA_SOURCES.GLEAN]: {
    name: 'Glean',
    supportedGranularities: [GRANULARITY.WEEKLY, GRANULARITY.MONTHLY],
    maxHistoricalDays: 365,
    dataMethod: 'api',
    freshness: 'Weekly',
    limitations: 'Limited to weekly and monthly aggregations. Custom date ranges supported but aggregated weekly.',
  },
  [DATA_SOURCES.ZOOM_AI]: {
    name: 'Zoom AI Companion',
    supportedGranularities: [GRANULARITY.WEEKLY, GRANULARITY.MONTHLY],
    maxHistoricalDays: 365,
    dataMethod: 'csv/scraping',
    freshness: 'Weekly',
    limitations: 'Data from CSV exports and scraping. Weekly and monthly views only.',
  },
  [DATA_SOURCES.GEMINI]: {
    name: 'Gemini',
    supportedGranularities: [GRANULARITY.MONTHLY],
    maxHistoricalDays: 180,
    dataMethod: 'limited',
    freshness: 'Monthly',
    limitations: 'Limited data availability. Monthly aggregation only. Historical data limited to 6 months.',
  },
};

/**
 * Check if a granularity is supported for a given data source
 * @param {string} dataSource - Data source identifier
 * @param {string} granularity - Granularity to check
 * @returns {boolean}
 */
export const isGranularitySupported = (dataSource, granularity) => {
  const capabilities = SOURCE_CAPABILITIES[dataSource];
  if (!capabilities) return false;
  return capabilities.supportedGranularities.includes(granularity);
};

/**
 * Get available granularities for a data source
 * @param {string} dataSource - Data source identifier
 * @returns {Array<string>}
 */
export const getAvailableGranularities = (dataSource) => {
  const capabilities = SOURCE_CAPABILITIES[dataSource];
  return capabilities ? capabilities.supportedGranularities : [];
};

/**
 * Get tooltip message for disabled granularity
 * @param {string} dataSource - Data source identifier
 * @param {string} granularity - Granularity
 * @returns {string|null}
 */
export const getGranularityTooltip = (dataSource, granularity) => {
  if (isGranularitySupported(dataSource, granularity)) {
    return null;
  }

  const capabilities = SOURCE_CAPABILITIES[dataSource];
  if (!capabilities) return 'Data source not available';

  const supportedList = capabilities.supportedGranularities
    .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
    .join(', ');

  return `${capabilities.name} only supports: ${supportedList}`;
};

/**
 * Get maximum historical days for a data source
 * @param {string} dataSource - Data source identifier
 * @returns {number}
 */
export const getMaxHistoricalDays = (dataSource) => {
  const capabilities = SOURCE_CAPABILITIES[dataSource];
  return capabilities ? capabilities.maxHistoricalDays : 730;
};

/**
 * Get data freshness information
 * @param {string} dataSource - Data source identifier
 * @returns {string}
 */
export const getDataFreshness = (dataSource) => {
  const capabilities = SOURCE_CAPABILITIES[dataSource];
  return capabilities ? capabilities.freshness : 'Unknown';
};

/**
 * Get source limitations message
 * @param {string} dataSource - Data source identifier
 * @returns {string|null}
 */
export const getSourceLimitations = (dataSource) => {
  const capabilities = SOURCE_CAPABILITIES[dataSource];
  return capabilities ? capabilities.limitations : null;
};

/**
 * Get default granularity for a data source
 * @param {string} dataSource - Data source identifier
 * @returns {string}
 */
export const getDefaultGranularity = (dataSource) => {
  const capabilities = SOURCE_CAPABILITIES[dataSource];
  if (!capabilities || capabilities.supportedGranularities.length === 0) {
    return GRANULARITY.DAILY;
  }

  // Prefer daily if available, otherwise use the first supported granularity
  if (capabilities.supportedGranularities.includes(GRANULARITY.DAILY)) {
    return GRANULARITY.DAILY;
  }

  return capabilities.supportedGranularities[0];
};
