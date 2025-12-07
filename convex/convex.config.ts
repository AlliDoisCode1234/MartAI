import { defineApp } from 'convex/server';
import rateLimiter from '@convex-dev/rate-limiter/convex.config.js';
import actionCache from '@convex-dev/action-cache/convex.config.js';
import workflow from '@convex-dev/workflow/convex.config.js';
import rag from '@convex-dev/rag/convex.config.js';
import aggregate from 'neutral-cost/convex.config.js';

const app = defineApp();
app.use(rateLimiter);
app.use(actionCache);
app.use(workflow);
app.use(rag);
app.use(aggregate);

export default app;
