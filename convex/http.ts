import { httpRouter } from 'convex/server';
import { checkScheduledPosts } from './http/checkScheduledPosts';
import { publishScheduledPost } from './http/publishScheduledPost';
import { polar } from './polar';
import { auth } from './auth';

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

// Polar billing webhooks (defaults to /polar/events)
polar.registerRoutes(http);

export default http;
