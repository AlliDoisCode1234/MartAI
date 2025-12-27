/**
 * Email Notification Triggers
 *
 * Email templates and trigger definitions.
 * Integrates with Resend API.
 *
 * Reference: docs/project/USER_FLOW_LDD.md
 * Dependency: RESEND-001 (Resend API Key)
 */

// Email trigger types
export const EMAIL_TRIGGERS = {
  // Onboarding
  WELCOME: 'welcome',
  ONBOARDING_REMINDER: 'onboarding_reminder',

  // Phase transitions
  PHASE_UNLOCK: 'phase_unlock',
  FIRST_KEYWORDS: 'first_keywords',
  FIRST_CLUSTER: 'first_cluster',
  FIRST_BRIEF: 'first_brief',
  FIRST_PUBLISH: 'first_publish',

  // Re-engagement
  INACTIVE_7_DAYS: 'inactive_7_days',
  INACTIVE_14_DAYS: 'inactive_14_days',
  INCOMPLETE_BRIEF: 'incomplete_brief',

  // Progress
  WEEKLY_DIGEST: 'weekly_digest',
  MONTHLY_REPORT: 'monthly_report',

  // System
  PASSWORD_RESET: 'password_reset',
  INTEGRATION_EXPIRED: 'integration_expired',
} as const;

export type EmailTrigger = (typeof EMAIL_TRIGGERS)[keyof typeof EMAIL_TRIGGERS];

// Email template configuration
export interface EmailTemplate {
  trigger: EmailTrigger;
  subject: string;
  preheader: string;
  martMessage: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export const EMAIL_TEMPLATES: Record<EmailTrigger, EmailTemplate> = {
  [EMAIL_TRIGGERS.WELCOME]: {
    trigger: EMAIL_TRIGGERS.WELCOME,
    subject: "Welcome to Phoo! Let's grow your traffic",
    preheader: 'Your SEO journey starts here',
    martMessage:
      "Hey! I'm Phoo, your AI SEO assistant. I'm excited to help you rank higher and drive more traffic. Let's get started!",
    ctaLabel: 'Start Your First Project',
    ctaUrl: '/onboarding',
  },

  [EMAIL_TRIGGERS.ONBOARDING_REMINDER]: {
    trigger: EMAIL_TRIGGERS.ONBOARDING_REMINDER,
    subject: "You're almost there! Complete your setup",
    preheader: 'Just a few more steps',
    martMessage:
      "I noticed you haven't finished setting up. No worries - it only takes 2 minutes to connect your data and unlock keyword insights!",
    ctaLabel: 'Continue Setup',
    ctaUrl: '/onboarding',
  },

  [EMAIL_TRIGGERS.PHASE_UNLOCK]: {
    trigger: EMAIL_TRIGGERS.PHASE_UNLOCK,
    subject: '🎉 New features unlocked!',
    preheader: 'You just leveled up',
    martMessage:
      "Great progress! You've unlocked new features. Let me show you what you can do now.",
    ctaLabel: 'Explore New Features',
    ctaUrl: '/dashboard',
  },

  [EMAIL_TRIGGERS.FIRST_KEYWORDS]: {
    trigger: EMAIL_TRIGGERS.FIRST_KEYWORDS,
    subject: 'Your first keywords are in! 📊',
    preheader: 'Time to find ranking opportunities',
    martMessage:
      "I've analyzed your keywords and found some great opportunities. Let's turn them into topic clusters!",
    ctaLabel: 'View Keywords',
    ctaUrl: '/strategy',
  },

  [EMAIL_TRIGGERS.FIRST_CLUSTER]: {
    trigger: EMAIL_TRIGGERS.FIRST_CLUSTER,
    subject: 'Topic clusters ready! 🎯',
    preheader: 'Your content strategy is taking shape',
    martMessage:
      "I've grouped your keywords into smart topic clusters. Now let's create a content calendar!",
    ctaLabel: 'Create Calendar',
    ctaUrl: '/calendar',
  },

  [EMAIL_TRIGGERS.FIRST_BRIEF]: {
    trigger: EMAIL_TRIGGERS.FIRST_BRIEF,
    subject: 'Your first brief is ready to write! ✍️',
    preheader: 'AI-powered content awaits',
    martMessage:
      'Your content brief is all set up. I can help you write the first draft - just click below!',
    ctaLabel: 'Start Writing',
    ctaUrl: '/content',
  },

  [EMAIL_TRIGGERS.FIRST_PUBLISH]: {
    trigger: EMAIL_TRIGGERS.FIRST_PUBLISH,
    subject: '🏆 Congrats! Your first article is live!',
    preheader: 'You did it!',
    martMessage:
      "Amazing work! Your first article is published. Now let's keep the momentum going with more content.",
    ctaLabel: 'Write Another',
    ctaUrl: '/content',
  },

  [EMAIL_TRIGGERS.INACTIVE_7_DAYS]: {
    trigger: EMAIL_TRIGGERS.INACTIVE_7_DAYS,
    subject: 'Miss you! Your keywords are waiting 👋',
    preheader: "Let's pick up where we left off",
    martMessage:
      "It's been a week since I saw you! Your keyword opportunities are still here. Ready to continue?",
    ctaLabel: 'Jump Back In',
    ctaUrl: '/dashboard',
  },

  [EMAIL_TRIGGERS.INACTIVE_14_DAYS]: {
    trigger: EMAIL_TRIGGERS.INACTIVE_14_DAYS,
    subject: 'Your competitors are publishing... 📈',
    preheader: "Don't fall behind",
    martMessage:
      "Just a friendly nudge - consistent content is key to SEO success. I've got fresh keyword data waiting for you!",
    ctaLabel: 'See What You Missed',
    ctaUrl: '/dashboard',
  },

  [EMAIL_TRIGGERS.INCOMPLETE_BRIEF]: {
    trigger: EMAIL_TRIGGERS.INCOMPLETE_BRIEF,
    subject: 'Your draft is waiting! 📝',
    preheader: 'Almost there',
    martMessage: 'You have an unfinished brief. Want me to help you complete it?',
    ctaLabel: 'Finish Brief',
    ctaUrl: '/content',
  },

  [EMAIL_TRIGGERS.WEEKLY_DIGEST]: {
    trigger: EMAIL_TRIGGERS.WEEKLY_DIGEST,
    subject: 'Your weekly SEO digest 📊',
    preheader: 'See your progress',
    martMessage: "Here's what happened this week with your SEO. Let's check out your wins!",
    ctaLabel: 'View Full Report',
    ctaUrl: '/analytics',
  },

  [EMAIL_TRIGGERS.MONTHLY_REPORT]: {
    trigger: EMAIL_TRIGGERS.MONTHLY_REPORT,
    subject: 'Your monthly SEO report 📈',
    preheader: 'Monthly highlights',
    martMessage: "Time for your monthly check-in! I've prepared a summary of your SEO progress.",
    ctaLabel: 'View Report',
    ctaUrl: '/analytics',
  },

  [EMAIL_TRIGGERS.PASSWORD_RESET]: {
    trigger: EMAIL_TRIGGERS.PASSWORD_RESET,
    subject: 'Reset your Phoo password',
    preheader: 'Password reset link inside',
    martMessage: 'No worries, it happens to the best of us! Click below to reset your password.',
    ctaLabel: 'Reset Password',
    ctaUrl: '/auth/reset-password',
  },

  [EMAIL_TRIGGERS.INTEGRATION_EXPIRED]: {
    trigger: EMAIL_TRIGGERS.INTEGRATION_EXPIRED,
    subject: 'Action needed: Reconnect your integration',
    preheader: 'Your connection needs attention',
    martMessage:
      "Your integration token has expired. Let's reconnect so I can keep fetching fresh data!",
    ctaLabel: 'Reconnect Now',
    ctaUrl: '/integrations',
  },
};

/**
 * Email send request
 */
export interface SendEmailRequest {
  to: string;
  trigger: EmailTrigger;
  data?: Record<string, unknown>;
}

/**
 * Queue email for sending
 * This would integrate with Convex action + Resend
 */
export async function queueEmail(request: SendEmailRequest): Promise<void> {
  const template = EMAIL_TEMPLATES[request.trigger];

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Email Queue]', {
      to: request.to,
      subject: template.subject,
      trigger: request.trigger,
    });
    return;
  }

  // In production: call Convex action
  // await ctx.runAction(internal.email.sendEmail, request);
}

/**
 * Check if user should receive re-engagement email
 */
export function shouldSendReengagementEmail(
  lastActiveAt: number,
  emailsSent: EmailTrigger[]
): EmailTrigger | null {
  const now = Date.now();
  const daysSinceActive = (now - lastActiveAt) / (1000 * 60 * 60 * 24);

  if (daysSinceActive >= 14 && !emailsSent.includes(EMAIL_TRIGGERS.INACTIVE_14_DAYS)) {
    return EMAIL_TRIGGERS.INACTIVE_14_DAYS;
  }

  if (daysSinceActive >= 7 && !emailsSent.includes(EMAIL_TRIGGERS.INACTIVE_7_DAYS)) {
    return EMAIL_TRIGGERS.INACTIVE_7_DAYS;
  }

  return null;
}
