"use node";
import {
  a as m,
  b as f,
  c as h
} from "../_deps/node/QT5QKEG6.js";
import {
  a as s,
  c as P,
  j as l,
  l as d,
  p as b
} from "../_deps/node/KFFAPE6U.js";
import {
  a as g
} from "../_deps/node/V7X2J7BI.js";

// convex/publishing/wordpressActions.ts
P();
b();

// lib/integrations/wordpress.ts
var p = class {
  static {
    g(this, "WordPressClient");
  }
  constructor(e) {
    this.siteUrl = e.siteUrl.replace(/\/$/, ""), this.auth = e, this.apiUrl = `${this.siteUrl}/wp-json/wp/v2`, this.authHeader = "Basic " + Buffer.from(`${e.username}:${e.password}`).toString("base64");
  }
  async request(e, t = {}) {
    let r = await fetch(`${this.apiUrl}${e}`, {
      ...t,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        ...t.headers
      }
    });
    if (!r.ok) {
      let a = await r.json().catch(() => ({}));
      throw new Error(
        `WordPress API error: ${a.message || r.statusText} (${r.status})`
      );
    }
    return r.json();
  }
  // ============ Connection Testing ============
  async testConnection() {
    try {
      let e = await fetch(`${this.apiUrl}/`, {
        headers: { Authorization: this.authHeader }
      });
      return e.ok ? { valid: !0, siteName: (await e.json()).name || "WordPress Site" } : {
        valid: !1,
        error: (await e.json().catch(() => ({}))).message || `HTTP error ${e.status}`
      };
    } catch (e) {
      return { valid: !1, error: e instanceof Error ? e.message : "Connection failed" };
    }
  }
  async checkPublishingRights() {
    try {
      let t = (await this.request(
        "/users/me?context=edit"
      )).capabilities || {};
      return t.publish_pages || t.publish_posts || t.edit_pages ? { canPublish: !0 } : { canPublish: !1, error: "User does not have publishing permissions" };
    } catch (e) {
      return { canPublish: !1, error: e instanceof Error ? e.message : "Failed to check permissions" };
    }
  }
  // ============ Pages ============
  async createPage(e) {
    let t = await this.request("/pages", {
      method: "POST",
      body: JSON.stringify({
        title: e.title,
        content: e.content,
        status: e.status || "publish",
        slug: e.slug,
        excerpt: e.excerpt,
        meta: e.meta,
        date: e.date
      })
    });
    return { id: t.id, link: t.link };
  }
  async updatePage(e, t) {
    let r = await this.request(`/pages/${e}`, {
      method: "POST",
      body: JSON.stringify(t)
    });
    return { id: r.id, link: r.link };
  }
  async getPages(e = 100) {
    return this.request(`/pages?per_page=${e}`);
  }
  // ============ Posts ============
  async createPost(e) {
    let t = await this.request("/posts", {
      method: "POST",
      body: JSON.stringify({
        title: e.title,
        content: e.content,
        status: e.status || "draft",
        slug: e.slug,
        excerpt: e.excerpt,
        categories: e.categories,
        tags: e.tags,
        featured_media: e.featured_media,
        meta: e.meta,
        date: e.date
      })
    });
    return { id: t.id, link: t.link };
  }
  async updatePost(e, t) {
    let r = await this.request(`/posts/${e}`, {
      method: "POST",
      body: JSON.stringify(t)
    });
    return { id: r.id, link: r.link };
  }
  async getPosts(e = 100) {
    return this.request(`/posts?per_page=${e}`);
  }
  // ============ Media ============
  async uploadMedia(e, t) {
    let r = await fetch(e);
    if (!r.ok)
      throw new Error(`Failed to fetch image: ${r.statusText}`);
    let a = r.headers.get("content-type") || "image/jpeg", i = await r.arrayBuffer(), u = await fetch(`${this.apiUrl}/media`, {
      method: "POST",
      headers: {
        Authorization: this.authHeader,
        "Content-Type": a,
        "Content-Disposition": `attachment; filename="${t}"`
      },
      body: i
    });
    if (!u.ok) {
      let c = await u.json().catch(() => ({}));
      throw new Error(`Media upload failed: ${c.message || u.statusText}`);
    }
    let o = await u.json();
    return {
      id: o.id,
      url: o.source_url
    };
  }
  async getMedia(e) {
    return this.request(`/media/${e}`);
  }
  // ============ Categories ============
  async getCategories() {
    return this.request("/categories?per_page=100");
  }
  async createCategory(e) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify({ name: e })
    });
  }
  async getOrCreateCategory(e) {
    let r = (await this.getCategories()).find((i) => i.name.toLowerCase() === e.toLowerCase());
    return r ? r.id : (await this.createCategory(e)).id;
  }
  async getOrCreateCategories(e) {
    let t = [];
    for (let r of e) {
      let a = await this.getOrCreateCategory(r);
      t.push(a);
    }
    return t;
  }
  // ============ Tags ============
  async getTags() {
    return this.request("/tags?per_page=100");
  }
  async createTag(e) {
    return this.request("/tags", {
      method: "POST",
      body: JSON.stringify({ name: e })
    });
  }
  async getOrCreateTag(e) {
    let r = (await this.getTags()).find((i) => i.name.toLowerCase() === e.toLowerCase());
    return r ? r.id : (await this.createTag(e)).id;
  }
  async getOrCreateTags(e) {
    let t = [];
    for (let r of e) {
      let a = await this.getOrCreateTag(r);
      t.push(a);
    }
    return t;
  }
  // ============ Full Publishing Flow ============
  async publishArticle(e) {
    let t;
    if (e.featuredImageUrl)
      try {
        let o = `featured-${Date.now()}.jpg`;
        t = (await this.uploadMedia(e.featuredImageUrl, o)).id;
      } catch (o) {
        console.error("Failed to upload featured image:", o);
      }
    let r = [];
    e.categories?.length && (r = await this.getOrCreateCategories(e.categories));
    let a = [];
    e.tags?.length && (a = await this.getOrCreateTags(e.tags));
    let i = {
      title: e.title,
      content: e.content,
      excerpt: e.excerpt,
      slug: e.slug,
      status: e.status || "draft",
      categories: r.length ? r : void 0,
      tags: a.length ? a : void 0,
      featured_media: t,
      meta: e.meta,
      date: e.scheduledDate?.toISOString()
    };
    return {
      ...e.postType === "page" ? await this.createPage(i) : await this.createPost(i),
      featuredMediaId: t
    };
  }
};

// convex/publishing/wordpressActions.ts
var k = l({
  args: {
    draftId: s.id("drafts"),
    projectId: s.id("projects"),
    options: s.optional(
      s.object({
        status: s.optional(s.union(s.literal("draft"), s.literal("publish"), s.literal("future"))),
        categories: s.optional(s.array(s.string())),
        tags: s.optional(s.array(s.string())),
        featuredImageUrl: s.optional(s.string()),
        scheduledDate: s.optional(s.number()),
        // timestamp
        postType: s.optional(s.union(s.literal("post"), s.literal("page"))),
        useGutenberg: s.optional(s.boolean())
      })
    )
  },
  handler: /* @__PURE__ */ g(async (n, e) => {
    try {
      let t = await n.runQuery(d.integrations.platformConnections.getConnection, {
        projectId: e.projectId,
        platform: "wordpress"
      });
      if (!t)
        return {
          success: !1,
          error: "WordPress not connected. Please connect your WordPress site first."
        };
      if (!t.isValid)
        return {
          success: !1,
          error: "WordPress connection is invalid. Please reconnect."
        };
      let r = await n.runQuery(d["content/drafts"].getDraftById, {
        draftId: e.draftId
      });
      if (!r)
        return { success: !1, error: "Draft not found" };
      let a = await n.runQuery(d["content/briefs"].getBriefById, {
        briefId: r.briefId
      });
      if (!a)
        return { success: !1, error: "Brief not found" };
      let i = new p({
        siteUrl: t.siteUrl,
        username: t.credentials.username || "",
        password: t.credentials.applicationPassword || ""
      }), o = e.options?.useGutenberg ?? !0 ? m(r.content) : r.content, c = await i.publishArticle({
        title: a.title,
        content: o,
        excerpt: h(r.content),
        slug: f(a.title),
        status: e.options?.status || "publish",
        categories: e.options?.categories,
        tags: e.options?.tags || a.keywords,
        featuredImageUrl: e.options?.featuredImageUrl,
        scheduledDate: e.options?.scheduledDate ? new Date(e.options.scheduledDate) : void 0,
        meta: {
          _yoast_wpseo_title: a.title,
          _yoast_wpseo_metadesc: h(r.content)
        },
        postType: e.options?.postType || "post"
      });
      return await n.runMutation(d["content/drafts"].updateDraft, {
        draftId: e.draftId,
        status: "published",
        publishedUrl: c.link
      }), {
        success: !0,
        postId: c.id,
        postUrl: c.link
      };
    } catch (t) {
      return console.error("WordPress publish failed:", t), {
        success: !1,
        error: t instanceof Error ? t.message : "Publish failed"
      };
    }
  }, "handler")
}), v = l({
  args: {
    draftId: s.id("drafts"),
    projectId: s.id("projects")
  },
  handler: /* @__PURE__ */ g(async (n, e) => n.runAction(d.publishing.wordpressActions.publishToWordPress, {
    draftId: e.draftId,
    projectId: e.projectId,
    options: {
      status: "publish",
      useGutenberg: !0
    }
  }), "handler")
}), x = l({
  args: {
    draftId: s.id("drafts"),
    projectId: s.id("projects")
  },
  handler: /* @__PURE__ */ g(async (n, e) => n.runAction(d.publishing.wordpressActions.publishToWordPress, {
    draftId: e.draftId,
    projectId: e.projectId,
    options: {
      status: "draft",
      useGutenberg: !0
    }
  }), "handler")
});
export {
  k as publishToWordPress,
  v as quickPublish,
  x as saveAsDraft
};
//# sourceMappingURL=wordpressActions.js.map
