/**
 * Analytics Components Index
 *
 * Re-exports all analytics-related components.
 */

// Default exports need different syntax
import AdhocAnalyzer from './AdhocAnalyzer';
import InsightCard from './InsightCard';
import InsightsList from './InsightsList';

export { AdhocAnalyzer, InsightCard, InsightsList };

// Named exports
export { AnalyticsHeader } from './AnalyticsHeader';
export { AnalyticsSetupWizard } from './AnalyticsSetupWizard';
export { AnalyticsSkeleton } from './AnalyticsSkeleton';
export { IntegrationPromptBanner } from './IntegrationPromptBanner';
export { KPICard } from './KPICard';
export { LeadsGeneratedChart } from './LeadsGeneratedChart';
export { TrafficGrowthChart } from './TrafficGrowthChart';
