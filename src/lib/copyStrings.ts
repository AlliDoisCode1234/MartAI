/**
 * Centralized Copy Strings
 *
 * All user-facing labels and descriptions in one place.
 * Makes it easy to maintain consistent terminology and prepare for i18n.
 */

export const SECTION_LABELS = {
  keywords: {
    title: 'Keywords',
    subtitle: 'What people are searching for',
    emptyState: 'No keywords yet',
    emptyAction: 'Find what your customers search for',
  },
  topicCurator: {
    title: 'Topic Curator',
    subtitle: 'AI-organized article topics',
    emptyState: 'No topics yet',
    emptyAction: "We'll group your keywords into article topics",
  },
  contentCalendar: {
    title: 'Content Calendar',
    subtitle: 'Your publishing schedule',
    emptyState: 'No schedule yet',
    emptyAction: "Plan when you'll publish each article",
  },
  articleStudio: {
    title: 'Article Studio',
    subtitle: 'Write, edit, publish',
    emptyState: 'No articles yet',
    emptyAction: 'AI writes your articles - you review and publish',
  },
} as const;

export const STEP_LABELS = {
  1: {
    title: 'Keywords',
    description: 'Discover what your customers search',
    action: 'Discover Keywords',
  },
  2: {
    title: 'Topic Curator',
    description: 'Group keywords into article topics',
    action: 'Curate Topics',
  },
  3: {
    title: 'Content Calendar',
    description: 'Schedule when to publish',
    action: 'Plan Schedule',
  },
  4: {
    title: 'Article Studio',
    description: 'Review and publish AI-written articles',
    action: 'View Articles',
  },
} as const;

/**
 * Humanize SEO metrics for non-expert users
 */
export const getDifficultyLabel = (
  difficulty: number
): { label: string; color: string; advice: string } => {
  if (difficulty <= 30) {
    return {
      label: 'Quick Win',
      color: 'green',
      advice: 'You can rank for this soon with quality content',
    };
  }
  if (difficulty <= 50) {
    return {
      label: 'Achievable',
      color: 'blue',
      advice: 'Solid opportunity with consistent effort',
    };
  }
  if (difficulty <= 70) {
    return {
      label: 'Competitive',
      color: 'orange',
      advice: 'Larger sites rank here - build authority first',
    };
  }
  return {
    label: 'Long Game',
    color: 'red',
    advice: 'Very competitive - consider easier variations',
  };
};

export const getVolumeLabel = (volume: number): { label: string; description: string } => {
  if (volume >= 10000) {
    return { label: 'High Volume', description: 'Lots of people searching' };
  }
  if (volume >= 1000) {
    return { label: 'Good Volume', description: 'Solid traffic potential' };
  }
  if (volume >= 100) {
    return { label: 'Moderate', description: 'Targeted audience' };
  }
  return { label: 'Niche', description: 'Small but qualified audience' };
};

export const getIntentLabel = (
  intent: string
): { label: string; advice: string; color: string } => {
  switch (intent) {
    case 'transactional':
      return {
        label: 'Ready to Buy',
        advice: 'Great for product/service pages',
        color: 'red',
      };
    case 'commercial':
      return {
        label: 'Comparing Options',
        advice: 'Reviews and comparisons work well',
        color: 'orange',
      };
    case 'informational':
      return {
        label: 'Want to Learn',
        advice: 'Perfect for blog posts and guides',
        color: 'blue',
      };
    case 'navigational':
      return {
        label: 'Looking for a Site',
        advice: 'Brand-focused content',
        color: 'gray',
      };
    default:
      return {
        label: 'General',
        advice: 'Flexible content type',
        color: 'gray',
      };
  }
};

/**
 * Map backend status values to human-readable labels
 */
export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  // Article/Brief statuses
  scheduled: { label: 'Scheduled', color: 'gray' },
  draft: { label: 'Draft', color: 'yellow' },
  in_progress: { label: 'Drafting', color: 'blue' },
  review: { label: 'Review', color: 'purple' },
  approved: { label: 'Approved', color: 'teal' },
  published: { label: 'Published', color: 'green' },

  // Cluster/Topic statuses
  active: { label: 'Active', color: 'green' },
  pending: { label: 'Pending', color: 'yellow' },
  archived: { label: 'Archived', color: 'gray' },
};

export const getStatusLabel = (status: string): { label: string; color: string } => {
  return STATUS_LABELS[status] || { label: status, color: 'gray' };
};

/**
 * Map backend terminology to frontend terminology
 * Useful for logging, debugging, and future migrations
 */
export const TERM_MAP = {
  // Backend → Frontend
  keywordClusters: 'topics',
  clusters: 'topics',
  briefs: 'articles',
  quarterlyPlans: 'contentCalendar',
  contentPlan: 'contentCalendar',
} as const;

/**
 * Humanize content check scores
 */
export const getPlagiarismLabel = (
  score: number
): { label: string; description: string; color: string } => {
  if (score >= 95) {
    return {
      label: 'Original',
      description: 'Content is almost entirely unique',
      color: 'green',
    };
  }
  if (score >= 90) {
    return {
      label: 'Mostly Original',
      description: 'A few phrases may match existing content',
      color: 'green',
    };
  }
  if (score >= 70) {
    return {
      label: 'Some Matches',
      description: 'Review highlighted sections for originality',
      color: 'orange',
    };
  }
  return {
    label: 'Needs Review',
    description: 'Significant overlap with existing content',
    color: 'red',
  };
};

export const getAiScoreLabel = (
  score: number
): { label: string; description: string; color: string } => {
  if (score <= 20) {
    return {
      label: 'Very Human',
      description: 'Reads like it was written by a person',
      color: 'green',
    };
  }
  if (score <= 35) {
    return {
      label: 'Natural',
      description: 'Good balance of human and AI assistance',
      color: 'green',
    };
  }
  if (score <= 60) {
    return {
      label: 'AI-Assisted',
      description: 'Some AI patterns detected - consider editing',
      color: 'orange',
    };
  }
  return {
    label: 'AI-Heavy',
    description: 'Content may be flagged by Google - humanize it',
    color: 'red',
  };
};

export const getReadabilityLabel = (
  score: number
): { label: string; description: string; color: string } => {
  if (score >= 80) {
    return {
      label: 'Very Easy',
      description: 'Anyone can understand this',
      color: 'green',
    };
  }
  if (score >= 60) {
    return {
      label: 'Easy',
      description: 'Most readers will follow along',
      color: 'green',
    };
  }
  if (score >= 40) {
    return {
      label: 'Moderate',
      description: 'May require some focus to understand',
      color: 'orange',
    };
  }
  return {
    label: 'Complex',
    description: 'Consider simplifying for wider audience',
    color: 'red',
  };
};

export const getOverallCheckStatus = (
  status: 'pass' | 'warning' | 'fail'
): { label: string; description: string; color: string; icon: string } => {
  switch (status) {
    case 'pass':
      return {
        label: 'Ready to Publish',
        description: 'All quality checks passed',
        color: 'green',
        icon: 'FiCheckCircle',
      };
    case 'warning':
      return {
        label: 'Review Recommended',
        description: 'Some issues detected - review before publishing',
        color: 'orange',
        icon: 'FiAlertTriangle',
      };
    case 'fail':
      return {
        label: 'Needs Improvement',
        description: 'Content needs work before publishing',
        color: 'red',
        icon: 'FiXCircle',
      };
  }
};
