/**
 * Email Actions
 *
 * Convex actions for sending transactional emails via Resend.
 * Uses templates from src/lib/emailTriggers.ts
 */

import { action } from '../_generated/server';
import { v } from 'convex/values';
import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.AUTH_RESEND_KEY);

// From address - change after domain verification
const FROM_EMAIL = 'MartAI <onboarding@resend.dev>';
const APP_URL = process.env.SITE_URL || 'http://localhost:3000';

// Email templates
const EMAIL_TEMPLATES: Record<
  string,
  { subject: string; getHtml: (data: Record<string, unknown>) => string }
> = {
  welcome: {
    subject: "Welcome to MartAI! Let's grow your traffic 🚀",
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">Welcome to MartAI!</h1>
        <p>Hey${data.name ? ` ${data.name}` : ''}! I'm Mart, your AI SEO assistant.</p>
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
    subject: '🎉 New features unlocked!',
    getHtml: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F99F2A;">You just leveled up!</h1>
        <p>Great progress! You've unlocked new features in MartAI.</p>
        <p><strong>New Phase:</strong> ${data.phaseName || 'Discovery'}</p>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #F99F2A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Explore New Features
        </a>
      </div>
    `,
  },

  first_keywords: {
    subject: 'Your first keywords are in! 📊',
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
    subject: '🏆 Congrats! Your first article is live!',
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
    subject: 'Miss you! Your keywords are waiting 👋',
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
    subject: 'Your weekly SEO digest 📊',
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
    subject: 'Reset your Phoo password',
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

  // Skip in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Email] Would send:', {
      to: args.to,
      template: args.template,
      subject: template.subject,
    });
    return { success: true, skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: args.to,
      subject: template.subject,
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
