import {
  c as s
} from "../../_deps/K33OSGN4.js";
import "../../_deps/4U34M3I6.js";
import {
  a as o
} from "../../_deps/RUVYHBJQ.js";

// convex/ai/providers/seed.ts
var l = s({
  args: {},
  handler: /* @__PURE__ */ o(async (t) => {
    let e = Date.now();
    if (await t.db.query("aiProviders").first())
      return console.log("[Seed] Providers already exist, skipping seed"), { seeded: !1, message: "Providers already exist" };
    let r = await t.db.insert("aiProviders", {
      name: "openai",
      displayName: "OpenAI",
      apiKeyEnvVar: "OPENAI_API_KEY",
      isEnabled: !0,
      priority: 1,
      createdAt: e,
      updatedAt: e
    });
    await t.db.insert("aiModels", {
      providerId: r,
      modelId: "gpt-4o",
      displayName: "GPT-4o",
      capabilities: ["chat", "vision", "function_calling", "structured_output"],
      contextWindow: 128e3,
      costPer1kInputTokens: 0.25,
      costPer1kOutputTokens: 1,
      isEnabled: !0,
      priority: 1,
      createdAt: e
    }), await t.db.insert("aiModels", {
      providerId: r,
      modelId: "gpt-4o-mini",
      displayName: "GPT-4o Mini",
      capabilities: ["chat", "vision", "function_calling", "structured_output"],
      contextWindow: 128e3,
      costPer1kInputTokens: 0.015,
      costPer1kOutputTokens: 0.06,
      isEnabled: !0,
      priority: 2,
      createdAt: e
    }), await t.db.insert("aiProviderHealth", {
      providerId: r,
      status: "healthy",
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: "closed",
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: e,
      updatedAt: e
    });
    let i = await t.db.insert("aiProviders", {
      name: "anthropic",
      displayName: "Anthropic Claude",
      apiKeyEnvVar: "ANTHROPIC_API_KEY",
      isEnabled: !0,
      priority: 2,
      createdAt: e,
      updatedAt: e
    });
    await t.db.insert("aiModels", {
      providerId: i,
      modelId: "claude-3-5-sonnet-20241022",
      displayName: "Claude 3.5 Sonnet",
      capabilities: ["chat", "vision", "function_calling"],
      contextWindow: 2e5,
      costPer1kInputTokens: 0.3,
      costPer1kOutputTokens: 1.5,
      isEnabled: !0,
      priority: 1,
      createdAt: e
    }), await t.db.insert("aiModels", {
      providerId: i,
      modelId: "claude-3-haiku-20240307",
      displayName: "Claude 3 Haiku",
      capabilities: ["chat", "vision"],
      contextWindow: 2e5,
      costPer1kInputTokens: 0.025,
      costPer1kOutputTokens: 0.125,
      isEnabled: !0,
      priority: 2,
      createdAt: e
    }), await t.db.insert("aiProviderHealth", {
      providerId: i,
      status: "healthy",
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: "closed",
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: e,
      updatedAt: e
    });
    let a = await t.db.insert("aiProviders", {
      name: "google",
      displayName: "Google Gemini",
      apiKeyEnvVar: "GOOGLE_AI_API_KEY",
      isEnabled: !0,
      priority: 3,
      createdAt: e,
      updatedAt: e
    });
    return await t.db.insert("aiModels", {
      providerId: a,
      modelId: "gemini-1.5-pro",
      displayName: "Gemini 1.5 Pro",
      capabilities: ["chat", "vision", "function_calling", "structured_output", "embeddings"],
      contextWindow: 2e6,
      costPer1kInputTokens: 0.125,
      costPer1kOutputTokens: 0.5,
      isEnabled: !0,
      priority: 1,
      createdAt: e
    }), await t.db.insert("aiModels", {
      providerId: a,
      modelId: "gemini-1.5-flash",
      displayName: "Gemini 1.5 Flash",
      capabilities: ["chat", "vision", "function_calling"],
      contextWindow: 1e6,
      costPer1kInputTokens: 75e-4,
      costPer1kOutputTokens: 0.03,
      isEnabled: !0,
      priority: 2,
      createdAt: e
    }), await t.db.insert("aiProviderHealth", {
      providerId: a,
      status: "healthy",
      avgLatencyMs: 0,
      errorRate: 0,
      successCount: 0,
      errorCount: 0,
      circuitState: "closed",
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastHealthCheckAt: e,
      updatedAt: e
    }), console.log("[Seed] Created 3 providers with 6 models"), { seeded: !0, providers: 3, models: 6 };
  }, "handler")
}), u = s({
  args: {},
  handler: /* @__PURE__ */ o(async (t) => {
    let e = await t.db.query("aiProviders").collect(), d = await t.db.query("aiModels").collect(), r = await t.db.query("aiProviderHealth").collect();
    return e.map((i) => ({
      ...i,
      models: d.filter((a) => a.providerId === i._id),
      health: r.find((a) => a.providerId === i._id)
    }));
  }, "handler")
});
export {
  u as getProviderSummary,
  l as seedProviders
};
//# sourceMappingURL=seed.js.map
