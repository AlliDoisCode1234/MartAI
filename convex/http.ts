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
registerRoutes(http, components.stripe, {
  webhookPath: '/stripe/webhook',
});

export default http;
