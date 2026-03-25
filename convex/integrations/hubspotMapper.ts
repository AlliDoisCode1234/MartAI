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
    type: 'enumeration',
    options: ['signed_up', 'not_signed_up'],
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
    options: ['starter', 'engine', 'agency', 'enterprise'],
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

  // Admin User Funnel Milestones
  phoo_funnel_signup_started: {
    label: 'Funnel: Signup Started',
    description: 'User initiated the signup flow',
    type: 'booleancheckbox',
  },
  phoo_funnel_signup_completed: {
    label: 'Funnel: Signup Completed',
    description: 'User successfully created an account',
    type: 'booleancheckbox',
  },
  phoo_funnel_project_created: {
    label: 'Funnel: Project Created',
    description: 'User created their first SEO project',
    type: 'booleancheckbox',
  },
  phoo_funnel_gsc_connected: {
    label: 'Funnel: GSC Connected',
    description: 'User connected Google Search Console during onboarding',
    type: 'booleancheckbox',
  },
  phoo_funnel_keywords_imported: {
    label: 'Funnel: Keywords Imported',
    description: 'User successfully imported initial target keywords',
    type: 'booleancheckbox',
  },
  phoo_funnel_clusters_generated: {
    label: 'Funnel: Clusters Generated',
    description: 'User grouped keywords into semantic clusters',
    type: 'booleancheckbox',
  },
  phoo_funnel_brief_created: {
    label: 'Funnel: Brief Created',
    description: 'User generated or manually created a requested content brief',
    type: 'booleancheckbox',
  },
  phoo_funnel_content_published: {
    label: 'Funnel: Content Published',
    description: 'User successfully generated and published their first AI piece',
    type: 'booleancheckbox',
  },
} as const;

// ============================================================================
// DATA MAPPERS
// ============================================================================

/**
 * Map a Convex user to HubSpot contact properties.
 * Used by syncUserToHubspot action — includes project, onboarding, and PR data.
 */
export function mapUserToHubSpot(user: {
  email?: string;
  name?: string;
  role?: string;
  membershipTier?: string;
  onboardingStatus?: string;
  accountStatus?: string;
  acquisitionSource?: string;
  lastActiveAt?: number;
  onboardingSteps?: Record<string, boolean | string | number | undefined>;
  engagementMilestones?: {
    totalKeywords?: number;
    totalClusters?: number;
    totalPublished?: number;
  };
  projectCount?: number;
  primaryWebsite?: string;
  prScore?: number | null;
  prTier?: string | null;
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
    const validatedSource = (VALID_LEAD_SOURCES as readonly string[]).includes(
      user.acquisitionSource
    )
      ? user.acquisitionSource
      : 'waitlist_beta';
    props.phoo_lead_source = validatedSource;
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
  if (user.projectCount !== undefined) {
    props.phoo_project_count = user.projectCount;
  }
  if (user.primaryWebsite) {
    props.phoo_website = user.primaryWebsite;
  }

  // Onboarding abandon tracking
  props.phoo_signup_abandoned = false;

  // Onboarding step details
  if (user.onboardingSteps) {
    const steps = user.onboardingSteps;
    if (steps.signupCompleted !== undefined) {
      props.phoo_signup_completed = !!steps.signupCompleted;
    }
    if (steps.planSelected && typeof steps.planSelected === 'string') {
      props.phoo_plan = steps.planSelected;
    }
    if (steps.paymentCompleted !== undefined) {
      props.phoo_payment_completed = !!steps.paymentCompleted;
    }
    if (steps.projectCreated !== undefined) {
      props.phoo_project_created = !!steps.projectCreated;
    }
    if (steps.ga4Connected !== undefined) {
      props.phoo_ga4_connected = !!steps.ga4Connected;
    }
    if (steps.gscConnected !== undefined) {
      props.phoo_gsc_connected = !!steps.gscConnected;
    }
  }

  // PR Score
  if (user.prScore !== undefined && user.prScore !== null) {
    props.phoo_pr_score = user.prScore;
  }
  if (user.prTier) {
    props.phoo_pr_tier = user.prTier;
  }

  // Activity
  if (user.lastActiveAt) {
    props.phoo_last_activity = user.lastActiveAt;
  }

  return props;
}

// Valid options for phoo_lead_source in HubSpot (must match HubSpot property options)
const VALID_LEAD_SOURCES = [
  'waitlist_beta',
  'organic',
  'referral',
  'partner',
  'paid',
  'migration',
] as const;

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

  // Validate source against HubSpot's allowed options.
  // Forms pass 'phoo.ai' as source (tracking origin) but HubSpot only accepts
  // the enumeration values. Default to 'waitlist_beta' for waitlist signups.
  const validatedSource =
    data.source && (VALID_LEAD_SOURCES as readonly string[]).includes(data.source)
      ? data.source
      : 'waitlist_beta';

  const props: Record<string, string | number | boolean> = {
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
    // HubSpot has this as enumeration with options: signed_up, not_signed_up
    phoo_waitlist_signup: 'signed_up',
    phoo_lead_source: validatedSource,
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
 * Map prospect to HubSpot contact properties
 */
export function mapProspectToHubSpot(prospect: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  status?: string;
  monthlyRevenue?: number;
  timeline?: string;
  marketingFrustration?: string;
}): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {
    firstname: prospect.firstName || '',
    lastname: prospect.lastName || '',
  };

  if (prospect.phone) props.phone = prospect.phone;
  if (prospect.companyName) props.company = prospect.companyName;

  // Validate source against HubSpot options
  const validatedSource =
    prospect.source && (VALID_LEAD_SOURCES as readonly string[]).includes(prospect.source)
      ? prospect.source
      : 'organic';
  props.phoo_lead_source = validatedSource;

  if (prospect.status) {
    props.phoo_account_status = prospect.status;
  }

  return props;
}

/**
 * Map abandoned signup to HubSpot
 */
export function mapAbandonedSignupToHubSpot(data: {
  abandonedAtStep: string;
  firstName?: string;
}): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {
    phoo_signup_abandoned: true,
    phoo_abandoned_at_step: data.abandonedAtStep,
  };

  if (data.firstName) {
    props.firstname = data.firstName;
  }

  return props;
}

/**
 * Map API access request to HubSpot
 */
export function mapApiAccessToHubSpot(request: {
  companyName: string;
  useCase: string;
  expectedMonthlyVolume: string;
  status: string;
  contactName?: string;
}): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {
    company: request.companyName,
    phoo_api_access_requested: true,
    phoo_lead_source: 'organic',
  };

  if (request.contactName) {
    const nameParts = request.contactName.split(' ');
    props.firstname = nameParts[0] || '';
    props.lastname = nameParts.slice(1).join(' ') || '';
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
  churnRisk?: boolean;
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
  if (data.churnRisk !== undefined) {
    props.phoo_churn_risk = data.churnRisk;
  }

  return props;
}

/**
 * Map a subscription lifecycle change to HubSpot properties.
 * Used when subscription status changes (cancel, reactivate, etc.)
 */
export function mapLifecycleChangeToHubSpot(change: {
  accountStatus: string;
  membershipTier?: string;
  lifecyclestage?: string;
}): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {
    phoo_account_status: change.accountStatus,
  };

  if (change.membershipTier) {
    props.phoo_plan = change.membershipTier;
  }
  if (change.lifecyclestage) {
    props.lifecyclestage = change.lifecyclestage;
  }

  return props;
}
