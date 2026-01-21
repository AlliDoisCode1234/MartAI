import {
  b as o,
  e as i
} from "../_deps/GTU362KY.js";
import {
  e as a
} from "../_deps/K33OSGN4.js";
import "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/analytics/scheduler.ts
i();
var u = a({
  args: {},
  handler: /* @__PURE__ */ n(async (c) => {
    let s = await c.runQuery(o.analytics.queries.getAllProjectsInternal);
    console.log(`[Analytics Scheduler] Syncing ${s.length} projects...`);
    let e = [];
    for (let r of s)
      try {
        let t = await c.runAction(o.analytics.sync.syncProjectData, {
          projectId: r._id
        });
        e.push({ projectId: r._id, status: "success", data: t }), console.log(`[Analytics Scheduler] Synced Project ${r.name} (${r._id})`);
      } catch (t) {
        console.error(`[Analytics Scheduler] Failed to sync project ${r._id}:`, t), e.push({ projectId: r._id, status: "error", error: String(t) });
      }
    return e;
  }, "handler")
});
export {
  u as syncAllProjects
};
//# sourceMappingURL=scheduler.js.map
