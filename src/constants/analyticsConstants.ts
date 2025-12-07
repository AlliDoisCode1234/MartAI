export interface KpiConfig {
  key: string;
  label: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  icon: string;
  description: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export const KPI_CONFIG: KpiConfig[] = [
  {
    key: 'sessions',
    label: 'Sessions',
    color: 'brand.orange',
    bgGradient: 'linear(135deg, #F7941E 0%, #FFB84D 100%)',
    borderColor: 'orange.300',
    icon: '👥',
    description: 'Organic traffic',
  },
  {
    key: 'clicks',
    label: 'Clicks',
    color: 'white',
    bgGradient: 'linear(135deg, #40DEC7 0%, #6EE8D4 100%)',
    borderColor: 'teal.300',
    icon: '🖱️',
    description: 'Search clicks',
  },
  {
    key: 'ctr',
    label: 'CTR',
    color: 'white',
    bgGradient: 'linear(135deg, #DEC1FF 0%, #E8D4FF 100%)',
    borderColor: 'purple.300',
    icon: '📊',
    suffix: '%',
    decimals: 1,
    description: 'Click-through rate',
  },
  {
    key: 'avgPosition',
    label: 'Avg Position',
    color: 'white',
    bgGradient: 'linear(135deg, #4299E1 0%, #63B3ED 100%)',
    borderColor: 'blue.300',
    icon: '📍',
    decimals: 1,
    description: 'Search ranking',
  },
  {
    key: 'leads',
    label: 'Leads',
    color: 'white',
    bgGradient: 'linear(135deg, #48BB78 0%, #68D391 100%)',
    borderColor: 'green.300',
    icon: '🎯',
    description: 'Conversions',
  },
  {
    key: 'revenue',
    label: 'Est. Revenue',
    color: 'white',
    bgGradient: 'linear(135deg, #38B2AC 0%, #4FD1C7 100%)',
    borderColor: 'teal.400',
    icon: '💰',
    prefix: '$',
    decimals: 0,
    description: 'Monthly estimate',
  },
];

export const ANALYTICS_TIME_RANGE_OPTIONS = [7, 30, 90] as const;
