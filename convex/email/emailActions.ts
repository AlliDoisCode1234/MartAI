/**
 * Email Actions
 *
 * Convex actions for sending transactional emails via Resend.
 * Uses templates from src/lib/emailTriggers.ts
 */

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { Resend } from 'resend';

// Lazy initialization to avoid module-load-time errors when key is missing
let _resend: Resend | null = null;

function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.AUTH_RESEND_KEY;
    if (!apiKey) {
      throw new Error('AUTH_RESEND_KEY environment variable is not set');
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// From address - verified domain
const FROM_EMAIL = 'Phoo <hello@phoo.ai>';
const APP_URL = process.env.SITE_URL || 'http://localhost:3000';

// Email templates
const EMAIL_TEMPLATES: Record<
  string,
  {
    getSubject: (data: Record<string, unknown>) => string;
    getHtml: (data: Record<string, unknown>) => string;
  }
> = {
  welcome: {
    getSubject: () => 'Welcome to Phoo - Get Started with AI-Powered SEO',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Welcome to Phoo!</h1>
        <p>Hey${data.name ? ` ${data.name}` : ''}! I'm Phoo, your AI SEO assistant.</p>
        <p>I'm excited to help you rank higher and drive more traffic. Let's get started!</p>
        <a href="${APP_URL}/onboarding" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Start Your First Project
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          Questions? Reply to this email - I'd love to help!
        </p>
      </div>
    `,
  },

  phase_unlock: {
    getSubject: () => '🎉 New features unlocked!',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">You just leveled up!</h1>
        <p>Great progress! You've unlocked new features in Phoo.</p>
        <p><strong>New Phase:</strong> ${data.phaseName || 'Discovery'}</p>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Explore New Features
        </a>
      </div>
    `,
  },

  first_keywords: {
    getSubject: () => 'Your first keywords are in! 📊',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Keywords Ready!</h1>
        <p>I've analyzed your keywords and found ${data.count || 'some'} great opportunities.</p>
        <p>Let's turn them into topic clusters!</p>
        <a href="${APP_URL}/strategy" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Keywords
        </a>
      </div>
    `,
  },

  first_publish: {
    getSubject: () => '🏆 Congrats! Your first article is live!',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Amazing work!</h1>
        <p>Your first article is published. Now let's keep the momentum going!</p>
        <p><strong>Title:</strong> ${data.title || 'Your article'}</p>
        <a href="${APP_URL}/content" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Write Another
        </a>
      </div>
    `,
  },

  inactive_7_days: {
    getSubject: () => 'Miss you! Your keywords are waiting 👋',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">It's been a week!</h1>
        <p>Your keyword opportunities are still here. Ready to continue?</p>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Jump Back In
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          Don't want these emails? <a href="${APP_URL}/settings">Manage preferences</a>
        </p>
      </div>
    `,
  },

  weekly_digest: {
    getSubject: () => 'Your weekly SEO digest 📊',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Weekly Digest</h1>
        <p>Here's what happened this week with your SEO:</p>
        <ul>
          <li>Keywords: ${data.keywordCount || 0}</li>
          <li>Clusters: ${data.clusterCount || 0}</li>
          <li>Content: ${data.contentCount || 0} pieces</li>
        </ul>
        <a href="${APP_URL}/analytics" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Full Report
        </a>
      </div>
    `,
  },

  password_reset: {
    getSubject: () => 'Reset Your Phoo Password',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Password Reset Requested</h1>
        <p>Hi${data.name ? ` ${data.name}` : ''},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${APP_URL}/auth/reset-password?token=${data.token}" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Reset Password
        </a>
        <p style="color: #666; margin-top: 24px; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 16px;">
          — The Phoo Team
        </p>
      </div>
    `,
  },

  team_invite_accepted: {
    getSubject: (data) => `${data.memberName || 'Someone'} joined your team`,
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">New Team Member!</h1>
        <p>Great news! <strong>${data.memberName || 'A new member'}</strong> (${data.memberEmail || 'email'}) has accepted your invitation to join <strong>${data.orgName || 'your team'}</strong>.</p>
        <p>They've been assigned the <strong>${data.role || 'team member'}</strong> role.</p>
        <a href="${APP_URL}/settings/team" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          View Your Team
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          — The Phoo Team
        </p>
      </div>
    `,
  },

  team_invite: {
    getSubject: (data) => `You're invited to join ${data.orgName || 'a team'} on Phoo`,
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px;">
        <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <img src="https://phoo.ai/images/phoo-logo-orange.png" alt="Phoo" style="height: 40px; margin-bottom: 24px;" />
          
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">You're invited!</h1>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">
            <strong>${data.inviterName || 'Someone'}</strong> has invited you to join <strong>${data.orgName || 'their team'}</strong> on Phoo, the AI-powered SEO platform.
          </p>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">
            You've been assigned the <strong style="color: #F99F2A;">${data.role || 'team member'}</strong> role.
          </p>
          
          <a href="${APP_URL}/invite/${data.token}" style="display: inline-block; background: linear-gradient(135deg, #F99F2A 0%, #e53e3e 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: 600; font-size: 16px;">
            Accept Invitation
          </a>
          
          <p style="color: #888; font-size: 14px; margin-top: 24px;">
            This invitation expires in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          
          <p style="color: #999; font-size: 12px;">
            Questions? Contact us at <a href="mailto:phoosupport@helps2.com" style="color: #F99F2A;">phoosupport@helps2.com</a>
          </p>
          <p style="color: #999; font-size: 12px;">
            — The Phoo Team
          </p>
        </div>
      </div>
    `,
  },
};

/**
 * Internal function to send email (can be called from other actions)
 */
async function sendEmailInternal(args: {
  to: string;
  template: string;
  data?: Record<string, unknown>;
}): Promise<{ success: boolean; skipped?: boolean; id?: string }> {
  const template = EMAIL_TEMPLATES[args.template];
  if (!template) {
    throw new Error(`Unknown email template: ${args.template}`);
  }

  // Note: Emails will send if AUTH_RESEND_KEY is configured

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_EMAIL,
      to: args.to,
      subject: template.getSubject(args.data || {}),
      html: template.getHtml(args.data || {}),
    });

    if (error) {
      console.error('[Email] Error:', error);
      throw new Error(error.message);
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    throw error;
  }
}

/**
 * Send a transactional email (public action)
 */
export const sendEmail = action({
  args: {
    to: v.string(),
    template: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {
    return await sendEmailInternal(args);
  },
});

/**
 * Send welcome email on signup
 */
export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    return await sendEmailInternal({
      to: args.email,
      template: 'welcome',
      data: { name: args.name },
    });
  },
});

/**
 * Send phase unlock notification
 */
export const sendPhaseUnlockEmail = action({
  args: {
    email: v.string(),
    phaseName: v.string(),
  },
  handler: async (_ctx, args) => {
    return await sendEmailInternal({
      to: args.email,
      template: 'phase_unlock',
      data: { phaseName: args.phaseName },
    });
  },
});

/**
 * Send password reset email
 * Called by admin mutation after generating reset token
 */
export const sendPasswordResetEmail = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    token: v.string(),
  },
  handler: async (_ctx, args) => {
    return await sendEmailInternal({
      to: args.email,
      template: 'password_reset',
      data: { name: args.name, token: args.token },
    });
  },
});

/**
 * Send notification when team invite is accepted
 * Called by acceptInvitation mutation
 */
export const sendInviteAcceptedEmail = action({
  args: {
    inviterEmail: v.string(),
    memberName: v.optional(v.string()),
    memberEmail: v.string(),
    orgName: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (_ctx, args) => {
    return await sendEmailInternal({
      to: args.inviterEmail,
      template: 'team_invite_accepted',
      data: {
        memberName: args.memberName,
        memberEmail: args.memberEmail,
        orgName: args.orgName,
        role: args.role,
      },
    });
  },
});

/**
 * Send team invitation email to invitee
 * Called by createInvitation mutation
 */
export const sendTeamInviteEmail = action({
  args: {
    email: v.string(),
    inviterName: v.optional(v.string()),
    orgName: v.optional(v.string()),
    role: v.string(),
    token: v.string(),
  },
  handler: async (_ctx, args) => {
    return await sendEmailInternal({
      to: args.email,
      template: 'team_invite',
      data: {
        inviterName: args.inviterName,
        orgName: args.orgName,
        role: args.role,
        token: args.token,
      },
    });
  },
});
