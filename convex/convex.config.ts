import { defineApp } from 'convex/server';
import rateLimiter from '@convex-dev/rate-limiter/convex.config.js';
import actionCache from '@convex-dev/action-cache/convex.config.js';
import workflow from '@convex-dev/workflow/convex.config.js';

const app = defineApp();
app.use(rateLimiter);
app.use(actionCache);
app.use(workflow);

export default app;
