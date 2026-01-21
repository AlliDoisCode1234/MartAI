import {
  a as i,
  c as a
} from "../../_deps/K33OSGN4.js";
import {
  c as d,
  e as n
} from "../../_deps/4U34M3I6.js";
import {
  a as t
} from "../../_deps/RUVYHBJQ.js";

// convex/ai/admin/modelConfig.ts
n();
var u = i({
  args: {
    providerId: d.id("aiProviders")
  },
  handler: /* @__PURE__ */ t(async (o, r) => {
    let e = await o.db.get(r.providerId);
    return e ? {
      ...e,
      defaultModel: e.defaultModel ?? null,
      taskTierModels: e.taskTierModels ?? null
    } : null;
  }, "handler")
}), v = i({
  args: {},
  handler: /* @__PURE__ */ t(async (o) => (await o.db.query("aiProviders").withIndex("by_priority").collect()).map((e) => ({
    ...e,
    defaultModel: e.defaultModel ?? null,
    taskTierModels: e.taskTierModels ?? null
  })), "handler")
}), c = a({
  args: {
    providerId: d.id("aiProviders"),
    modelId: d.string()
  },
  handler: /* @__PURE__ */ t(async (o, r) => {
    if (!await o.db.get(r.providerId))
      throw new Error("Provider not found");
    return await o.db.patch(r.providerId, {
      defaultModel: r.modelId,
      updatedAt: Date.now()
    }), { success: !0, providerId: r.providerId, modelId: r.modelId };
  }, "handler")
}), M = a({
  args: {
    providerId: d.id("aiProviders"),
    tierModels: d.object({
      cheap: d.string(),
      standard: d.string(),
      premium: d.optional(d.string())
    })
  },
  handler: /* @__PURE__ */ t(async (o, r) => {
    if (!await o.db.get(r.providerId))
      throw new Error("Provider not found");
    return await o.db.patch(r.providerId, {
      taskTierModels: r.tierModels,
      updatedAt: Date.now()
    }), { success: !0, providerId: r.providerId, tierModels: r.tierModels };
  }, "handler")
}), f = i({
  args: {
    providerId: d.id("aiProviders"),
    tier: d.union(d.literal("cheap"), d.literal("standard"), d.literal("premium"))
  },
  handler: /* @__PURE__ */ t(async (o, r) => {
    let e = await o.db.get(r.providerId);
    if (!e) return null;
    if (e.taskTierModels) {
      let l = e.taskTierModels[r.tier];
      if (l) return l;
    }
    return e.defaultModel ?? null;
  }, "handler")
});
export {
  v as getAllProviderConfigs,
  f as getModelForTier,
  u as getProviderConfig,
  c as setDefaultModel,
  M as setTaskTierModels
};
//# sourceMappingURL=modelConfig.js.map
