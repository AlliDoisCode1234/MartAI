import {
  FiEye,
  FiTrendingUp,
  FiMousePointer,
  FiActivity,
  FiZap,
  FiFileText,
  FiAward,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

/**
 * MartAI Rating tier configuration
 * Used for badge display and styling based on score tier
 *
 * NOTE: Uses icons instead of emojis for accessibility and color contrast.
 * Background colors are chosen for high contrast with white text.
 */
export const TIER_CONFIG: Record<
  string,
  { label: string; icon: IconType; textColor: string; bgColor: string }
> = {
  top_performer: {
    label: 'Top Performer',
    icon: FiAward,
    textColor: 'white',
    bgColor: 'purple.500',
  },
  super: {
    label: 'Super',
    icon: FiStar,
    textColor: 'white',
    bgColor: 'teal.500',
  },
  excellent: {
    label: 'Excellent',
    icon: FiStar,
    textColor: 'white',
    bgColor: 'green.500',
  },
  really_good: {
    label: 'Really Good',
    icon: FiCheckCircle,
    textColor: 'white',
    bgColor: 'green.400',
  },
  good: {
    label: 'Good',
    icon: FiCheckCircle,
    textColor: 'white',
    bgColor: 'blue.500',
  },
  fair: {
    label: 'Fair',
    icon: FiAlertCircle,
    textColor: 'gray.800',
    bgColor: 'yellow.300',
  },
  needs_work: {
    label: 'Needs Work',
    icon: FiXCircle,
    textColor: 'white',
    bgColor: 'red.500',
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
