import { defineApp } from 'convex/server';
import rateLimiter from '@convex-dev/rate-limiter/convex.config.js';
import actionCache from '@convex-dev/action-cache/convex.config.js';
import workflow from '@convex-dev/workflow/convex.config.js';
import rag from '@convex-dev/rag/convex.config.js';
import neutralCost from 'neutral-cost/convex.config.js';
import aggregate from '@convex-dev/aggregate/convex.config.js';
import polar from '@convex-dev/polar/convex.config.js';

const app = defineApp();
app.use(rateLimiter);
app.use(actionCache);
app.use(workflow);
app.use(rag);
app.use(neutralCost);
app.use(polar);

// Named aggregate instances for efficient KPI counting
app.use(aggregate, { name: 'aggregateBriefs' });
app.use(aggregate, { name: 'aggregateKeywords' });
app.use(aggregate); // Default aggregate for general use

export default app;
