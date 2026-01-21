import {
  a as i,
  c as l,
  d as s
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as u
} from "../_deps/4U34M3I6.js";
import {
  a as r
} from "../_deps/RUVYHBJQ.js";

// convex/content/contentTemplates.ts
u();
var d = [
  { rule: "wordCount", value: "750" },
  { rule: "faqCount", value: "3" },
  { rule: "mainKeywordCount", value: "4" },
  { rule: "secondaryKeywordCount", value: "2" },
  { rule: "internalLinks", value: "3" },
  { rule: "keywordInFirst100Words", value: "true" },
  { rule: "metaDescriptionLength", value: "150-160" },
  { rule: "imageAltText", value: "true" }
], T = i({
  args: {
    projectId: t.optional(t.id("projects")),
    pageType: t.string()
  },
  handler: /* @__PURE__ */ r(async (o, e) => {
    if (e.projectId) {
      let n = await o.db.query("contentTemplates").withIndex("by_project", (p) => p.eq("projectId", e.projectId)).filter((p) => p.eq(p.field("pageType"), e.pageType)).first();
      if (n) return n;
    }
    return await o.db.query("contentTemplates").withIndex("by_page_type", (n) => n.eq("pageType", e.pageType)).filter((n) => n.eq(n.field("projectId"), void 0)).first();
  }, "handler")
}), y = i({
  args: {
    projectId: t.optional(t.id("projects"))
  },
  handler: /* @__PURE__ */ r(async (o, e) => e.projectId ? await o.db.query("contentTemplates").withIndex("by_project", (a) => a.eq("projectId", e.projectId)).collect() : await o.db.query("contentTemplates").withIndex("by_default", (a) => a.eq("isDefault", !0)).collect(), "handler")
}), w = l({
  args: {
    templateId: t.optional(t.id("contentTemplates")),
    projectId: t.optional(t.id("projects")),
    pageType: t.string(),
    name: t.string(),
    promptTemplate: t.string(),
    seoChecklist: t.optional(
      t.array(t.object({ rule: t.string(), value: t.optional(t.string()) }))
    ),
    wordCountTarget: t.optional(t.number()),
    isDefault: t.optional(t.boolean())
  },
  handler: /* @__PURE__ */ r(async (o, e) => {
    let a = Date.now();
    return e.templateId ? (await o.db.patch(e.templateId, {
      pageType: e.pageType,
      name: e.name,
      promptTemplate: e.promptTemplate,
      seoChecklist: e.seoChecklist,
      wordCountTarget: e.wordCountTarget,
      isDefault: e.isDefault,
      updatedAt: a
    }), e.templateId) : await o.db.insert("contentTemplates", {
      projectId: e.projectId,
      pageType: e.pageType,
      name: e.name,
      promptTemplate: e.promptTemplate,
      seoChecklist: e.seoChecklist,
      wordCountTarget: e.wordCountTarget,
      isDefault: e.isDefault,
      createdAt: a,
      updatedAt: a
    });
  }, "handler")
}), f = s({
  args: {},
  handler: /* @__PURE__ */ r(async (o) => {
    if (await o.db.query("contentTemplates").withIndex("by_default", (n) => n.eq("isDefault", !0)).first()) {
      console.log("Default templates already exist");
      return;
    }
    let a = Date.now();
    await o.db.insert("contentTemplates", {
      projectId: void 0,
      pageType: "blog",
      name: "Blog Post Template",
      promptTemplate: `Write a {{wordCount}}-word blog post titled "{{title}}" for {{companyName}}.

Target keywords (use each multiple times naturally):
{{keywords}}

Requirements:
- Include 3 FAQ questions with clear answers
- Write a compelling meta description (150-160 characters)
- Use the main keyword in the first 100 words
- Include a strong call to action
- Use H2 and H3 subheadings
- Write for humans first, search engines second

Return JSON: { content, metaDescription, faqs: [{question, answer}], cta }`,
      seoChecklist: d,
      wordCountTarget: 1200,
      isDefault: !0,
      createdAt: a,
      updatedAt: a
    }), await o.db.insert("contentTemplates", {
      projectId: void 0,
      pageType: "service",
      name: "Service Page Template",
      promptTemplate: `Optimize content for the {{pageType}} page on {{companyName}} website.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 800-1200 words
- Include metadata
- Strong call to action
- Focus on benefits and outcomes

Current content to optimize:
{{existingContent}}

Return JSON: { content, metaDescription, cta }`,
      seoChecklist: d,
      wordCountTarget: 1e3,
      isDefault: !0,
      createdAt: a,
      updatedAt: a
    }), await o.db.insert("contentTemplates", {
      projectId: void 0,
      pageType: "homepage",
      name: "Homepage Template",
      promptTemplate: `Optimize the homepage for {{companyName}}.
Title: "{{title}}"

Target keywords: {{keywords}}

Requirements:
- 400-600 words
- Clear value proposition
- Main service offerings
- Trust signals and social proof
- Primary CTA

Return JSON: { content, metaDescription, cta }`,
      seoChecklist: [
        { rule: "wordCount", value: "500" },
        { rule: "mainKeywordCount", value: "3" }
      ],
      wordCountTarget: 500,
      isDefault: !0,
      createdAt: a,
      updatedAt: a
    }), console.log("Seeded default content templates");
  }, "handler")
});
export {
  T as getTemplateByPageType,
  y as getTemplatesByProject,
  f as seedDefaultTemplates,
  w as upsertTemplate
};
//# sourceMappingURL=contentTemplates.js.map
