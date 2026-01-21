import {
  b as r,
  e as v
} from "../../_deps/GTU362KY.js";
import {
  d as s
} from "../../_deps/K33OSGN4.js";
import "../../_deps/4U34M3I6.js";
import {
  a as n
} from "../../_deps/RUVYHBJQ.js";

// convex/ai/health/seedProviders.ts
v();
var y = s({
  handler: /* @__PURE__ */ n(async (a) => {
    let l = await a.db.query("aiProviders").collect(), o = [
      { name: "openai", displayName: "OpenAI", apiKeyEnvVar: "OPENAI_API_KEY" },
      { name: "anthropic", displayName: "Anthropic", apiKeyEnvVar: "ANTHROPIC_API_KEY" },
      {
        name: "google",
        displayName: "Google Gemini",
        apiKeyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY"
      }
    ], d = 0, t = 0;
    for (let e of o)
      if (!l.find((i) => i.name === e.name)) {
        let i = await a.db.insert("aiProviders", {
          name: e.name,
          displayName: e.displayName,
          apiKeyEnvVar: e.apiKeyEnvVar,
          isEnabled: !0,
          priority: o.indexOf(e) + 1,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        await a.runMutation(r.ai.health.circuitBreaker.initializeHealth, {
          providerId: i
        }), d++, console.log(`[SeedProviders] Added provider: ${e.name}`);
      }
    let p = await a.db.query("aiProviders").collect();
    for (let e of p)
      await a.db.query("aiProviderHealth").withIndex("by_provider", (c) => c.eq("providerId", e._id)).first() || (await a.runMutation(r.ai.health.circuitBreaker.initializeHealth, {
        providerId: e._id
      }), t++, console.log(`[SeedProviders] Repaired health record for: ${e.name}`));
    return {
      success: !0,
      message: `Seeded ${d} new providers. Repaired ${t} health records.`
    };
  }, "handler")
});
export {
  y as seedProviders
};
//# sourceMappingURL=seedProviders.js.map
