import {
  a as d,
  c as r
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as i
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/integrations/pages.ts
i();
var l = r({
  args: {
    clientId: e.id("clients"),
    platform: e.string(),
    pageId: e.string(),
    pageUrl: e.string(),
    title: e.string(),
    content: e.string(),
    keywords: e.array(e.string()),
    status: e.string()
  },
  handler: /* @__PURE__ */ n(async (a, t) => await a.db.insert("generatedPages", {
    clientId: t.clientId,
    platform: t.platform,
    pageId: t.pageId,
    pageUrl: t.pageUrl,
    title: t.title,
    content: t.content,
    keywords: t.keywords,
    status: t.status,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }), "handler")
}), g = d({
  args: { clientId: e.id("clients") },
  handler: /* @__PURE__ */ n(async (a, t) => await a.db.query("generatedPages").withIndex("by_client", (s) => s.eq("clientId", t.clientId)).order("desc").collect(), "handler")
}), p = r({
  args: {
    pageId: e.id("generatedPages"),
    status: e.string()
  },
  handler: /* @__PURE__ */ n(async (a, t) => await a.db.patch(t.pageId, {
    status: t.status,
    updatedAt: Date.now()
  }), "handler")
});
export {
  l as createGeneratedPage,
  g as getPagesByClient,
  p as updatePageStatus
};
//# sourceMappingURL=pages.js.map
