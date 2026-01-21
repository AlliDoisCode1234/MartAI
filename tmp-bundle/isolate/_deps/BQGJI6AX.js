import {
  a as c
} from "./RUVYHBJQ.js";

// convex/ai/providers/google.ts
var a = class m {
  static {
    c(this, "GoogleProvider");
  }
  name = "google";
  // Updated January 2026 - Gemini 2.5 series (2.0 still available)
  static MODELS = [
    {
      modelId: "gemini-2.5-flash",
      displayName: "Gemini 2.5 Flash",
      capabilities: ["chat", "vision", "function_calling"],
      contextWindow: 1e6,
      costPer1kInputTokens: 0.015,
      // $0.15/1M
      costPer1kOutputTokens: 0.06,
      // $0.60/1M
      priority: 1
      // Cheap tier (fast + affordable)
    },
    {
      modelId: "gemini-2.0-flash",
      displayName: "Gemini 2.0 Flash",
      capabilities: ["chat", "vision", "function_calling"],
      contextWindow: 1e6,
      costPer1kInputTokens: 75e-4,
      // $0.075/1M
      costPer1kOutputTokens: 0.03,
      // $0.30/1M
      priority: 2
      // Legacy cheap tier
    },
    {
      modelId: "gemini-2.5-pro",
      displayName: "Gemini 2.5 Pro",
      capabilities: ["chat", "vision", "function_calling", "structured_output"],
      contextWindow: 2e6,
      costPer1kInputTokens: 0.125,
      // $1.25/1M (<200K), $2.50/1M (>200K)
      costPer1kOutputTokens: 0.5,
      // $5/1M (<200K), $10/1M (>200K)
      priority: 3
      // Premium reasoning tier
    }
  ];
  isConfigured() {
    return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  }
  getModels() {
    return m.MODELS;
  }
  async generateText(e, t = "gemini-2.0-flash") {
    let n = Date.now(), { GoogleGenerativeAI: r } = await import("./JBJ5UODT.js"), i = new r(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
    try {
      let s = (await i.getGenerativeModel({ model: t }).startChat({
        history: e.systemPrompt ? [
          { role: "user", parts: [{ text: "System: " + e.systemPrompt }] },
          { role: "model", parts: [{ text: "Understood." }] }
        ] : []
      }).sendMessage(e.prompt)).response;
      return {
        content: s.text(),
        usage: {
          promptTokens: s.usageMetadata?.promptTokenCount || 0,
          completionTokens: s.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: s.usageMetadata?.totalTokenCount || 0
        },
        finishReason: "stop",
        latencyMs: Date.now() - n,
        model: t,
        provider: this.name
      };
    } catch (o) {
      let l = o instanceof Error ? o.message : "Unknown error";
      throw new Error(`[Google] ${t} failed: ${l}`);
    }
  }
  async generateEmbeddings(e) {
    let { GoogleGenerativeAI: t } = await import("./JBJ5UODT.js"), r = new t(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").getGenerativeModel({ model: "text-embedding-004" });
    return (await Promise.all(e.map((o) => r.embedContent(o)))).map((o) => o.embedding.values);
  }
  async healthCheck() {
    if (!this.isConfigured())
      return { healthy: !1, latencyMs: 0, error: "API key not configured" };
    let e = Date.now();
    try {
      return await this.generateText(
        { prompt: "Say OK", maxTokens: 5, temperature: 0 },
        "gemini-2.0-flash"
      ), { healthy: !0, latencyMs: Date.now() - e };
    } catch (t) {
      let n = t instanceof Error ? t.message : "Unknown error";
      return {
        healthy: !1,
        latencyMs: Date.now() - e,
        error: n
      };
    }
  }
}, d = new a();

export {
  a,
  d as b
};
//# sourceMappingURL=BQGJI6AX.js.map
