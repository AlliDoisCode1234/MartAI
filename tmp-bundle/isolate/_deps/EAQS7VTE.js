import {
  b as T
} from "./NSU5VCTB.js";
import {
  a as y,
  b as u,
  e as I
} from "./GTU362KY.js";
import {
  e as k
} from "./K33OSGN4.js";
import {
  c as r,
  e as v
} from "./4U34M3I6.js";
import {
  a as f
} from "./RUVYHBJQ.js";

// convex/ai/router/router.ts
v();
I();
var $ = k({
  args: {
    prompt: r.string(),
    systemPrompt: r.optional(r.string()),
    maxTokens: r.optional(r.number()),
    temperature: r.optional(r.number()),
    taskType: r.optional(r.string()),
    strategy: r.optional(r.string()),
    preferredProvider: r.optional(r.string()),
    userId: r.optional(r.id("users"))
  },
  handler: /* @__PURE__ */ f(async (c, t) => {
    let m = Date.now(), p = [], l = {
      prompt: t.prompt,
      systemPrompt: t.systemPrompt,
      maxTokens: t.maxTokens,
      temperature: t.temperature
    }, g = t.taskType || "chat", o = t.strategy || "balanced", e = await P(c, {
      taskType: g,
      strategy: o,
      preferredProvider: t.preferredProvider
    });
    if (e.length === 0)
      throw new Error("[AIRouter] No configured AI providers available");
    for (let { provider: i, modelId: d, providerId: s } of e) {
      if (await c.runQuery(y.ai.health.circuitBreaker.isCircuitOpen, {
        providerId: s
      })) {
        p.push(`${i.name}:circuit_open`);
        continue;
      }
      try {
        let a = await i.generateText(l, d);
        return await c.runMutation(u.ai.health.circuitBreaker.recordSuccess, {
          providerId: s,
          latencyMs: a.latencyMs
        }), t.userId && await c.runMutation(u.ai.admin.usageTracking.recordUsage, {
          userId: t.userId,
          projectId: void 0,
          // Can be extended to pass projectId
          provider: i.name,
          model: d,
          taskType: g,
          inputTokens: a.usage.promptTokens,
          outputTokens: a.usage.completionTokens
        }), console.log(
          `[AIRouter] SUCCESS: ${i.name}/${d} (${a.latencyMs}ms, ${a.usage.totalTokens} tokens)`
        ), a;
      } catch (a) {
        let h = a instanceof Error ? a.message : "Unknown error";
        await c.runMutation(u.ai.health.circuitBreaker.recordFailure, {
          providerId: s,
          errorMessage: h
        }), p.push(`${i.name}:${h.substring(0, 50)}`), console.warn(`[AIRouter] ${i.name} failed, trying next...`, h);
      }
    }
    throw console.error(`[AIRouter] All providers failed. Chain: ${p.join(" \u2192 ")}`), new Error(`[AIRouter] All providers failed. Chain: ${p.join(" \u2192 ")}`);
  }, "handler")
}), M = {
  chat: "cheap",
  embeddings: "cheap",
  brief: "standard",
  draft: "standard",
  structured: "standard",
  vision: "premium"
};
async function P(c, t) {
  let m = T();
  if (m.length === 0)
    return [];
  let p = await c.runQuery(
    y.ai.health.circuitBreaker.getAllProviderHealth,
    {}
  ), l = M[t.taskType || "chat"] || "standard";
  return m.map((o) => {
    let e = p.find((a) => a.name === o.name), i = o.getModels(), d = i[0]?.modelId;
    e?.provider && (e.provider.taskTierModels?.[l] ? d = e.provider.taskTierModels[l] : e.provider.defaultModel && (d = e.provider.defaultModel));
    let s = i.find((a) => a.modelId === d) || i[0], n = 100;
    return e?.health && (e.health.circuitState === "open" && (n -= 100), e.health.circuitState === "half_open" && (n -= 50), n -= e.health.errorRate * 30, n -= Math.min(e.health.avgLatencyMs / 100, 20)), t.strategy === "cheapest" && s ? n -= (s.costPer1kInputTokens + s.costPer1kOutputTokens) * 10 : t.strategy === "fastest" ? n += 20 - Math.min((e?.health?.avgLatencyMs || 0) / 50, 20) : t.strategy === "best_quality" && s && (n += (10 - s.priority) * 5), t.preferredProvider === o.name && (n += 30), {
      provider: o,
      modelId: d,
      providerId: e?._id,
      score: n
    };
  }).filter((o) => o.providerId).sort((o, e) => e.score - o.score);
}
f(P, "getOrderedProviders");

export {
  $ as a
};
//# sourceMappingURL=EAQS7VTE.js.map
