import {
  a as c
} from "./S27PWT2U.js";
import {
  a as s,
  e as l
} from "./GTU362KY.js";
import {
  c as t,
  e as f
} from "./4U34M3I6.js";
import {
  a as d
} from "./RUVYHBJQ.js";

// convex/workflows/contentWorkflows.ts
f();
l();
var g = c.define({
  args: {
    projectId: t.id("projects"),
    contentVelocity: t.number(),
    // posts per week
    startDate: t.number(),
    goals: t.optional(
      t.object({
        traffic: t.optional(t.number()),
        leads: t.optional(t.number()),
        revenue: t.optional(t.number())
      })
    )
  },
  returns: t.object({
    planId: t.id("quarterlyPlans"),
    briefIds: t.array(t.id("briefs")),
    status: t.literal("briefs_generated"),
    message: t.string()
  }),
  handler: /* @__PURE__ */ d(async (r, e) => {
    let o = (await r.runAction(s.content.quarterlyPlanActions.generatePlan, {
      projectId: e.projectId,
      contentVelocity: e.contentVelocity,
      startDate: e.startDate,
      goals: e.goals
    })).planId, a = await r.runQuery(s.content.briefs.getBriefsByPlan, {
      planId: o
    }), i = [];
    for (let u of a) {
      let p = await r.runAction(s.content.briefActions.generateBrief, {
        briefId: u._id,
        projectId: e.projectId
      });
      i.push(u._id);
    }
    return {
      planId: o,
      briefIds: i,
      status: "briefs_generated",
      message: "Briefs generated. Review and approve to continue."
    };
  }, "handler")
}), h = c.define({
  args: {
    briefId: t.id("briefs")
  },
  returns: t.object({
    draftId: t.id("drafts"),
    status: t.literal("draft_generated"),
    message: t.string()
  }),
  handler: /* @__PURE__ */ d(async (r, e) => {
    let n = await r.runQuery(s.content.briefs.getBriefById, {
      briefId: e.briefId
    });
    if (!n || n.status !== "in_progress")
      throw new Error("Brief must be in 'in_progress' status");
    return {
      draftId: (await r.runAction(s.content.draftActions.generateDraft, {
        briefId: e.briefId
      })).draftId,
      status: "draft_generated",
      message: "Draft generated. Review and approve to publish."
    };
  }, "handler")
}), m = c.define({
  args: {
    draftId: t.id("drafts"),
    publishDate: t.optional(t.number()),
    tags: t.optional(t.array(t.string())),
    categories: t.optional(t.array(t.string()))
  },
  returns: t.object({
    scheduledPostId: t.id("scheduledPosts"),
    status: t.union(t.literal("scheduled"), t.literal("published")),
    publishDate: t.number()
  }),
  handler: /* @__PURE__ */ d(async (r, e) => {
    let n = await r.runQuery(s.content.drafts.getDraftById, {
      draftId: e.draftId
    });
    if (!n || n.status !== "approved")
      throw new Error("Draft must be approved before publishing");
    let o = await r.runQuery(s["integrations/wordpress"].getConnection, {
      projectId: n.projectId
    });
    if (!o)
      throw new Error("WordPress not connected. Please connect WordPress first.");
    let a = e.publishDate || Date.now(), i = await r.runMutation(
      s.publishing.scheduledPosts.createScheduledPost,
      {
        draftId: e.draftId,
        projectId: n.projectId,
        briefId: n.briefId,
        publishDate: a,
        timezone: "UTC",
        platform: "wordpress",
        tags: e.tags || [],
        categories: e.categories || [],
        status: a > Date.now() ? "scheduled" : "publishing"
      }
    );
    return a <= Date.now() && await r.runAction(s.publishing.wordpressActions.publishPost, {
      draftId: e.draftId,
      projectId: n.projectId,
      siteUrl: o.url,
      username: o.username,
      password: o.password,
      status: "publish"
    }), {
      scheduledPostId: i,
      status: a > Date.now() ? "scheduled" : "published",
      publishDate: a
    };
  }, "handler")
});

export {
  g as a,
  h as b,
  m as c
};
//# sourceMappingURL=BC4BUULF.js.map
