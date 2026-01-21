"use node";
import {
  b as g,
  c as I
} from "../_deps/node/QT5QKEG6.js";
import {
  a as s,
  c as b,
  j as l,
  l as a,
  p as y
} from "../_deps/node/KFFAPE6U.js";
import {
  a as c
} from "../_deps/node/V7X2J7BI.js";

// convex/publishing/wixActions.ts
b();
y();
async function h(n, e, t = {}) {
  return fetch(`https://www.wixapis.com${n}`, {
    ...t,
    headers: {
      Authorization: e,
      "Content-Type": "application/json",
      ...t.headers
    }
  });
}
c(h, "wixFetch");
var E = l({
  args: {
    projectId: s.id("projects")
  },
  handler: /* @__PURE__ */ c(async (n, e) => {
    try {
      let t = await n.runQuery(a.integrations.platformConnections.getConnection, {
        projectId: e.projectId,
        platform: "wix"
      });
      if (!t || !t.credentials.accessToken)
        return { success: !1, error: "Wix not connected" };
      let r = await h("/blog/v3/categories", t.credentials.accessToken);
      return r.ok ? { success: !0, categories: (await r.json()).categories?.map((i) => ({
        id: i.id,
        label: i.label
      })) || [] } : { success: !1, error: `API error: ${r.status}` };
    } catch (t) {
      return console.error("[Wix] listCategories error:", t), { success: !1, error: t instanceof Error ? t.message : "Unknown error" };
    }
  }, "handler")
}), P = l({
  args: {
    draftId: s.id("drafts"),
    projectId: s.id("projects"),
    options: s.optional(
      s.object({
        categoryId: s.optional(s.string()),
        status: s.optional(s.union(s.literal("draft"), s.literal("publish"))),
        tags: s.optional(s.array(s.string())),
        scheduledDate: s.optional(s.number())
      })
    )
  },
  handler: /* @__PURE__ */ c(async (n, e) => {
    try {
      let t = await n.runQuery(a.integrations.platformConnections.getConnection, {
        projectId: e.projectId,
        platform: "wix"
      });
      if (!t || !t.credentials.accessToken)
        return { success: !1, error: "Wix not connected. Please connect your Wix site first." };
      let r = await n.runQuery(a["content/drafts"].getDraftById, {
        draftId: e.draftId
      });
      if (!r)
        return { success: !1, error: "Draft not found" };
      let o = await n.runQuery(a["content/briefs"].getBriefById, {
        briefId: r.briefId
      });
      if (!o)
        return { success: !1, error: "Brief not found" };
      let d = m(r.content), i = await h(
        "/blog/v3/draft-posts",
        t.credentials.accessToken,
        {
          method: "POST",
          body: JSON.stringify({
            draftPost: {
              title: o.title,
              richContent: d,
              excerpt: I(r.content, 160),
              slug: g(o.title),
              tags: e.options?.tags || o.keywords || [],
              categoryIds: e.options?.categoryId ? [e.options.categoryId] : []
            }
          })
        }
      );
      if (!i.ok) {
        let p = await i.text();
        return console.error("[Wix] Create draft failed:", p), { success: !1, error: `Failed to create draft: ${i.status}` };
      }
      let u = (await i.json()).draftPost?.id;
      if (!u)
        return { success: !1, error: "No draft post ID returned" };
      if (e.options?.status === "publish") {
        let p = await h(
          `/blog/v3/draft-posts/${u}/publish`,
          t.credentials.accessToken,
          { method: "POST" }
        );
        if (!p.ok)
          return { success: !1, error: "Draft created but publish failed" };
        let f = (await p.json()).post;
        return await n.runMutation(a["content/drafts"].updateDraft, {
          draftId: e.draftId,
          status: "published",
          publishedUrl: f?.url || ""
        }), {
          success: !0,
          postId: f?.id,
          postUrl: f?.url
        };
      }
      return {
        success: !0,
        postId: u
      };
    } catch (t) {
      return console.error("[Wix] publishToWix error:", t), { success: !1, error: t instanceof Error ? t.message : "Publish failed" };
    }
  }, "handler")
}), W = l({
  args: {
    draftId: s.id("drafts"),
    projectId: s.id("projects")
  },
  handler: /* @__PURE__ */ c(async (n, e) => n.runAction(a.publishing.wixActions.publishToWix, {
    draftId: e.draftId,
    projectId: e.projectId,
    options: { status: "publish" }
  }), "handler")
}), k = l({
  args: {
    draftId: s.id("drafts"),
    projectId: s.id("projects")
  },
  handler: /* @__PURE__ */ c(async (n, e) => n.runAction(a.publishing.wixActions.publishToWix, {
    draftId: e.draftId,
    projectId: e.projectId,
    options: { status: "draft" }
  }), "handler")
});
function m(n) {
  let e = [], t = n.split(`
`), r = 0;
  for (; r < t.length; ) {
    let o = t[r];
    if (o.startsWith("### "))
      e.push({
        type: "HEADING",
        headingData: { level: 3 },
        nodes: [{ type: "TEXT", textData: { text: o.slice(4) } }]
      });
    else if (o.startsWith("## "))
      e.push({
        type: "HEADING",
        headingData: { level: 2 },
        nodes: [{ type: "TEXT", textData: { text: o.slice(3) } }]
      });
    else if (o.startsWith("# "))
      e.push({
        type: "HEADING",
        headingData: { level: 1 },
        nodes: [{ type: "TEXT", textData: { text: o.slice(2) } }]
      });
    else if (o.match(/^\s*[-*] /)) {
      let d = [];
      for (; r < t.length && t[r].match(/^\s*[-*] /); )
        d.push({
          type: "LIST_ITEM",
          nodes: [{ type: "TEXT", textData: { text: t[r].replace(/^\s*[-*] /, "") } }]
        }), r++;
      e.push({
        type: "BULLETED_LIST",
        nodes: d
      });
      continue;
    } else o.trim() && e.push({
      type: "PARAGRAPH",
      nodes: [{ type: "TEXT", textData: { text: o } }]
    });
    r++;
  }
  return {
    nodes: e,
    metadata: {
      version: 1,
      createdTimestamp: Date.now(),
      updatedTimestamp: Date.now()
    }
  };
}
c(m, "markdownToWixRichContent");
export {
  E as listCategories,
  P as publishToWix,
  W as quickPublish,
  k as saveAsDraft
};
//# sourceMappingURL=wixActions.js.map
