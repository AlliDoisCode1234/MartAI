import {
  a
} from "./RUVYHBJQ.js";

// convex/ai/providers/anthropic.ts
var s = class i {
  static {
    a(this, "AnthropicProvider");
  }
  name = "anthropic";
  // Updated January 2026 - Claude 4 series (Claude 3.5 deprecated Aug 2025)
  static MODELS = [
    {
      modelId: "claude-sonnet-4-20250514",
      displayName: "Claude Sonnet 4",
      capabilities: ["chat", "vision", "function_calling"],
      contextWindow: 2e5,
      costPer1kInputTokens: 0.3,
      // $3/1M
      costPer1kOutputTokens: 1.5,
      // $15/1M
      priority: 1
      // Standard tier
    },
    {
      modelId: "claude-haiku-4-20251015",
      displayName: "Claude Haiku 4.5",
      capabilities: ["chat", "vision"],
      contextWindow: 2e5,
      costPer1kInputTokens: 0.025,
      // $0.25/1M
      costPer1kOutputTokens: 0.125,
      // $1.25/1M
      priority: 2
      // Cheap tier
    },
    {
      modelId: "claude-opus-4-20250522",
      displayName: "Claude Opus 4",
      capabilities: ["chat", "vision", "function_calling"],
      contextWindow: 2e5,
      costPer1kInputTokens: 1.5,
      // $15/1M
      costPer1kOutputTokens: 7.5,
      // $75/1M
      priority: 3
      // Premium tier
    }
  ];
  isConfigured() {
    return !!process.env.ANTHROPIC_API_KEY;
  }
  getModels() {
    return i.MODELS;
  }
  async generateText(t, o = "claude-sonnet-4-20250514") {
    let n = Date.now(), c = (await import("./345QQBJG.js")).default, u = new c({ apiKey: process.env.ANTHROPIC_API_KEY });
    try {
      let e = await u.messages.create({
        model: o,
        max_tokens: t.maxTokens || 4096,
        system: t.systemPrompt,
        messages: [{ role: "user", content: t.prompt }]
      });
      return {
        content: e.content.find((p) => p.type === "text")?.text || "",
        usage: {
          promptTokens: e.usage.input_tokens,
          completionTokens: e.usage.output_tokens,
          totalTokens: e.usage.input_tokens + e.usage.output_tokens
        },
        finishReason: e.stop_reason === "end_turn" ? "stop" : "length",
        latencyMs: Date.now() - n,
        model: o,
        provider: this.name
      };
    } catch (e) {
      let r = e instanceof Error ? e.message : "Unknown error";
      throw new Error(`[Anthropic] ${o} failed: ${r}`);
    }
  }
  async generateEmbeddings() {
    throw new Error("Anthropic does not support embeddings - use OpenAI or Google");
  }
  async healthCheck() {
    if (!this.isConfigured())
      return { healthy: !1, latencyMs: 0, error: "API key not configured" };
    let t = Date.now();
    try {
      return await this.generateText(
        { prompt: "Say OK", maxTokens: 5, temperature: 0 },
        "claude-haiku-4-20251015"
      ), { healthy: !0, latencyMs: Date.now() - t };
    } catch (o) {
      let n = o instanceof Error ? o.message : "Unknown error";
      return {
        healthy: !1,
        latencyMs: Date.now() - t,
        error: n
      };
    }
  }
}, l = new s();

export {
  s as a,
  l as b
};
//# sourceMappingURL=II2L62UT.js.map
