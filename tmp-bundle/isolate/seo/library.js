import {
  e as l,
  j as m
} from "../_deps/YW3B7PJC.js";
import {
  b as c,
  e as k
} from "../_deps/GTU362KY.js";
import {
  a as y,
  b as w,
  d as b,
  e as s
} from "../_deps/K33OSGN4.js";
import {
  c as e,
  e as g
} from "../_deps/4U34M3I6.js";
import {
  a as d
} from "../_deps/RUVYHBJQ.js";

// convex/seo/library.ts
g();
k();
var v = b({
  args: {
    keyword: e.string(),
    embedding: e.array(e.float64()),
    searchVolume: e.number(),
    difficulty: e.number(),
    intent: e.string()
  },
  handler: /* @__PURE__ */ d(async (t, r) => {
    let o = await t.db.query("keywordLibrary").withIndex("by_keyword", (i) => i.eq("keyword", r.keyword)).first();
    o ? await t.db.patch(o._id, {
      embedding: r.embedding,
      // Update embedding if needed
      searchVolume: r.searchVolume,
      difficulty: r.difficulty,
      intent: r.intent,
      updatedAt: Date.now()
    }) : await t.db.insert("keywordLibrary", {
      keyword: r.keyword,
      embedding: r.embedding,
      searchVolume: r.searchVolume,
      difficulty: r.difficulty,
      intent: r.intent,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }, "handler")
}), A = w({
  args: {
    ids: e.array(e.id("keywordLibrary"))
  },
  handler: /* @__PURE__ */ d(async (t, r) => {
    let o = [];
    for (let i of r.ids) {
      let a = await t.db.get(i);
      a && o.push(a);
    }
    return o;
  }, "handler")
}), I = y({
  args: {
    id: e.id("keywordLibrary")
  },
  handler: /* @__PURE__ */ d(async (t, r) => await t.db.get(r.id), "handler")
}), M = y({
  args: {
    paginationOpts: e.any(),
    minVolume: e.optional(e.number()),
    maxDifficulty: e.optional(e.number())
  },
  handler: /* @__PURE__ */ d(async (t, r) => await t.db.query("keywordLibrary").order("desc").paginate(r.paginationOpts), "handler")
}), B = y({
  args: {},
  handler: /* @__PURE__ */ d(async (t) => (await t.db.query("keywordLibrary").collect()).length, "handler")
}), C = s({
  args: {
    keywords: e.array(
      e.object({
        keyword: e.string(),
        searchVolume: e.number(),
        difficulty: e.number(),
        intent: e.string()
      })
    )
  },
  handler: /* @__PURE__ */ d(async (t, r) => {
    for (let o of r.keywords)
      try {
        let { embedding: i } = await l({
          model: m.embedding("text-embedding-3-small"),
          value: o.keyword
        });
        await t.runMutation(c.seo.library.upsertKeyword, {
          keyword: o.keyword,
          embedding: i,
          searchVolume: o.searchVolume,
          difficulty: o.difficulty,
          intent: o.intent
        });
      } catch (i) {
        console.error(`Failed to seed keyword ${o.keyword}:`, i);
      }
  }, "handler")
}), O = s({
  args: {
    query: e.string(),
    limit: e.optional(e.number())
  },
  handler: /* @__PURE__ */ d(async (t, r) => {
    let { embedding: o } = await l({
      model: m.embedding("text-embedding-3-small"),
      value: r.query
    }), i = await t.vectorSearch("keywordLibrary", "by_embedding", {
      vector: o,
      limit: r.limit || 20
    }), a = i.map((n) => n._id), p = await t.runQuery(c.seo.library.getKeywordsByIds, { ids: a }), f = new Map(p.map((n) => [n._id, n]));
    return i.map((n) => {
      let u = f.get(n._id);
      return u ? { ...u, _score: n._score } : null;
    }).filter((n) => n !== null);
  }, "handler")
});
export {
  I as getKeyword,
  B as getKeywordCount,
  A as getKeywordsByIds,
  M as listKeywords,
  O as searchLibrary,
  C as seedKeywords,
  v as upsertKeyword
};
//# sourceMappingURL=library.js.map
