import {
  a as E,
  c as S,
  d as A
} from "./_deps/T2KGGNQC.js";
import {
  j as P
} from "./_deps/JABLGPTX.js";
import {
  a as T,
  b as y,
  e as j
} from "./_deps/GTU362KY.js";
import {
  a as O
} from "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import {
  d as I,
  e as M,
  f as k
} from "./_deps/K33OSGN4.js";
import {
  c as t,
  e as x
} from "./_deps/4U34M3I6.js";
import {
  a as l
} from "./_deps/RUVYHBJQ.js";

// convex/contentGeneration.ts
x();
j();
var v = 90, $ = 3, V = M({
  args: {
    projectId: t.id("projects"),
    contentType: S,
    title: t.string(),
    keywords: t.array(t.string()),
    clusterId: t.optional(t.id("keywordClusters"))
  },
  handler: /* @__PURE__ */ l(async (n, e) => {
    let r = await O.getUserId(n);
    if (!r) throw new Error("Unauthorized");
    return await n.runAction(y.contentGeneration.generateContentInternal, {
      ...e,
      userId: r
    });
  }, "handler")
}), z = k({
  args: {
    projectId: t.id("projects"),
    contentType: S,
    title: t.string(),
    keywords: t.array(t.string()),
    clusterId: t.optional(t.id("keywordClusters")),
    userId: t.id("users")
  },
  handler: /* @__PURE__ */ l(async (n, e) => {
    let { userId: r } = e, s = await n.runMutation(
      y.ai.writerPersonas.index.getOrCreatePersonaInternal,
      {
        projectId: e.projectId,
        userId: r
      }
    ), o = s ? P(s) : "", i = await n.runMutation(
      y.contentGeneration.createContentPiece,
      {
        projectId: e.projectId,
        contentType: e.contentType,
        title: e.title,
        keywords: e.keywords,
        clusterId: e.clusterId
      }
    ), u = await F(
      n,
      e.contentType,
      e.title,
      e.keywords,
      o
    );
    await n.runMutation(y.contentGeneration.updateContentPiece, {
      contentPieceId: i,
      h2Outline: u,
      status: "generating"
    });
    let a = 0, h = "", c = 0, d = {};
    for (; a < $; ) {
      a++, console.log(`[ContentGeneration] Attempt ${a}/${$}`);
      let p = await N(
        n,
        e.contentType,
        e.title,
        u,
        e.keywords,
        o,
        a > 1
        // Add quality hints on retries
      ), f = A[e.contentType]?.wordCount || 1200, { score: g, metrics: C } = B(p, u, e.keywords, f);
      if (console.log(`[ContentGeneration] Score: ${g}`), g > c && (h = p, c = g, d = C), g >= v) {
        console.log(`[ContentGeneration] Quality threshold met (${g} >= ${v})`);
        break;
      }
      a < $ && (console.log("[ContentGeneration] Retrying for better quality..."), await n.runMutation(y.contentGeneration.updateContentPiece, {
        contentPieceId: i,
        generationAttempts: a
      }));
    }
    return await n.runMutation(y.contentGeneration.updateContentPiece, {
      contentPieceId: i,
      content: h,
      wordCount: W(h),
      seoScore: c,
      qualityMetrics: d,
      generationAttempts: a,
      status: "draft"
    }), console.log(
      `[ContentGeneration] Complete. Final score: ${c} after ${a} attempt(s)`
    ), i;
  }, "handler")
}), X = I({
  args: {
    projectId: t.id("projects"),
    contentType: t.union(
      // Core Pages
      t.literal("homepage"),
      t.literal("about"),
      t.literal("service"),
      t.literal("landing"),
      // Blog Content
      t.literal("blog"),
      t.literal("blogVersus"),
      t.literal("blogVideo"),
      t.literal("contentRefresh"),
      // Conversion
      t.literal("leadMagnet"),
      t.literal("paidProduct"),
      // Local/Geo
      t.literal("areasWeServe"),
      // Specialty
      t.literal("employment"),
      t.literal("mentorship"),
      t.literal("donate"),
      t.literal("events"),
      t.literal("partner"),
      t.literal("program")
    ),
    title: t.string(),
    keywords: t.array(t.string()),
    clusterId: t.optional(t.id("keywordClusters"))
  },
  handler: /* @__PURE__ */ l(async (n, e) => {
    let r = Date.now();
    return await n.db.insert("contentPieces", {
      projectId: e.projectId,
      clusterId: e.clusterId,
      contentType: e.contentType,
      title: e.title,
      h2Outline: [],
      keywords: e.keywords,
      status: "generating",
      generationAttempts: 0,
      createdAt: r,
      updatedAt: r
    });
  }, "handler")
}), J = I({
  args: {
    contentPieceId: t.id("contentPieces"),
    h2Outline: t.optional(t.array(t.string())),
    content: t.optional(t.string()),
    wordCount: t.optional(t.number()),
    seoScore: t.optional(t.number()),
    qualityMetrics: t.optional(
      t.object({
        wordCountScore: t.number(),
        h2Score: t.number(),
        keywordScore: t.number(),
        linkScore: t.number(),
        readabilityScore: t.number(),
        uniquenessScore: t.optional(t.number())
      })
    ),
    generationAttempts: t.optional(t.number()),
    status: t.optional(
      t.union(
        t.literal("generating"),
        t.literal("draft"),
        t.literal("approved"),
        t.literal("published"),
        t.literal("scheduled")
      )
    )
  },
  handler: /* @__PURE__ */ l(async (n, e) => {
    let { contentPieceId: r, ...s } = e, o = Object.fromEntries(Object.entries(s).filter(([, i]) => i !== void 0));
    await n.db.patch(r, {
      ...o,
      updatedAt: Date.now()
    });
  }, "handler")
});
async function F(n, e, r, s, o = "") {
  let i = s[0] || "topic", u = G(e), a = o ? `

CONTEXT FROM BRAND PERSONA:
${o}

Apply the above brand context to your outline.` : "", h = `You are an expert SEO content strategist. Generate a content outline for a ${e} article.

Requirements:
- Create exactly ${u} H2 sections
- Include introduction and conclusion
- Focus on the primary keyword: "${i}"
- Optimize for search intent and user value
- Each section should be actionable and specific
${a}
Respond with ONLY the section titles, one per line. No numbering, no markdown, just the titles.`, c = `Create an SEO-optimized outline for: "${r}"

Keywords to incorporate: ${s.join(", ")}
Content type: ${e}`;
  try {
    let p = (await n.runAction(T.ai.router.router.generateWithFallback, {
      prompt: c,
      systemPrompt: h,
      maxTokens: 500,
      temperature: 0.7,
      taskType: "analysis",
      strategy: "best_quality"
    })).content.split(`
`).map((m) => m.trim()).filter((m) => m.length > 0 && !m.startsWith("#"));
    return p.length > 0 ? p : R(e, i);
  } catch (d) {
    return console.warn("[ContentGeneration] AI outline failed, using template:", d), R(e, i);
  }
}
l(F, "generateOutlineWithAI");
async function N(n, e, r, s, o, i = "", u = !1) {
  let a = o[0] || "topic", c = L(e) + 300, d = `
QUALITY REQUIREMENTS (MANDATORY):
- Write AT LEAST ${c} words - this is critical for SEO scoring
- Use the primary keyword "${a}" naturally 10-15 times throughout
- Use each secondary keyword at least 2-3 times
- Include at least 1 H2 section for each outline item with 100+ words under each
- Add specific examples, statistics, or actionable tips in each section
- Write transition sentences between sections for flow`, p = u ? `

RETRY BOOST (Previous attempt scored too low):
- Increase word count to ${c + 200}+ words
- Add more detailed examples and explanations
- Expand each section with additional subpoints
- Include FAQ section at the end if not present` : "", m = i ? `

BRAND PERSONA CONTEXT:
${i}

IMPORTANT: Write in the voice and style defined above. Use the vocabulary preferences and avoid the words listed.` : "", f = `You are an expert SEO content writer following E-E-A-T principles (Experience, Expertise, Authoritativeness, Trustworthiness).

Writing guidelines:
- Write in a professional but conversational tone
- Target word count: ${c} words MINIMUM (aim for ${c + 100})
- Use short paragraphs (2-4 sentences max)
- Include actionable advice and specific examples
- Add transition sentences between sections
- Write for readability (aim for Flesch score 60+)
${d}${p}${m}

Format the content as Markdown with:
- H1 title at the top
- H2 headers for each section
- Bold for key terms
- Bullet lists where appropriate`, g = s.map((w, b) => `${b + 1}. ${w}`).join(`
`), C = `Write a complete ${e} article with this outline:

Title: ${r}

Outline:
${g}

Keywords: ${o.join(", ")}

Write the full article now, following the outline structure.`;
  try {
    return (await n.runAction(T.ai.router.router.generateWithFallback, {
      prompt: C,
      systemPrompt: f,
      maxTokens: 4e3,
      temperature: u ? 0.6 : 0.8,
      // Lower temp for quality retries
      taskType: "generation",
      strategy: "best_quality"
    })).content;
  } catch (w) {
    return console.warn("[ContentGeneration] AI content failed, using fallback:", w), U(r, s, o);
  }
}
l(N, "generateFullContentWithAI");
function G(n) {
  return {
    blog: 8,
    pillar: 10,
    howto: 8,
    comparison: 9,
    listicle: 9
  }[n] || 8;
}
l(G, "getTargetSections");
function L(n) {
  let e = A[n];
  return e ? e.wordCount : {
    pillar: 3500,
    howto: 1800,
    comparison: 2e3,
    listicle: 1500
  }[n] || E.wordCount;
}
l(L, "getTargetWords");
function R(n, e) {
  let r = {
    blog: [
      "Introduction",
      `What is ${e}?`,
      `Why ${e} Matters`,
      "Key Benefits",
      "How to Get Started",
      "Best Practices",
      "Common Mistakes to Avoid",
      "Conclusion"
    ],
    pillar: [
      "Introduction",
      `Complete Guide to ${e}`,
      "Understanding the Fundamentals",
      "Step-by-Step Process",
      "Advanced Strategies",
      "Tools and Resources",
      "Case Studies",
      "Expert Tips",
      "Frequently Asked Questions",
      "Conclusion and Next Steps"
    ],
    howto: [
      "Introduction",
      "What You Will Need",
      "Step 1: Getting Started",
      "Step 2: The Process",
      "Step 3: Implementation",
      "Step 4: Verification",
      "Troubleshooting Common Issues",
      "Conclusion"
    ],
    comparison: [
      "Introduction",
      "Quick Comparison Table",
      "Option A: Overview",
      "Option B: Overview",
      "Feature-by-Feature Comparison",
      "Pricing Comparison",
      "Pros and Cons",
      "Which One is Right for You?",
      "Conclusion"
    ],
    listicle: [
      "Introduction",
      `Top ${e} Options`,
      "1. First Item",
      "2. Second Item",
      "3. Third Item",
      "4. Fourth Item",
      "5. Fifth Item",
      "Honorable Mentions",
      "Conclusion"
    ]
  };
  return r[n] || r.blog;
}
l(R, "getDefaultOutline");
function U(n, e, r) {
  let s = r[0] || "topic", o = `# ${n}

`;
  for (let i of e)
    o += `## ${i}

`, o += `When it comes to ${s}, understanding this section is essential for success. `, o += `Many professionals overlook the importance of ${i.toLowerCase()}, but it can make a significant difference in your results.

`, o += `By focusing on key elements related to ${s}, you can achieve better outcomes. `, o += `This section provides actionable insights that you can implement immediately.

`;
  return o;
}
l(U, "generateFallbackContent");
function W(n) {
  return (n || "").split(/\s+/).filter((e) => e.length > 0).length;
}
l(W, "countWords");
function B(n, e, r, s = 1200) {
  let o = n || "", i = W(o), u = (o.match(/^## /gm) || []).length, a = r[0]?.toLowerCase() || "", h = a ? (o.toLowerCase().match(new RegExp(a, "g")) || []).length : 0, c = Math.min(100, i / s * 100), d = Math.min(100, u / 6 * 100), p = Math.min(100, h / 8 * 100), m = 85, f = e.reduce((w, b) => w + (o.toLowerCase().includes(b.toLowerCase().slice(0, 20)) ? 1 : 0), 0), g = Math.min(100, f / Math.max(e.length, 1) * 100), C = Math.round(
    c * 0.25 + p * 0.25 + g * 0.2 + d * 0.15 + m * 0.15
  );
  return {
    score: Math.min(100, C),
    metrics: {
      wordCountScore: Math.round(c),
      h2Score: Math.round(d),
      keywordScore: Math.round(p),
      structureScore: Math.round(g),
      readabilityScore: Math.round(m)
    }
  };
}
l(B, "scoreContent");
export {
  X as createContentPiece,
  V as generateContent,
  z as generateContentInternal,
  J as updateContentPiece
};
//# sourceMappingURL=contentGeneration.js.map
