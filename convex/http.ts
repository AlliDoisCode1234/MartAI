import { httpRouter } from 'convex/server';
import { checkScheduledPosts } from './http/checkScheduledPosts';
import { publishScheduledPost } from './http/publishScheduledPost';
import { auth } from './auth';
import { components } from './_generated/api';
import { registerRoutes } from '@convex-dev/stripe';

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: '/check-scheduled-posts',
  method: 'POST',
  handler: checkScheduledPosts,
});

http.route({
  path: '/publish-scheduled-post',
  method: 'POST',
  handler: publishScheduledPost,
});

// Stripe billing webhooks
import { internal } from './_generated/api';
import type Stripe from 'stripe';

registerRoutes(http, components.stripe, {
  webhookPath: '/stripe/webhook',
  events: {
    'customer.subscription.created': async (ctx: any, event: any) => {
      const sub = event.data.object;
      const priceId = sub.items?.data?.[0]?.price?.id || '';
      const userId = sub.metadata?.userId || (typeof sub.customer === 'string' ? sub.customer : '');
      await ctx.runMutation(internal.stripe.sync.handleSubscriptionUpdate, {
        stripeSubscriptionId: sub.id || '',
        stripeUserId: userId,
        priceId: priceId,
        status: sub.status || 'active',
        currentPeriodEnd: sub.current_period_end || Math.floor(Date.now() / 1000),
        cancelAtPeriodEnd: !!sub.cancel_at_period_end,
        eventId: event.id,
        eventType: event.type,
      });
    },
    'customer.subscription.updated': async (ctx: any, event: any) => {
      const sub = event.data.object;
      const priceId = sub.items?.data?.[0]?.price?.id || '';
      const userId = sub.metadata?.userId || (typeof sub.customer === 'string' ? sub.customer : '');
      await ctx.runMutation(internal.stripe.sync.handleSubscriptionUpdate, {
        stripeSubscriptionId: sub.id || '',
        stripeUserId: userId,
        priceId: priceId,
        status: sub.status || 'active',
        currentPeriodEnd: sub.current_period_end || Math.floor(Date.now() / 1000),
        cancelAtPeriodEnd: !!sub.cancel_at_period_end,
        eventId: event.id,
        eventType: event.type,
      });
    },
    'customer.subscription.deleted': async (ctx: any, event: any) => {
      const sub = event.data.object;
      const priceId = sub.items?.data?.[0]?.price?.id || '';
      const userId = sub.metadata?.userId || (typeof sub.customer === 'string' ? sub.customer : '');
      await ctx.runMutation(internal.stripe.sync.handleSubscriptionUpdate, {
        stripeSubscriptionId: sub.id || '',
        stripeUserId: userId,
        priceId: priceId,
        status: sub.status || 'canceled',
        currentPeriodEnd: sub.current_period_end || Math.floor(Date.now() / 1000),
        cancelAtPeriodEnd: !!sub.cancel_at_period_end,
        eventId: event.id,
        eventType: event.type,
      });
    },
  },
});

export default http;
