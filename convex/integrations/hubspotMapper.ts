/**
 * HubSpot Data Mapper
 *
 * Centralized mapping between Convex data models and HubSpot custom properties.
 *
 * Property Naming Convention:
 * - All Phoo/MartAI properties use `phoo_` prefix (previously `martai_`)
 * - This prevents collisions with default HubSpot properties
 * - Internal names cannot be changed once created in HubSpot
 *
 * Required HubSpot Custom Properties (create in HubSpot Settings → Properties):
 * See HUBSPOT_CUSTOM_PROPERTIES below for the full list.
 */

// ============================================================================
// HUBSPOT CUSTOM PROPERTIES REGISTRY
// ============================================================================
// These must be created in HubSpot before use (Settings → Properties → Contacts)

export const HUBSPOT_CUSTOM_PROPERTIES = {
  // Acquisition & Source Tracking
  phoo_lead_source: {
    label: 'Phoo Lead Source',
    description: 'How the contact was acquired (waitlist_beta, organic, etc.)',
    type: 'enumeration',
    options: ['waitlist_beta', 'organic', 'referral', 'partner', 'paid', 'migration'],
  },
  phoo_acquisition_date: {
    label: 'Phoo Acquisition Date',
    description: 'When contact first entered the system',
    type: 'date',
  },
  phoo_waitlist_signup: {
    label: 'Phoo Waitlist Signup',
    description: 'Whether contact signed up via phoo.ai beta waitlist',
    type: 'booleancheckbox',
  },

  // Product Usage & Status
  phoo_onboarding_status: {
    label: 'Phoo Onboarding Status',
    description: 'Current onboarding state',
    type: 'enumeration',
    options: ['not_started', 'in_progress', 'completed'],
  },
  phoo_plan: {
    label: 'Phoo Plan',
    description: 'Current subscription tier',
    type: 'enumeration',
    options: ['free', 'solo', 'starter', 'growth', 'pro', 'enterprise'],
  },
  phoo_subscription_status: {
    label: 'Phoo Subscription Status',
    description: 'Payment/billing status aligned with Stripe lifecycle',
    type: 'enumeration',
    // Matches SubscriptionStatus type in subscriptionLifecycle.ts
    options: [
      'active',
      'trialing',
      'grace_period',
      'maintenance_mode',
      'past_due',
      'cancelled',
      'expired',
    ],
  },
  phoo_account_status: {
    label: 'Phoo Account Status',
    description: 'Account activity status',
    type: 'enumeration',
    options: ['active', 'inactive', 'churned', 'suspended'],
  },

  // Engagement Metrics
  phoo_project_count: {
    label: 'Phoo Project Count',
    description: 'Number of projects created',
    type: 'number',
  },
  phoo_pr_score: {
    label: 'Phoo Rating Score',
    description: 'Overall health score (0-100) measuring SEO readiness',
    type: 'number',
  },
  phoo_pr_tier: {
    label: 'Phoo Rating Tier',
    description: 'Health tier classification',
    type: 'enumeration',
    options: ['needs_work', 'building', 'growing', 'thriving'],
  },
  phoo_needs_attention: {
    label: 'Needs Attention',
    description: 'Account may need outreach or support',
    type: 'booleancheckbox',
  },
  phoo_last_activity: {
    label: 'Phoo Last Activity',
    description: 'Timestamp of last product activity',
    type: 'datetime',
  },

  // Integration Status
  phoo_ga4_connected: {
    label: 'Phoo GA4 Connected',
    description: 'Google Analytics 4 integration status',
    type: 'booleancheckbox',
  },
  phoo_gsc_connected: {
    label: 'Phoo GSC Connected',
    description: 'Google Search Console integration status',
    type: 'booleancheckbox',
  },
  phoo_website: {
    label: 'Phoo Website',
    description: 'Primary website URL in Phoo',
    type: 'string',
  },

  // Lifecycle & Conversion
  phoo_signup_abandoned: {
    label: 'Phoo Signup Abandoned',
    description: 'Whether signup was abandoned',
    type: 'booleancheckbox',
  },
  phoo_abandoned_at_step: {
    label: 'Phoo Abandoned At Step',
    description: 'Which step signup was abandoned at',
    type: 'enumeration',
    options: ['signup', 'plan', 'payment', 'onboarding'],
  },

  // API/Enterprise
  phoo_api_access_requested: {
    label: 'Phoo API Access Requested',
    description: 'Whether enterprise API access was requested',
    type: 'booleancheckbox',
  },
} as const;

// ============================================================================
// DATA MAPPERS
// ============================================================================

/**
 * Map a Convex user to HubSpot contact properties
 */
export function mapUserToHubSpot(user: {
  email?: string;
  name?: string;
  role?: string;
  membershipTier?: string;
  onboardingStatus?: string;
  accountStatus?: string;
  acquisitionSource?: string;
  acquisitionDate?: number;
  lastActiveAt?: number;
  onboardingSteps?: {
    ga4Connected?: boolean;
    gscConnected?: boolean;
  };
  engagementMilestones?: {
    totalKeywords?: number;
    totalClusters?: number;
    totalPublished?: number;
  };
}): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};

  // Parse name
  if (user.name) {
    const nameParts = user.name.split(' ');
    props.firstname = nameParts[0] || '';
    props.lastname = nameParts.slice(1).join(' ') || '';
  }

  // Acquisition
  if (user.acquisitionSource) {
    props.phoo_lead_source = user.acquisitionSource;
  }
  if (user.acquisitionDate) {
    props.phoo_acquisition_date = user.acquisitionDate;
  }

  // Product status
  if (user.membershipTier) {
    props.phoo_plan = user.membershipTier;
  }
  if (user.onboardingStatus) {
    props.phoo_onboarding_status = user.onboardingStatus;
  }
  if (user.accountStatus) {
    props.phoo_account_status = user.accountStatus;
  }

  // Activity
  if (user.lastActiveAt) {
    props.phoo_last_activity = user.lastActiveAt;
  }

  // Integrations
  if (user.onboardingSteps?.ga4Connected !== undefined) {
    props.phoo_ga4_connected = user.onboardingSteps.ga4Connected;
  }
  if (user.onboardingSteps?.gscConnected !== undefined) {
    props.phoo_gsc_connected = user.onboardingSteps.gscConnected;
  }

  return props;
}

/**
 * Map waitlist signup to HubSpot contact properties
 */
export function mapWaitlistToHubSpot(data: {
  email: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): Record<string, string | number | boolean> {
  // NOTE: We don't set phoo_acquisition_date because Convex runs in UTC
  // and we can't reliably determine the user's local date. HubSpot tracks
  // create date natively via the built-in 'createdate' property.

  const props: Record<string, string | number | boolean> = {
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    // HubSpot has this as dropdown with signed_up/not_signed_up options
    phoo_waitlist_signup: 'signed_up',
    // Always use waitlist_beta (phoo.ai is not in allowed options)
    phoo_lead_source: 'waitlist_beta',
    phoo_onboarding_status: 'not_started',
    phoo_account_status: 'inactive',
  };

  // UTM tracking via HubSpot's built-in analytics properties
  if (data.utmSource) {
    props.hs_analytics_source = data.utmSource;
  }
  if (data.utmMedium) {
    props.hs_analytics_medium = data.utmMedium;
  }
  if (data.utmCampaign) {
    props.hs_analytics_campaign = data.utmCampaign;
  }

  return props;
}

/**
 * Map Phoo Rating (PR) score update to HubSpot
 */
export function mapPRScoreToHubSpot(data: {
  prScore: number;
  prTier?: string;
  needsAttention?: boolean;
  lastActiveAt?: number;
}): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {
    phoo_pr_score: data.prScore,
    phoo_needs_attention: data.needsAttention ?? false,
  };

  if (data.prTier) {
    props.phoo_pr_tier = data.prTier;
  }
  if (data.lastActiveAt) {
    props.phoo_last_activity = data.lastActiveAt;
  }

  return props;
}

// ============================================================================
// PROPERTY MIGRATION NOTE
// ============================================================================
/**
 * MIGRATION: martai_* → phoo_*
 *
 * The existing hubspot.ts uses `martai_*` prefix. For consistency with the
 * phoo.ai brand, new properties should use `phoo_*` prefix.
 *
 * To migrate:
 * 1. Create new `phoo_*` properties in HubSpot
 * 2. Update mappers to use new names
 * 3. Run bulk sync to populate new fields
 * 4. Update any HubSpot workflows/lists to use new properties
 * 5. (Optional) Delete old `martai_*` properties
 *
 * For now, this mapper uses `phoo_*` for new waitlist signups.
 * Existing `martai_*` properties in hubspot.ts continue to work.
 */
