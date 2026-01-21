"use node";
import {
  b as h,
  c as m
} from "../_deps/node/QT5QKEG6.js";
import {
  a as e,
  c as j,
  j as l,
  l as n,
  p as $
} from "../_deps/node/KFFAPE6U.js";
import {
  a as c
} from "../_deps/node/V7X2J7BI.js";

// convex/publishing/shopifyActions.ts
j();
$();
async function y(s, r, t, a) {
  let o = s.replace(/\.myshopify\.com$/, ""), i = await fetch(`https://${o}.myshopify.com/admin/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": r
    },
    body: JSON.stringify({ query: t, variables: a })
  });
  if (!i.ok)
    throw new Error(`Shopify API error: ${i.status} ${i.statusText}`);
  return i.json();
}
c(y, "shopifyGraphQL");
var B = l({
  args: {
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ c(async (s, r) => {
    try {
      let t = await s.runQuery(n.integrations.platformConnections.getConnection, {
        projectId: r.projectId,
        platform: "shopify"
      });
      if (!t || !t.credentials.accessToken)
        return { success: !1, error: "Shopify not connected" };
      let o = await y(
        t.siteUrl,
        t.credentials.accessToken,
        `
        query {
          blogs(first: 20) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      `
      );
      return o.errors ? { success: !1, error: o.errors[0]?.message || "GraphQL error" } : { success: !0, blogs: o.data?.blogs.edges.map((u) => u.node) || [] };
    } catch (t) {
      return console.error("[Shopify] listBlogs error:", t), { success: !1, error: t instanceof Error ? t.message : "Unknown error" };
    }
  }, "handler")
}), D = l({
  args: {
    draftId: e.id("drafts"),
    projectId: e.id("projects"),
    options: e.optional(
      e.object({
        blogId: e.optional(e.string()),
        // Shopify blog GID, defaults to first blog
        status: e.optional(e.union(e.literal("draft"), e.literal("publish"))),
        tags: e.optional(e.array(e.string())),
        scheduledDate: e.optional(e.number())
        // timestamp
      })
    )
  },
  handler: /* @__PURE__ */ c(async (s, r) => {
    try {
      let t = await s.runQuery(n.integrations.platformConnections.getConnection, {
        projectId: r.projectId,
        platform: "shopify"
      });
      if (!t || !t.credentials.accessToken)
        return {
          success: !1,
          error: "Shopify not connected. Please connect your Shopify store first."
        };
      let a = await s.runQuery(n["content/drafts"].getDraftById, {
        draftId: r.draftId
      });
      if (!a)
        return { success: !1, error: "Draft not found" };
      let o = await s.runQuery(n["content/briefs"].getBriefById, {
        briefId: a.briefId
      });
      if (!o)
        return { success: !1, error: "Brief not found" };
      let i = r.options?.blogId;
      if (!i) {
        let f = await s.runAction(n.publishing.shopifyActions.listBlogs, {
          projectId: r.projectId
        });
        if (!f.success || !f.blogs?.length)
          return { success: !1, error: "No blogs found in Shopify store. Create a blog first." };
        i = f.blogs[0].id;
      }
      let u = w(a.content), b = `
        mutation articleCreate($article: ArticleInput!) {
          articleCreate(article: $article) {
            article {
              id
              title
              handle
              url
            }
            userErrors {
              field
              message
            }
          }
        }
      `, I = r.options?.scheduledDate ? new Date(r.options.scheduledDate).toISOString() : r.options?.status === "draft" ? null : (/* @__PURE__ */ new Date()).toISOString(), S = {
        article: {
          blogId: i,
          title: o.title,
          bodyHtml: u,
          summary: m(a.content, 160),
          handle: h(o.title),
          tags: r.options?.tags || o.keywords || [],
          publishedAt: I
        }
      }, p = await y(t.siteUrl, t.credentials.accessToken, b, S);
      if (p.errors)
        return { success: !1, error: p.errors[0]?.message || "GraphQL error" };
      let g = p.data?.articleCreate.userErrors;
      if (g?.length)
        return { success: !1, error: g[0].message };
      let d = p.data?.articleCreate.article;
      return d ? (await s.runMutation(n["content/drafts"].updateDraft, {
        draftId: r.draftId,
        status: "published",
        publishedUrl: d.url
      }), {
        success: !0,
        articleId: d.id,
        articleUrl: d.url
      }) : { success: !1, error: "Article not created" };
    } catch (t) {
      return console.error("[Shopify] publishToShopify error:", t), { success: !1, error: t instanceof Error ? t.message : "Publish failed" };
    }
  }, "handler")
}), Q = l({
  args: {
    draftId: e.id("drafts"),
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ c(async (s, r) => s.runAction(n.publishing.shopifyActions.publishToShopify, {
    draftId: r.draftId,
    projectId: r.projectId,
    options: { status: "publish" }
  }), "handler")
}), E = l({
  args: {
    draftId: e.id("drafts"),
    projectId: e.id("projects")
  },
  handler: /* @__PURE__ */ c(async (s, r) => s.runAction(n.publishing.shopifyActions.publishToShopify, {
    draftId: r.draftId,
    projectId: r.projectId,
    options: { status: "draft" }
  }), "handler")
});
function w(s) {
  let r = s;
  return r = r.replace(/^### (.*$)/gim, "<h3>$1</h3>"), r = r.replace(/^## (.*$)/gim, "<h2>$1</h2>"), r = r.replace(/^# (.*$)/gim, "<h1>$1</h1>"), r = r.replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>"), r = r.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>"), r = r.replace(/\*(.*?)\*/gim, "<em>$1</em>"), r = r.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>'), r = r.replace(/^\s*[-*] (.*$)/gim, "<li>$1</li>"), r = r.replace(/(<li>.*<\/li>\n?)+/gim, "<ul>$&</ul>"), r = r.replace(/\n\n/gim, "</p><p>"), r = "<p>" + r + "</p>", r = r.replace(/<p><h/gim, "<h"), r = r.replace(/<\/h(\d)><\/p>/gim, "</h$1>"), r = r.replace(/<p><ul>/gim, "<ul>"), r = r.replace(/<\/ul><\/p>/gim, "</ul>"), r = r.replace(/<p><\/p>/gim, ""), r;
}
c(w, "markdownToHtml");
export {
  B as listBlogs,
  D as publishToShopify,
  Q as quickPublish,
  E as saveAsDraft
};
//# sourceMappingURL=shopifyActions.js.map
