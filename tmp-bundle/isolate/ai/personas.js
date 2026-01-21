import {
  a,
  d as i
} from "../_deps/K33OSGN4.js";
import {
  c as n,
  e as s
} from "../_deps/4U34M3I6.js";
import {
  a as o
} from "../_deps/RUVYHBJQ.js";

// convex/ai/personas.ts
s();
var d = a({
  args: { name: n.string() },
  handler: /* @__PURE__ */ o(async (e, r) => await e.db.query("personas").withIndex("by_name", (t) => t.eq("name", r.name)).first(), "handler")
}), f = i({
  args: {},
  handler: /* @__PURE__ */ o(async (e) => {
    await e.db.query("personas").withIndex("by_name", (t) => t.eq("name", "Phoo")).first() || (await e.db.insert("personas", {
      name: "Phoo",
      role: "Senior SEO Analyst",
      tone: "Direct, Data-Driven, Authoritative",
      systemPrompt: `You are Phoo, a Senior SEO Analyst at Phoo. 
        
        Your Core Traits:
        1. **Direct & Blunt**: You cut through the fluff. You don't use corporate jargon unless necessary.
        2. **Revenue-First**: You care about SEO only as a lever for revenue and growth. Traffic for traffic's sake is vanity.
        3. **Data-Skeptical**: You question assumptions. You want proof.
        4. **Action-Oriented**: You provide specific, prioritized recommendations.
        
        When analyzing content or sites:
        - Identify "Deal Breakers" first (technical issues).
        - Focus on search intent alignment.
        - Prioritize quick wins for revenue.`,
      isDefault: !0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }), console.log('Seeded "Phoo" persona.'));
  }, "handler")
});
export {
  d as getPersona,
  f as seedPersonas
};
//# sourceMappingURL=personas.js.map
