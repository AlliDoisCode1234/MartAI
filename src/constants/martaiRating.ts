import { FiEye, FiTrendingUp, FiMousePointer, FiActivity, FiZap, FiFileText } from 'react-icons/fi';

/**
 * MartAI Rating tier configuration
 * Used for badge display and styling based on score tier
 */
export const TIER_CONFIG: Record<
  string,
  { label: string; emoji: string; color: string; bgGradient: string }
> = {
  top_performer: {
    label: 'Top Performer',
    emoji: '🏆',
    color: 'yellow.400',
    bgGradient: 'linear(135deg, #FFD700 0%, #FFA500 100%)',
  },
  super: {
    label: 'Super',
    emoji: '⭐',
    color: 'purple.400',
    bgGradient: 'linear(135deg, #9F7AEA 0%, #ED64A6 100%)',
  },
  excellent: {
    label: 'Excellent',
    emoji: '🌟',
    color: 'green.400',
    bgGradient: 'linear(135deg, #38A169 0%, #319795 100%)',
  },
  really_good: {
    label: 'Really Good',
    emoji: '✅',
    color: 'green.300',
    bgGradient: 'linear(135deg, #68D391 0%, #48BB78 100%)',
  },
  good: {
    label: 'Good',
    emoji: '🔵',
    color: 'blue.400',
    bgGradient: 'linear(135deg, #4299E1 0%, #00B5D8 100%)',
  },
  fair: {
    label: 'Fair',
    emoji: '🟡',
    color: 'yellow.500',
    bgGradient: 'linear(135deg, #ECC94B 0%, #ED8936 100%)',
  },
  needs_work: {
    label: 'Needs Work',
    emoji: '🔴',
    color: 'red.400',
    bgGradient: 'linear(135deg, #F56565 0%, #ED8936 100%)',
  },
};

/**
 * MartAI Rating score components configuration
 * Defines the breakdown metrics and their weights
 */
export const SCORE_COMPONENTS = [
  {
    key: 'visibility',
    label: 'Visibility',
    icon: FiEye,
    weight: 30,
    description: 'Average position',
  },
  {
    key: 'trafficHealth',
    label: 'Traffic',
    icon: FiTrendingUp,
    weight: 25,
    description: 'WoW growth',
  },
  {
    key: 'ctrPerformance',
    label: 'CTR',
    icon: FiMousePointer,
    weight: 15,
    description: 'Click-through rate',
  },
  {
    key: 'engagementQuality',
    label: 'Engagement',
    icon: FiActivity,
    weight: 10,
    description: 'Bounce rate',
  },
  {
    key: 'quickWinPotential',
    label: 'Quick Wins',
    icon: FiZap,
    weight: 10,
    description: 'Page 2 keywords',
  },
  {
    key: 'contentVelocity',
    label: 'Velocity',
    icon: FiFileText,
    weight: 10,
    description: 'Content pace',
  },
] as const;

export type ScoreComponentKey = (typeof SCORE_COMPONENTS)[number]['key'];
