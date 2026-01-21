import {
  a as R,
  b as C,
  c as y,
  d as xe,
  h as Ve,
  i as oe
} from "./HHELKCCM.js";
import {
  a as A,
  b as te,
  c as Be,
  d as Le,
  f as $e,
  g as qe,
  h as Ke,
  i as Ye,
  j as se
} from "./YW3B7PJC.js";
import {
  c as ve,
  e as Wt
} from "./GTU362KY.js";
import {
  a as We,
  c as e,
  e as W,
  h as Ie,
  l as be,
  v as ze,
  x as Me
} from "./4U34M3I6.js";
import {
  a as i
} from "./RUVYHBJQ.js";

// node_modules/@convex-dev/agent/dist/client/index.js
Me();
W();

// node_modules/@convex-dev/agent/dist/component/vector/tables.js
Me();
W();
var He = {
  model: e.string(),
  // What table it's stored in. (usually messages or memories)
  table: e.string(),
  userId: e.optional(e.string()),
  threadId: e.optional(e.string()),
  // not set for private threads
  model_table_userId: e.optional(e.array(e.string())),
  model_table_threadId: e.optional(e.array(e.string())),
  vector: e.array(e.number())
}, gs = e.object(C(He, ["model_table_userId", "model_table_threadId"]));
function zt(n) {
  return ze(He).vectorIndex("vector", {
    vectorField: "vector",
    dimensions: n,
    filterFields: ["model_table_userId", "model_table_threadId"]
  }).index("model_table_threadId", ["model", "table", "threadId"]);
}
i(zt, "table");
var z = [
  128,
  256,
  512,
  768,
  1024,
  1408,
  1536,
  2048,
  3072,
  4096
];
function ne(n) {
  if (!z.includes(n))
    throw new Error(`Unsupported vector dimension${n}. Supported: ${z.join(", ")}`);
}
i(ne, "validateVectorDimension");
var Qe = z.map((n) => `embeddings_${n}`), we = xe(...z), fs = xe(...Qe), hs = e.union(...Qe.map((n) => e.id(n)));
var ys = Object.fromEntries(z.map((n) => [
  `embeddings_${n}`,
  zt(n)
]));

// node_modules/@convex-dev/agent/dist/validators.js
W();
var re = e.record(e.string(), e.record(e.string(), e.any())), b = e.optional(re), Xe = re, O = b, Bt = e.union(e.literal("active"), e.literal("archived")), Je = e.union(e.literal("pending"), e.literal("success"), e.literal("failed")), xs = e.union(e.literal("system"), e.literal("user"), e.literal("assistant"), e.literal("tool")), Ze = e.object({
  type: e.literal("text"),
  text: e.string(),
  providerOptions: b,
  providerMetadata: O
}), Lt = e.object({
  type: e.literal("image"),
  image: e.union(e.string(), e.bytes()),
  mimeType: e.optional(e.string()),
  providerOptions: b
}), et = e.object({
  type: e.literal("file"),
  data: e.union(e.string(), e.bytes()),
  filename: e.optional(e.string()),
  mimeType: e.string(),
  providerOptions: b,
  providerMetadata: O
}), tt = e.union(e.string(), e.array(e.union(Ze, Lt, et))), st = e.object({
  type: e.literal("reasoning"),
  text: e.string(),
  signature: e.optional(e.string()),
  providerOptions: b,
  providerMetadata: O
}), $t = e.object({
  type: e.literal("redacted-reasoning"),
  data: e.string(),
  providerOptions: b,
  providerMetadata: O
}), ot = e.array(e.union(st, e.object({
  type: e.literal("text"),
  text: e.string(),
  signature: e.optional(e.string())
}), e.object({ type: e.literal("redacted"), data: e.string() }))), qt = e.union(e.object({
  type: e.literal("source"),
  sourceType: e.literal("url"),
  id: e.string(),
  url: e.string(),
  title: e.optional(e.string()),
  providerOptions: b,
  providerMetadata: O
}), e.object({
  type: e.literal("source"),
  sourceType: e.literal("document"),
  id: e.string(),
  mediaType: e.string(),
  title: e.string(),
  filename: e.optional(e.string()),
  providerOptions: b,
  providerMetadata: O
})), Kt = e.object({
  type: e.literal("tool-call"),
  toolCallId: e.string(),
  toolName: e.string(),
  args: e.any(),
  providerExecuted: e.optional(e.boolean()),
  providerOptions: b,
  providerMetadata: O
}), Yt = e.array(e.union(e.object({ type: e.literal("text"), text: e.string() }), e.object({
  type: e.literal("image"),
  data: e.string(),
  mimeType: e.optional(e.string())
}))), Te = e.union(e.object({ type: e.literal("text"), value: e.string() }), e.object({ type: e.literal("json"), value: e.any() }), e.object({ type: e.literal("error-text"), value: e.string() }), e.object({ type: e.literal("error-json"), value: e.any() }), e.object({
  type: e.literal("content"),
  value: e.array(e.union(e.object({ type: e.literal("text"), text: e.string() }), e.object({
    type: e.literal("media"),
    data: e.string(),
    mediaType: e.string()
  })))
})), nt = e.object({
  type: e.literal("tool-result"),
  toolCallId: e.string(),
  toolName: e.string(),
  output: e.optional(Te),
  providerOptions: b,
  providerMetadata: O,
  providerExecuted: e.optional(e.boolean()),
  // Deprecated in ai v5
  result: e.optional(e.any()),
  // either this or output will be present
  isError: e.optional(e.boolean()),
  // This is only here b/c steps include it in toolResults
  // Normal ModelMessage doesn't have this
  args: e.optional(e.any()),
  experimental_content: e.optional(Yt)
}), rt = e.array(nt), at = e.union(e.string(), e.array(e.union(Ze, et, st, $t, Kt, nt, qt))), Vt = e.union(tt, at, rt), it = e.object({
  role: e.literal("user"),
  content: tt,
  providerOptions: b
}), dt = e.object({
  role: e.literal("assistant"),
  content: at,
  providerOptions: b
}), lt = e.object({
  role: e.literal("tool"),
  content: rt,
  providerOptions: b
}), ct = e.object({
  role: e.literal("system"),
  content: e.string(),
  providerOptions: b
}), B = e.union(it, dt, lt, ct), Se = e.union(e.object({
  type: e.optional(e.literal("source")),
  sourceType: e.literal("url"),
  id: e.string(),
  url: e.string(),
  title: e.optional(e.string()),
  providerOptions: b,
  providerMetadata: O
}), e.object({
  type: e.literal("source"),
  sourceType: e.literal("document"),
  id: e.string(),
  mediaType: e.string(),
  title: e.string(),
  filename: e.optional(e.string()),
  providerOptions: b,
  providerMetadata: O
})), ws = e.object({
  body: e.optional(e.any()),
  // These are not usually present
  headers: e.optional(e.record(e.string(), e.string())),
  method: e.optional(e.string()),
  url: e.optional(e.string())
}), pt = e.union(e.literal("stop"), e.literal("length"), e.literal("content-filter"), e.literal("tool-calls"), e.literal("error"), e.literal("other"), e.literal("unknown")), Oe = e.object({
  promptTokens: e.number(),
  completionTokens: e.number(),
  totalTokens: e.number(),
  reasoningTokens: e.optional(e.number()),
  cachedInputTokens: e.optional(e.number())
}), ut = e.union(e.object({
  type: e.literal("unsupported-setting"),
  setting: e.string(),
  details: e.optional(e.string())
}), e.object({
  type: e.literal("unsupported-tool"),
  tool: e.any(),
  details: e.optional(e.string())
}), e.object({ type: e.literal("other"), message: e.string() })), Ht = e.object({
  message: B,
  text: e.optional(e.string()),
  fileIds: e.optional(e.array(e.id("files"))),
  status: e.optional(Je),
  // metadata
  finishReason: e.optional(pt),
  model: e.optional(e.string()),
  provider: e.optional(e.string()),
  providerMetadata: O,
  sources: e.optional(e.array(Se)),
  reasoning: e.optional(e.string()),
  reasoningDetails: e.optional(ot),
  usage: e.optional(Oe),
  warnings: e.optional(e.array(ut)),
  error: e.optional(e.string())
}), F = e.object({
  ...Ht.fields,
  fileIds: e.optional(e.array(e.string()))
}), Ts = e.object({
  model: e.string(),
  dimension: we,
  vectors: e.array(e.union(e.array(e.number()), e.null()))
}), mt = e.object({
  model: e.string(),
  vectors: e.array(e.union(e.array(e.number()), e.null()))
}), Qt = e.object({
  limit: e.number(),
  textSearch: e.optional(e.boolean()),
  vectorSearch: e.optional(e.boolean()),
  vectorScoreThreshold: e.optional(e.number()),
  messageRange: e.optional(e.object({ before: e.number(), after: e.number() }))
}), Ae = e.object({
  excludeToolMessages: e.optional(e.boolean()),
  recentMessages: e.optional(e.number()),
  searchOptions: e.optional(Qt),
  searchOtherThreads: e.optional(e.boolean())
}), Ee = e.object({
  saveMessages: e.optional(e.union(e.literal("all"), e.literal("none"), e.literal("promptAndOutput")))
}), Xt = {
  system: e.optional(e.string()),
  prompt: e.optional(e.string()),
  messages: e.optional(e.array(B)),
  promptMessageId: e.optional(e.string())
}, Jt = e.object({
  maxOutputTokens: e.optional(e.number()),
  temperature: e.optional(e.number()),
  topP: e.optional(e.number()),
  topK: e.optional(e.number()),
  presencePenalty: e.optional(e.number()),
  frequencyPenalty: e.optional(e.number()),
  stopSequences: e.optional(e.array(e.string())),
  seed: e.optional(e.number()),
  maxRetries: e.optional(e.number()),
  headers: e.optional(e.record(e.string(), e.string()))
}), gt = {
  userId: e.optional(e.string()),
  threadId: e.optional(e.string()),
  contextOptions: e.optional(Ae),
  storageOptions: e.optional(Ee),
  providerOptions: b,
  callSettings: e.optional(Jt),
  ...Xt
}, ft = e.object({
  ...gt,
  stream: e.optional(e.boolean()),
  toolChoice: e.optional(e.union(e.literal("auto"), e.literal("none"), e.literal("required"), e.object({ type: e.literal("tool"), toolName: e.string() }))),
  maxSteps: e.optional(e.number()),
  experimental_continueSteps: e.optional(e.boolean())
}), ht = e.object(gt), Ss = e.object({
  vectors: e.array(e.union(e.array(e.number()), e.null())),
  dimension: we,
  model: e.string()
});
function ae(n) {
  return e.object({
    page: e.array(n),
    continueCursor: e.string(),
    isDone: e.boolean(),
    splitCursor: e.optional(e.union(e.string(), e.null())),
    pageStatus: e.optional(e.union(e.literal("SplitRecommended"), e.literal("SplitRequired"), e.null()))
  });
}
i(ae, "vPaginationResult");
var Zt = e.object({
  streamId: e.string(),
  cursor: e.number()
}), yt = e.optional(e.union(e.object({ kind: e.literal("list"), startOrder: e.optional(e.number()) }), e.object({ kind: e.literal("deltas"), cursors: e.array(Zt) }))), It = e.object({
  streamId: e.string(),
  status: e.union(e.literal("streaming"), e.literal("finished"), e.literal("aborted")),
  format: e.optional(e.union(e.literal("UIMessageChunk"), e.literal("TextStreamPart"))),
  order: e.number(),
  stepOrder: e.number(),
  // metadata
  userId: e.optional(e.string()),
  agentName: e.optional(e.string()),
  model: e.optional(e.string()),
  provider: e.optional(e.string()),
  providerOptions: e.optional(re)
  // Sent to model
}), bt = e.object({
  streamId: e.string(),
  start: e.number(),
  // inclusive
  end: e.number(),
  // exclusive
  parts: e.array(e.any())
}), ie = e.object({
  _id: e.string(),
  _creationTime: e.number(),
  userId: e.optional(e.string()),
  // useful for searching across threads
  threadId: e.string(),
  order: e.number(),
  stepOrder: e.number(),
  embeddingId: e.optional(e.string()),
  fileIds: e.optional(e.array(e.string())),
  error: e.optional(e.string()),
  status: Je,
  // Context on how it was generated
  agentName: e.optional(e.string()),
  model: e.optional(e.string()),
  provider: e.optional(e.string()),
  providerOptions: e.optional(re),
  // Sent to model
  // The result
  message: e.optional(B),
  // Convenience fields extracted from the message
  tool: e.boolean(),
  // either tool call (assistant) or tool result (tool)
  text: e.optional(e.string()),
  // Result metadata
  usage: e.optional(Oe),
  providerMetadata: e.optional(Xe),
  // Received from model
  sources: e.optional(e.array(Se)),
  warnings: e.optional(e.array(ut)),
  finishReason: e.optional(pt),
  // Likely deprecated soon
  reasoning: e.optional(e.string()),
  reasoningDetails: e.optional(ot),
  // Deprecated
  id: e.optional(e.string())
  // external id, e.g. from Vercel AI SDK
}), Mt = e.object({
  _id: e.string(),
  _creationTime: e.number(),
  userId: e.optional(e.string()),
  // Unset for anonymous
  title: e.optional(e.string()),
  summary: e.optional(e.string()),
  status: Bt
});

// node_modules/@convex-dev/agent/dist/client/files.js
var Ce = 1024 * 64;
async function de(n, s, t, { filename: o, sha256: a } = {}) {
  if (!("runAction" in n) || !("storage" in n))
    throw new Error("You're trying to save a file that's too large in a mutation / workflow. You can store the file in file storage from an action first, then pass a URL instead. To have the agent component track the file, you can use `saveFile` from an action then use the fileId with getFile in the mutation. Read more in the docs.");
  let r = a || Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await t.slice().arrayBuffer()))).map((l) => l.toString(16).padStart(2, "0")).join(""), d = await n.runMutation(s.files.useExistingFile, {
    hash: r,
    filename: o
  });
  if (d) {
    let l = await n.storage.getUrl(d.storageId);
    return {
      ...vt(l, t.type, o),
      file: {
        url: l,
        fileId: d.fileId,
        storageId: d.storageId,
        hash: r,
        filename: o
      }
    };
  }
  let p = await n.storage.store(t);
  if (a) {
    let l = await n.storage.getMetadata(p);
    if (l?.sha256 !== a)
      throw new Error("Hash mismatch: " + l?.sha256 + " != " + a);
  }
  let { fileId: c, storageId: m } = await n.runMutation(s.files.addFile, {
    storageId: p,
    hash: r,
    filename: o,
    mimeType: t.type
  }), u = await n.storage.getUrl(m);
  return m !== p && await n.storage.delete(p), {
    ...vt(u, t.type, o),
    file: {
      url: u,
      fileId: c,
      storageId: m,
      hash: r,
      filename: o
    }
  };
}
i(de, "storeFile");
function vt(n, s, t) {
  let o = {
    type: "file",
    data: new URL(n),
    mediaType: s,
    filename: t
  }, a = s.startsWith("image/") ? { type: "image", image: new URL(n), mediaType: s } : void 0;
  return { filePart: o, imagePart: a };
}
i(vt, "getParts");
function xt(n) {
  return n.hostname === "localhost" || n.hostname === "127.0.0.1" || n.hostname === "::1" || n.hostname === "0.0.0.0";
}
i(xt, "isLocalhostUrl");
async function wt(n) {
  let s = await fetch(n);
  if (!s.ok)
    throw new Error(`Failed to fetch ${n}: ${s.statusText}`);
  return await s.arrayBuffer();
}
i(wt, "downloadFile");
async function Tt(n) {
  return Promise.all(n.map(async (s) => {
    if (s.role !== "user" && s.role !== "assistant" || typeof s.content == "string" || !Array.isArray(s.content))
      return s;
    let t = await Promise.all(s.content.map(async (o) => {
      if (o.type === "image" && o.image instanceof URL && (y(s.role === "user", "Images can only be in user messages"), xt(o.image))) {
        let a = await wt(o.image);
        return { ...o, image: a };
      }
      if (o.type === "file" && o.data instanceof URL && xt(o.data)) {
        let a = await wt(o.data);
        return { ...o, data: a };
      }
      return o;
    }));
    return s.role === "user" ? { ...s, content: t } : { ...s, content: t };
  }));
}
i(Tt, "inlineMessagesFiles");

// node_modules/@convex-dev/agent/dist/shared.js
function L(n) {
  return n.role === "tool" || n.role === "assistant" && Array.isArray(n.content) && n.content.some((s) => s.type === "tool-call");
}
i(L, "isTool");
function k(n) {
  switch (n.role) {
    case "user":
      return typeof n.content == "string" ? n.content : ke(n.content);
    case "assistant":
      return typeof n.content == "string" ? n.content : ke(n.content) || void 0;
    case "system":
      return n.content;
  }
}
i(k, "extractText");
function ke(n) {
  return n.filter((s) => s.type === "text").map((s) => s.text).filter(Boolean).join(" ");
}
i(ke, "joinText");
var St = { before: 2, after: 1 };
function $(n, s = "asc") {
  return [...n].sort(s === "asc" ? (t, o) => t.order - o.order || t.stepOrder - o.stepOrder : (t, o) => o.order - t.order || o.stepOrder - t.stepOrder);
}
i($, "sorted");
function M(n) {
  return typeof n == "string" ? n.includes("/") ? n.split("/").slice(1).join("/") : n : "modelId" in n ? n.modelId : n.model;
}
i(M, "getModelName");
function S(n) {
  return typeof n == "string" ? n.split("/").at(0) : n.provider;
}
i(S, "getProviderName");

// node_modules/@convex-dev/agent/dist/mapping.js
async function N(n, s, t) {
  let { content: o, fileIds: a } = await es(n, s, t.content);
  return {
    message: {
      role: t.role,
      content: o,
      ...t.providerOptions ? { providerOptions: t.providerOptions } : {}
    },
    fileIds: a
  };
}
i(N, "serializeMessage");
function x(n) {
  return {
    ...n,
    content: ts(n.content)
  };
}
i(x, "toModelMessage");
function q(n) {
  return n.map((s) => s.message).filter((s) => !!s).filter((s) => !!s.content.length).map(x);
}
i(q, "docsToModelMessages");
function At(n) {
  return {
    promptTokens: n.inputTokens ?? 0,
    completionTokens: n.outputTokens ?? 0,
    totalTokens: n.totalTokens ?? 0,
    reasoningTokens: n.reasoningTokens,
    cachedInputTokens: n.cachedInputTokens
  };
}
i(At, "serializeUsage");
function Et(n) {
  if (n)
    return n.map((s) => s.type !== "unsupported-setting" ? s : { ...s, setting: s.setting.toString() });
}
i(Et, "serializeWarnings");
async function K(n, s, t, o) {
  let a = t.response.messages.at(-1)?.role === "tool", r = {
    model: o ? M(o) : void 0,
    provider: o ? S(o) : void 0,
    providerMetadata: t.providerMetadata,
    reasoning: t.reasoningText,
    reasoningDetails: t.reasoning,
    usage: At(t.usage),
    warnings: Et(t.warnings),
    finishReason: t.finishReason,
    // Only store the sources on one message
    sources: a ? void 0 : t.sources
  }, d = { sources: t.sources };
  return { messages: await Promise.all((a ? t.response.messages.slice(-2) : t.content.length ? t.response.messages.slice(-1) : [{ role: "assistant", content: [] }]).map(async (c) => {
    let { message: m, fileIds: u } = await N(n, s, c);
    return oe(F, {
      message: m,
      ...m.role === "tool" ? d : r,
      text: t.text,
      fileIds: u
    });
  })) };
}
i(K, "serializeNewMessagesInStep");
async function le(n, s, t, o) {
  let a = JSON.stringify(t.object), { message: r, fileIds: d } = await N(n, s, {
    role: "assistant",
    content: a
  });
  return {
    messages: [
      {
        message: r,
        model: o ? M(o) : void 0,
        provider: o ? S(o) : void 0,
        providerMetadata: t.providerMetadata,
        finishReason: t.finishReason,
        text: a,
        usage: At(t.usage),
        warnings: Et(t.warnings),
        fileIds: d
      }
    ]
  };
}
i(le, "serializeObjectResult");
function G(n) {
  if ("mediaType" in n)
    return n.mediaType;
  if ("mimeType" in n)
    return n.mimeType;
}
i(G, "getMimeOrMediaType");
async function es(n, s, t) {
  if (typeof t == "string")
    return { content: t };
  let o = [];
  return {
    content: await Promise.all(t.map(async (r) => {
      let d = {};
      switch ("providerOptions" in r && (d.providerOptions = r.providerOptions), "providerMetadata" in r && (d.providerMetadata = r.providerMetadata), r.type) {
        case "text":
          return {
            type: r.type,
            text: r.text,
            ...d
          };
        case "image": {
          let p = je(r.image);
          if (p instanceof ArrayBuffer && p.byteLength > Ce) {
            let { file: c } = await de(n, s, new Blob([p], {
              type: G(r) || kt(p)
            }));
            p = c.url, o.push(c.fileId);
          }
          return {
            type: r.type,
            mimeType: G(r),
            ...d,
            image: p
          };
        }
        case "file": {
          let p = je(r.data);
          if (p instanceof ArrayBuffer && p.byteLength > Ce) {
            let { file: c } = await de(n, s, new Blob([p], { type: G(r) }));
            p = c.url, o.push(c.fileId);
          }
          return {
            type: r.type,
            data: p,
            filename: r.filename,
            mimeType: G(r),
            ...d
          };
        }
        case "tool-call": {
          let p = "input" in r ? r.input : r.args;
          return {
            type: r.type,
            args: p ?? null,
            toolCallId: r.toolCallId,
            toolName: r.toolName,
            providerExecuted: r.providerExecuted,
            ...d
          };
        }
        case "tool-result":
          return Ct(r, d);
        case "reasoning":
          return {
            type: r.type,
            text: r.text,
            ...d
          };
        // Not in current generation output, but could be in historical messages
        case "redacted-reasoning":
          return {
            type: r.type,
            data: r.data,
            ...d
          };
        case "source":
          return r;
        default:
          return r;
      }
    })),
    fileIds: o.length > 0 ? o : void 0
  };
}
i(es, "serializeContent");
function ts(n) {
  return typeof n == "string" ? n : n.map((s) => {
    let t = {};
    switch ("providerOptions" in s && (t.providerOptions = s.providerOptions), "providerMetadata" in s && (t.providerMetadata = s.providerMetadata), s.type) {
      case "text":
        return {
          type: s.type,
          text: s.text,
          ...t
        };
      case "image":
        return {
          type: s.type,
          image: Ot(s.image),
          mediaType: G(s),
          ...t
        };
      case "file":
        return {
          type: s.type,
          data: Ot(s.data),
          filename: s.filename,
          mediaType: G(s),
          ...t
        };
      case "tool-call": {
        let o = "input" in s ? s.input : s.args;
        return {
          type: s.type,
          input: o ?? null,
          toolCallId: s.toolCallId,
          toolName: s.toolName,
          providerExecuted: s.providerExecuted,
          ...t
        };
      }
      case "tool-result":
        return Ct(s, t);
      case "reasoning":
        return {
          type: s.type,
          text: s.text,
          ...t
        };
      case "redacted-reasoning":
        return {
          type: "reasoning",
          text: "",
          ...t,
          providerOptions: t.providerOptions ? {
            ...Object.fromEntries(Object.entries(t.providerOptions ?? {}).map(([o, a]) => [
              o,
              { ...a, redactedData: s.data }
            ]))
          } : void 0
        };
      case "source":
        return s;
      default:
        return s;
    }
  });
}
i(ts, "toModelMessageContent");
function ss(n) {
  return typeof n == "string" ? {
    type: "text",
    value: n
  } : Ve(Te, n) ? n : {
    type: "json",
    value: n ?? null
  };
}
i(ss, "normalizeToolOutput");
function Ct(n, s) {
  return {
    type: n.type,
    output: n.output ?? ss("result" in n ? n.result : void 0),
    toolCallId: n.toolCallId,
    toolName: n.toolName,
    ...s
  };
}
i(Ct, "normalizeToolResult");
function kt(n) {
  if (typeof n == "string")
    return n.match(/^data:\w+\/\w+;base64/) ? n.split(";")[0].split(":")[1] : "text/plain";
  if (n.byteLength < 4)
    return "application/octet-stream";
  let t = [...new Uint8Array(n.slice(0, 12))].map((a) => a.toString(16).padStart(2, "0")).join(""), o = /* @__PURE__ */ i((a) => t.startsWith(a.toLowerCase()), "startsWith");
  return o("89504e47") ? "image/png" : o("ffd8ffdb") || o("ffd8ffe0") || o("ffd8ffee") || o("ffd8ffe1") ? "image/jpeg" : o("47494638") ? "image/gif" : o("424d") ? "image/bmp" : o("52494646") && t.substr(16, 8) === "57454250" ? "image/webp" : o("49492a00") ? "image/tiff" : o("3c737667") || o("3c3f786d") ? "image/svg+xml" : o("494433") ? "audio/mpeg" : o("000001ba") || o("000001b3") ? "video/mpeg" : o("1a45dfa3") ? "video/webm" : o("00000018") && t.substr(16, 8) === "66747970" ? "video/mp4" : o("4f676753") ? "audio/ogg" : o("25504446") ? "application/pdf" : o("504b0304") || o("504b0506") || o("504b0708") ? "application/zip" : o("52617221") ? "application/x-rar-compressed" : o("7f454c46") ? "application/x-elf" : o("1f8b08") ? "application/gzip" : o("425a68") ? "application/x-bzip2" : o("3c3f786d6c") ? "application/xml" : "application/octet-stream";
}
i(kt, "guessMimeType");
function je(n) {
  return typeof n == "string" || n instanceof ArrayBuffer ? n : n instanceof URL ? n.toString() : n.buffer.slice(n.byteOffset, n.byteOffset + n.byteLength);
}
i(je, "serializeDataOrUrl");
function Ot(n) {
  return n instanceof URL ? n : typeof n == "string" && (n.startsWith("http://") || n.startsWith("https://")) ? new URL(n) : n;
}
i(Ot, "toModelMessageDataOrUrl");

// node_modules/@convex-dev/agent/dist/client/messages.js
async function ce(n, s, { threadId: t, paginationOpts: o, excludeToolMessages: a, statuses: r }) {
  return o.numItems === 0 ? {
    page: [],
    isDone: !0,
    continueCursor: o.cursor ?? ""
  } : n.runQuery(s.messages.listMessagesByThreadId, {
    order: "desc",
    threadId: t,
    paginationOpts: o,
    excludeToolMessages: a,
    statuses: r
  });
}
i(ce, "listMessages");
async function Y(n, s, t) {
  let o;
  if (t.embeddings) {
    let r = t.embeddings.vectors.find((d) => d !== null)?.length;
    r && (ne(r), o = {
      model: t.embeddings.model,
      dimension: r,
      vectors: t.embeddings.vectors
    });
  }
  return { messages: (await n.runMutation(s.messages.addMessages, {
    threadId: t.threadId,
    userId: t.userId ?? void 0,
    agentName: t.agentName,
    promptMessageId: t.promptMessageId,
    pendingMessageId: t.pendingMessageId,
    embeddings: o,
    messages: await Promise.all(t.messages.map(async (r, d) => {
      let { message: p, fileIds: c } = await N(n, s, r), m = t.metadata?.[d], u = [...m?.fileIds ?? []];
      return c && u.push(...c), oe(F, {
        ...m,
        message: p,
        ...u.length > 0 ? { fileIds: u } : {}
      });
    })),
    failPendingSteps: t.failPendingSteps ?? !1
  })).messages };
}
i(Y, "saveMessages");

// node_modules/@convex-dev/agent/dist/client/search.js
var as = 0, is = 1e4;
async function Re(n, s, t) {
  let { recentMessages: o, searchMessages: a } = await jt(n, s, t);
  return [...a, ...o];
}
i(Re, "fetchContextMessages");
async function jt(n, s, t) {
  y(t.userId || t.threadId, "Specify userId or threadId");
  let o = t.contextOptions, a, r = [], d = [], p = t.targetMessageId ?? t.upToAndIncludingMessageId;
  if (t.threadId && o.recentMessages !== 0) {
    let { page: c } = await n.runQuery(s.messages.listMessagesByThreadId, {
      threadId: t.threadId,
      excludeToolMessages: o.excludeToolMessages,
      paginationOpts: {
        numItems: o.recentMessages ?? 100,
        cursor: null
      },
      upToAndIncludingMessageId: p,
      order: "desc",
      statuses: ["success"]
    });
    a = new Set(c.map((m) => m._id)), r = Pe($(c));
  }
  if ((o.searchOptions?.textSearch || o.searchOptions?.vectorSearch) && o.searchOptions?.limit) {
    if (!("runAction" in n))
      throw new Error("searchUserMessages only works in an action");
    let c = t.searchText, m, u;
    if (!c) {
      if (p) {
        let f = r.find((g) => g._id === p);
        if (f)
          c = f.text;
        else {
          let g = await n.runQuery(s.messages.getMessageSearchFields, {
            messageId: p
          });
          c = g.text, m = g.embedding, u = g.embeddingModel;
        }
        y(c, "Target message has no text for searching");
      } else t.messages?.length && (c = k(t.messages.at(-1)), y(c, "Final context message has no text to search"));
      y(c, "No text to search");
    }
    if (o.searchOptions?.vectorSearch && !m && t.getEmbedding) {
      let f = await t.getEmbedding(c);
      m = f.embedding, u = f.textEmbeddingModel ? M(f.textEmbeddingModel) : void 0;
    }
    let l = await n.runAction(s.messages.searchMessages, {
      searchAllMessagesForUserId: o?.searchOtherThreads ? t.userId ?? (t.threadId && (await n.runQuery(s.threads.getThread, {
        threadId: t.threadId
      }))?.userId) : void 0,
      threadId: t.threadId,
      targetMessageId: p,
      limit: o.searchOptions?.limit ?? 10,
      messageRange: {
        ...St,
        ...o.searchOptions?.messageRange
      },
      text: c,
      textSearch: o.searchOptions?.textSearch,
      vectorSearch: o.searchOptions?.vectorSearch,
      vectorScoreThreshold: o.searchOptions?.vectorScoreThreshold ?? as,
      embedding: m,
      embeddingModel: u
    });
    d = Pe($(l.filter((f) => !a?.has(f._id))));
  }
  return { recentMessages: r, searchMessages: d };
}
i(jt, "fetchRecentAndSearchMessages");
function Pe(n) {
  let s = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), o = [];
  for (let a of n)
    if (a.message && Array.isArray(a.message.content))
      for (let r of a.message.content)
        r.type === "tool-call" ? s.add(r.toolCallId) : r.type === "tool-result" && t.add(r.toolCallId);
  for (let a of n)
    if (a.message?.role === "assistant" && Array.isArray(a.message.content)) {
      let r = a.message.content.filter((d) => d.type !== "tool-call" || t.has(d.toolCallId));
      r.length && o.push({
        ...a,
        message: {
          ...a.message,
          content: r
        }
      });
    } else if (a.message?.role === "tool") {
      let r = a.message.content.filter((d) => s.has(d.toolCallId));
      r.length && o.push({
        ...a,
        message: {
          ...a.message,
          content: r
        }
      });
    } else
      o.push(a);
  return o;
}
i(Pe, "filterOutOrphanedToolMessages");
async function j(n, { userId: s, threadId: t, ...o }, a) {
  if (!o.textEmbeddingModel)
    return;
  let r, d = a.map((l) => !L(l) && k(l)), p = d.map((l, f) => l ? f : void 0).filter((l) => l !== void 0);
  if (p.length === 0)
    return;
  let c = d.map((l) => l && l.trim().slice(0, is)).filter((l) => !!l), m = await V(n, {
    ...o,
    userId: s,
    threadId: t,
    values: c
  }), u = Array(a.length).fill(null);
  if (p.forEach((l, f) => {
    u[l] = m.embeddings[f];
  }), m.embeddings.length > 0) {
    let l = m.embeddings[0].length;
    ne(l);
    let f = M(o.textEmbeddingModel);
    r = { vectors: u, dimension: l, model: f };
  }
  return r;
}
i(j, "embedMessages");
async function V(n, { userId: s, threadId: t, values: o, abortSignal: a, headers: r, agentName: d, usageHandler: p, textEmbeddingModel: c, callSettings: m }) {
  let u = c;
  y(u, "a textEmbeddingModel is required to be set for vector search");
  let l = await $e({
    ...m,
    model: u,
    values: o,
    abortSignal: a,
    headers: r
  });
  return p && l.usage && await p(n, {
    userId: s,
    threadId: t,
    agentName: d,
    model: M(u),
    provider: S(u),
    providerMetadata: void 0,
    usage: {
      inputTokens: l.usage.tokens,
      outputTokens: 0,
      totalTokens: l.usage.tokens
    }
  }), { embeddings: l.embeddings };
}
i(V, "embedMany");
async function pe(n, s, t, o) {
  let a = o.filter((d) => !d.embeddingId && d.message);
  if (a.length === 0)
    return;
  let r = await j(n, t, a.map((d) => d.message));
  r && r.vectors.some((d) => d !== null) && await n.runMutation(s.vector.index.insertBatch, {
    vectorDimension: r.dimension,
    vectors: a.map((d, p) => ({
      messageId: d._id,
      model: r.model,
      table: "messages",
      userId: d.userId,
      threadId: d.threadId,
      vector: r.vectors[p]
    })).filter((d) => d.vector !== null)
  });
}
i(pe, "generateAndSaveEmbeddings");
async function Ne(n, s, t) {
  let { threadId: o, userId: a, textEmbeddingModel: r } = t, d = _e(t.prompt), p = d.length ? k(d.at(-1)) : t.promptMessageId ? void 0 : t.messages?.at(-1) ? k(t.messages.at(-1)) : void 0, { recentMessages: c, searchMessages: m } = await jt(n, s, {
    userId: a,
    threadId: o,
    targetMessageId: t.promptMessageId,
    searchText: p,
    contextOptions: t.contextOptions ?? {},
    getEmbedding: /* @__PURE__ */ i(async (E) => (y(r, "A textEmbeddingModel is required to be set on the Agent that you're doing vector search with"), {
      embedding: (await V(n, {
        ...t,
        userId: a,
        values: [E],
        textEmbeddingModel: r
      })).embeddings[0],
      textEmbeddingModel: r
    }), "getEmbedding")
  }), u = t.promptMessageId ? c.findIndex((E) => E._id === t.promptMessageId) : -1, l = u !== -1 ? c[u] : void 0, f = c, g = t.messages ?? [], w = [];
  l && (f = c.slice(0, u), w = c.slice(u + 1), d.length === 0 && l.message && d.push(l.message), !l.embeddingId && r && await pe(n, s, {
    ...t,
    userId: a,
    textEmbeddingModel: r
  }, [l]));
  let T = q(m), h = q(f), v = g.map(x), D = d.map(x), P = q(w), I = [
    ...T,
    ...h,
    ...v,
    ...D,
    ...P
  ], U = t.contextHandler ? await t.contextHandler(n, {
    allMessages: I,
    search: T,
    recent: h,
    inputMessages: v,
    inputPrompt: D,
    existingResponses: P,
    userId: a,
    threadId: o
  }) : I;
  return process.env.CONVEX_CLOUD_URL?.startsWith("http://127.0.0.1") && (U = await Tt(U)), {
    messages: U,
    order: l?.order,
    stepOrder: l?.stepOrder
  };
}
i(Ne, "fetchContextWithPrompt");
function _e(n) {
  return n ? Array.isArray(n) ? n : [{ role: "user", content: n }] : [];
}
i(_e, "getPromptArray");

// node_modules/@convex-dev/agent/dist/client/createTool.js
function Q(n) {
  let s = {
    type: "function",
    __acceptsCtx: !0,
    ctx: n.ctx,
    description: n.description,
    inputSchema: n.args,
    execute(t, o) {
      if (!H(this))
        throw new Error("To use a Convex tool, you must either provide the ctx at definition time (dynamically in an action), or use the Agent to call it (which injects the ctx, userId and threadId)");
      return n.handler(H(this), t, o);
    },
    providerOptions: n.providerOptions
  };
  return n.onInputStart && (s.onInputStart = n.onInputStart.bind(s, H(s))), n.onInputDelta && (s.onInputDelta = n.onInputDelta.bind(s, H(s))), n.onInputAvailable && (s.onInputAvailable = n.onInputAvailable.bind(s, H(s))), s;
}
i(Q, "createTool");
function H(n) {
  return n.ctx;
}
i(H, "getCtx");
function Pt(n, ...s) {
  let t = {};
  for (let o of s)
    if (o)
      for (let [a, r] of Object.entries(o))
        if (r && !r.__acceptsCtx)
          t[a] = r;
        else {
          let d = { ...r, ctx: n };
          t[a] = d;
        }
  return t;
}
i(Pt, "wrapTools");

// node_modules/@convex-dev/agent/dist/client/saveInputMessages.js
async function Rt(n, s, { threadId: t, userId: o, prompt: a, messages: r, ...d }) {
  let p = d.storageOptions?.saveMessages ?? "promptAndOutput", c = _e(a), m = [];
  d.promptMessageId || (p === "all" ? (r && m.push(...r), m.push(...c)) : c.length ? m.push(...c) : r && m.push(...r.slice(-1)));
  let u;
  d.textEmbeddingModel && m.length && (y("runAction" in n, "You must be in an action context to generate embeddings"), u = await j(n, { ...d, userId: o ?? void 0, threadId: t }, m), u && u.vectors.push(null));
  let l = await Y(n, s, {
    threadId: t,
    userId: o,
    messages: [...m, { role: "assistant", content: [] }],
    metadata: [
      ...Array.from({ length: m.length }, () => ({})),
      { status: "pending" }
    ],
    failPendingSteps: !!d.promptMessageId,
    promptMessageId: d.promptMessageId,
    embeddings: u
  });
  return {
    promptMessageId: m.length ? l.messages.at(-2)._id : d.promptMessageId,
    pendingMessage: l.messages.at(-1),
    savedMessages: l.messages.slice(0, -1)
  };
}
i(Rt, "saveInputMessages");

// node_modules/@convex-dev/agent/dist/client/start.js
async function X(n, s, t, { threadId: o, ...a }) {
  let r = a.userId ?? (o && (await n.runQuery(s.threads.getThread, { threadId: o }))?.userId) ?? void 0, d = await Ne(n, s, {
    ...a,
    userId: r,
    threadId: o,
    messages: t.messages,
    prompt: t.prompt,
    promptMessageId: t.promptMessageId
  }), p = a.storageOptions?.saveMessages ?? "promptAndOutput", { promptMessageId: c, pendingMessage: m, savedMessages: u } = o && p !== "none" ? await Rt(n, s, {
    ...a,
    userId: r,
    threadId: o,
    prompt: t.prompt,
    messages: t.messages,
    promptMessageId: t.promptMessageId,
    storageOptions: { saveMessages: p }
  }) : {
    promptMessageId: t.promptMessageId,
    pendingMessage: void 0,
    savedMessages: []
  }, l = m?.order ?? d.order, f = m?.stepOrder ?? d.stepOrder, g = m?._id, w = t.model ?? a.languageModel;
  y(w, "model is required");
  let T = w, h = /* @__PURE__ */ i(async (I) => {
    g && await n.runMutation(s.messages.finalizeMessage, {
      messageId: g,
      result: { status: "failed", error: I }
    });
  }, "fail");
  if (t.abortSignal) {
    let I = t.abortSignal;
    I.addEventListener("abort", async () => {
      await h(I.reason?.toString() ?? "abortSignal");
    }, { once: !0 });
  }
  let v = {
    ...n,
    userId: r,
    threadId: o,
    promptMessageId: c,
    agent: a.agentForToolCtx
  }, D = Pt(v, t.tools), P = {
    ...a.callSettings,
    providerOptions: a.providerOptions,
    ...C(t, ["promptMessageId", "messages", "prompt"]),
    model: w,
    messages: d.messages,
    stopWhen: t.stopWhen ?? (a.maxSteps ? te(a.maxSteps) : void 0),
    tools: D
  };
  return g && (P._internal?.generateId || (P._internal = {
    ...P._internal,
    generateId: g ? () => g ?? crypto.randomUUID() : void 0
  })), {
    args: P,
    order: l ?? 0,
    stepOrder: f ?? 0,
    userId: r,
    promptMessageId: c,
    getSavedMessages: /* @__PURE__ */ i(() => u, "getSavedMessages"),
    updateModel: /* @__PURE__ */ i((I) => {
      I && (T = I);
    }, "updateModel"),
    fail: h,
    save: /* @__PURE__ */ i(async (I, U) => {
      if (o && p !== "none") {
        let he = "object" in I ? await le(n, s, I.object, T) : await K(n, s, I.step, T), Ge = await j(n, { threadId: o, ...a, userId: r }, he.messages.map((Gt) => Gt.message));
        U && (he.messages.push({
          message: { role: "assistant", content: [] },
          status: "pending"
        }), Ge?.vectors.push(null));
        let ee = await n.runMutation(s.messages.addMessages, {
          userId: r,
          threadId: o,
          agentName: a.agentName,
          promptMessageId: c,
          pendingMessageId: g,
          messages: he.messages,
          embeddings: Ge,
          failPendingSteps: !1
        }), ye = ee.messages.at(-1);
        U ? ye.status === "failed" ? (g = void 0, u.push(...ee.messages), await h(ye.error ?? "Aborting - the pending message was marked as failed")) : (g = ye._id, u.push(...ee.messages.slice(0, -1))) : (g = void 0, u.push(...ee.messages));
      }
      let E = "object" in I ? I.object : I.step;
      a.rawRequestResponseHandler && await a.rawRequestResponseHandler(n, {
        userId: r,
        threadId: o,
        agentName: a.agentName,
        request: E.request,
        response: E.response
      }), a.usageHandler && E.usage && await a.usageHandler(n, {
        userId: r,
        threadId: o,
        agentName: a.agentName,
        model: M(T),
        provider: S(T),
        usage: E.usage,
        providerMetadata: E.providerMetadata
      });
    }, "save")
  };
}
i(X, "startGeneration");

// node_modules/@convex-dev/agent/dist/client/streaming.js
W();
var Nt = e.object({
  ...ae(ie).fields,
  streams: e.optional(e.union(e.object({ kind: e.literal("list"), messages: e.array(It) }), e.object({ kind: e.literal("deltas"), deltas: e.array(bt) })))
});
async function ue(n, s, { threadId: t, streamArgs: o, includeStatuses: a }) {
  if (o)
    return o.kind === "list" ? {
      kind: "list",
      messages: await _t(n, s, {
        threadId: t,
        startOrder: o.startOrder,
        includeStatuses: a
      })
    } : {
      kind: "deltas",
      deltas: await n.runQuery(s.streams.listDeltas, {
        threadId: t,
        cursors: o.cursors
      })
    };
}
i(ue, "syncStreams");
async function _t(n, s, { threadId: t, startOrder: o, includeStatuses: a }) {
  return n.runQuery(s.streams.list, {
    threadId: t,
    startOrder: o,
    statuses: a
  });
}
i(_t, "listStreams");
var De = {
  // This chunks by sentences / clauses. Punctuation followed by whitespace.
  chunking: /[\p{P}\s]/u,
  throttleMs: 250,
  returnImmediately: !1
};
function Dt(n, s) {
  if (!n)
    return s;
  let t = typeof n == "boolean" ? De.chunking : n.chunking, o = Array.isArray(s) ? s : s ? [s] : [];
  return o.push(Ye({ delayInMs: null, chunking: t })), o;
}
i(Dt, "mergeTransforms");
var J = class {
  static {
    i(this, "DeltaStreamer");
  }
  component;
  ctx;
  metadata;
  streamId;
  config;
  #e = [];
  #o = 0;
  #t;
  #r = 0;
  abortController;
  constructor(s, t, o, a) {
    this.component = s, this.ctx = t, this.metadata = a, this.config = {
      throttleMs: o.throttleMs ?? De.throttleMs,
      onAsyncAbort: o.onAsyncAbort,
      compress: o.compress
    }, this.#e = [], this.abortController = new AbortController(), o.abortSignal && o.abortSignal.addEventListener("abort", async () => {
      this.abortController.signal.aborted || this.streamId && (this.abortController.abort(), await this.#t, await this.ctx.runMutation(this.component.streams.abort, {
        streamId: this.streamId,
        reason: "abortSignal"
      }));
    });
  }
  // Avoid race conditions by only creating once
  #s;
  async getStreamId() {
    if (this.streamId)
      return this.streamId;
    if (this.#s)
      return this.#s;
    this.#s = this.ctx.runMutation(this.component.streams.create, this.metadata), this.streamId = await this.#s;
  }
  async addParts(s) {
    this.abortController.signal.aborted || (await this.getStreamId(), this.#e.push(...s), !this.#t && Date.now() - this.#o >= this.config.throttleMs && (this.#t = this.#n()));
  }
  async consumeStream(s) {
    for await (let t of s)
      await this.addParts([t]);
    await this.finish();
  }
  async #n() {
    if (this.abortController.signal.aborted)
      return;
    let s = this.#a();
    if (s) {
      this.#o = Date.now();
      try {
        if (!await this.ctx.runMutation(this.component.streams.addDelta, s)) {
          await this.config.onAsyncAbort("async abort"), this.abortController.abort();
          return;
        }
      } catch (t) {
        throw await this.config.onAsyncAbort(t instanceof Error ? t.message : "unknown error"), this.abortController.abort(), t;
      }
      this.#e.length > 0 && Date.now() - this.#o >= this.config.throttleMs ? this.#t = this.#n() : this.#t = void 0;
    }
  }
  #a() {
    if (this.#e.length === 0)
      return;
    let s = this.#r, t = s + this.#e.length;
    this.#r = t;
    let o = this.config.compress ? this.config.compress(this.#e) : this.#e;
    if (this.#e = [], !this.streamId)
      throw new Error("Creating a delta before the stream is created");
    return { streamId: this.streamId, start: s, end: t, parts: o };
  }
  async finish() {
    this.streamId && (await this.#t, await this.#n(), await this.ctx.runMutation(this.component.streams.finish, {
      streamId: this.streamId
    }));
  }
  async fail(s) {
    this.abortController.signal.aborted || (this.abortController.abort(), this.streamId && (await this.#t, await this.ctx.runMutation(this.component.streams.abort, {
      streamId: this.streamId,
      reason: s
    })));
  }
};
function Ue(n) {
  let s = [];
  for (let t of n) {
    let o = s.at(-1);
    (t.type === "text-delta" || t.type === "reasoning-delta") && o?.type === t.type && t.id === o.id ? o.delta += t.delta : s.push(t);
  }
  return s;
}
i(Ue, "compressUIMessageChunks");

// node_modules/@convex-dev/agent/dist/client/threads.js
async function me(n, s, t) {
  let { _id: o } = await n.runMutation(s.threads.createThread, {
    userId: t?.userId ?? void 0,
    title: t?.title,
    summary: t?.summary
  });
  return o;
}
i(me, "createThread");
async function Fe(n, s, t) {
  let o = await n.runQuery(s.threads.getThread, {
    threadId: t.threadId
  });
  if (!o)
    throw new Error("Thread not found");
  return o;
}
i(Fe, "getThreadMetadata");

// node_modules/@convex-dev/agent/dist/client/utils.js
async function ge(n, s) {
  let t = n.at(-1);
  return t.finishReason !== "tool-calls" || t.toolCalls.length > t.toolResults.length ? !1 : Array.isArray(s) ? (await Promise.all(s.map(async (o) => o({ steps: n })))).every((o) => !o) : !!s && !await s({ steps: n });
}
i(ge, "willContinue");
function _(n) {
  return n instanceof Error ? n.message : String(n);
}
i(_, "errorToString");

// node_modules/@convex-dev/agent/dist/client/streamText.js
async function Ut(n, s, t, o) {
  let { threadId: a } = o ?? {}, { args: r, userId: d, order: p, stepOrder: c, promptMessageId: m, ...u } = await X(n, s, t, o), l = [], f = a && o.saveStreamDeltas ? new J(s, n, {
    throttleMs: typeof o.saveStreamDeltas == "object" ? o.saveStreamDeltas.throttleMs : void 0,
    onAsyncAbort: u.fail,
    compress: Ue,
    abortSignal: r.abortSignal
  }, {
    threadId: a,
    userId: d,
    agentName: o?.agentName,
    model: M(r.model),
    provider: S(r.model),
    providerOptions: r.providerOptions,
    format: "UIMessageChunk",
    order: p,
    stepOrder: c
  }) : void 0, g = Le({
    ...r,
    abortSignal: f?.abortController.signal ?? r.abortSignal,
    experimental_transform: Dt(o?.saveStreamDeltas, t.experimental_transform),
    onError: /* @__PURE__ */ i(async (h) => (console.error("onError", h), await u.fail(_(h.error)), await f?.fail(_(h.error)), t.onError?.(h)), "onError"),
    prepareStep: /* @__PURE__ */ i(async (h) => {
      let v = await t.prepareStep?.(h);
      if (v) {
        let D = v.model ?? h.model;
        return u.updateModel(D), v;
      }
    }, "prepareStep"),
    onStepFinish: /* @__PURE__ */ i(async (h) => {
      l.push(h);
      let v = await ge(l, r.stopWhen);
      return await u.save({ step: h }, v), r.onStepFinish?.(h);
    }, "onStepFinish")
  }), w = f?.consumeStream(g.toUIMessageStream());
  (typeof o?.saveStreamDeltas == "object" && !o.saveStreamDeltas.returnImmediately || o?.saveStreamDeltas === !0) && (await w, await g.consumeStream());
  let T = {
    promptMessageId: m,
    order: p,
    savedMessages: u.getSavedMessages(),
    messageId: m
  };
  return Object.assign(g, T);
}
i(Ut, "streamText");

// node_modules/@convex-dev/agent/dist/client/definePlaygroundAPI.js
Me();
W();

// node_modules/@convex-dev/agent/dist/client/index.js
var Z = class {
  static {
    i(this, "Agent");
  }
  component;
  options;
  constructor(s, t) {
    this.component = s, this.options = t;
  }
  async createThread(s, t) {
    let o = await me(s, this.component, t);
    if (!("runAction" in s) || "workflowId" in s)
      return { threadId: o };
    let { thread: a } = await this.continueThread(s, {
      threadId: o,
      userId: t?.userId
    });
    return { threadId: o, thread: a };
  }
  /**
   * Continues a thread using this agent. Note: threads can be continued
   * by different agents. This is a convenience around calling the various
   * generate and stream functions with explicit userId and threadId parameters.
   * @param ctx The ctx object passed to the action handler
   * @param { threadId, userId }: the thread and user to associate the messages with.
   * @returns Functions bound to the userId and threadId on a `{thread}` object.
   */
  async continueThread(s, t) {
    return {
      thread: {
        threadId: t.threadId,
        getMetadata: this.getThreadMetadata.bind(this, s, {
          threadId: t.threadId
        }),
        updateMetadata: /* @__PURE__ */ i((o) => s.runMutation(this.component.threads.updateThread, {
          threadId: t.threadId,
          patch: o
        }), "updateMetadata"),
        generateText: this.generateText.bind(this, s, t),
        streamText: this.streamText.bind(this, s, t),
        generateObject: this.generateObject.bind(this, s, t),
        streamObject: this.streamObject.bind(this, s, t)
      }
    };
  }
  async start(s, t, o) {
    return X(s, this.component, {
      ...t,
      tools: t.tools ?? this.options.tools,
      system: t.system ?? this.options.instructions,
      stopWhen: t.stopWhen ?? this.options.stopWhen
    }, {
      ...this.options,
      ...o,
      agentName: this.options.name,
      agentForToolCtx: this
    });
  }
  /**
   * This behaves like {@link generateText} from the "ai" package except that
   * it add context based on the userId and threadId and saves the input and
   * resulting messages to the thread, if specified.
   * Use {@link continueThread} to get a version of this function already scoped
   * to a thread (and optionally userId).
   * @param ctx The context passed from the action function calling this.
   * @param scope: The user and thread to associate the message with
   * @param generateTextArgs The arguments to the generateText function, along
   * with {@link AgentPrompt} options, such as promptMessageId.
   * @param options Extra controls for the {@link ContextOptions} and {@link StorageOptions}.
   * @returns The result of the generateText function.
   */
  async generateText(s, t, o, a) {
    let { args: r, promptMessageId: d, order: p, ...c } = await this.start(s, o, { ...t, ...a }), m = [];
    try {
      let u = await Be({
        ...r,
        prepareStep: /* @__PURE__ */ i(async (f) => {
          let g = await o.prepareStep?.(f);
          return c.updateModel(g?.model ?? f.model), g;
        }, "prepareStep"),
        onStepFinish: /* @__PURE__ */ i(async (f) => (m.push(f), await c.save({ step: f }, await ge(m, r.stopWhen)), o.onStepFinish?.(f)), "onStepFinish")
      }), l = {
        promptMessageId: d,
        order: p,
        savedMessages: c.getSavedMessages(),
        messageId: d
      };
      return Object.assign(u, l);
    } catch (u) {
      throw await c.fail(_(u)), u;
    }
  }
  /**
   * This behaves like {@link streamText} from the "ai" package except that
   * it add context based on the userId and threadId and saves the input and
   * resulting messages to the thread, if specified.
   * Use {@link continueThread} to get a version of this function already scoped
   * to a thread (and optionally userId).
   */
  async streamText(s, t, o, a) {
    return Ut(s, this.component, {
      ...o,
      model: o.model ?? this.options.languageModel,
      tools: o.tools ?? this.options.tools,
      system: o.system ?? this.options.instructions,
      stopWhen: o.stopWhen ?? this.options.stopWhen
    }, {
      ...t,
      ...this.options,
      agentName: this.options.name,
      agentForToolCtx: this,
      ...a
    });
  }
  /**
   * This behaves like {@link generateObject} from the "ai" package except that
   * it add context based on the userId and threadId and saves the input and
   * resulting messages to the thread, if specified.
   * Use {@link continueThread} to get a version of this function already scoped
   * to a thread (and optionally userId).
   */
  async generateObject(s, t, o, a) {
    let { args: r, promptMessageId: d, order: p, fail: c, save: m, getSavedMessages: u } = await this.start(s, o, { ...t, ...a });
    try {
      let l = await qe(r);
      await m({ object: l });
      let f = {
        promptMessageId: d,
        order: p,
        savedMessages: u(),
        messageId: d
      };
      return Object.assign(l, f);
    } catch (l) {
      throw await c(_(l)), l;
    }
  }
  /**
   * This behaves like `streamObject` from the "ai" package except that
   * it add context based on the userId and threadId and saves the input and
   * resulting messages to the thread, if specified.
   * Use {@link continueThread} to get a version of this function already scoped
   * to a thread (and optionally userId).
   */
  async streamObject(s, t, o, a) {
    let { args: r, promptMessageId: d, order: p, fail: c, save: m, getSavedMessages: u } = await this.start(s, o, { ...t, ...a }), l = Ke({
      ...r,
      onError: /* @__PURE__ */ i(async (g) => (console.error(" streamObject onError", g), await c(_(g.error)), r.onError?.(g)), "onError"),
      onFinish: /* @__PURE__ */ i(async (g) => (await m({
        object: {
          object: g.object,
          finishReason: g.error ? "error" : "stop",
          usage: g.usage,
          warnings: g.warnings,
          request: await l.request,
          response: g.response,
          providerMetadata: g.providerMetadata,
          toJsonResponse: l.toTextStreamResponse,
          reasoning: void 0
        }
      }), r.onFinish?.(g)), "onFinish")
    }), f = {
      promptMessageId: d,
      order: p,
      savedMessages: u(),
      messageId: d
    };
    return Object.assign(l, f);
  }
  /**
   * Save a message to the thread.
   * @param ctx A ctx object from a mutation or action.
   * @param args The message and what to associate it with (user / thread)
   * You can pass extra metadata alongside the message, e.g. associated fileIds.
   * @returns The messageId of the saved message.
   */
  async saveMessage(s, t) {
    let { messages: o } = await this.saveMessages(s, {
      threadId: t.threadId,
      userId: t.userId,
      embeddings: t.embedding ? { model: t.embedding.model, vectors: [t.embedding.vector] } : void 0,
      messages: t.prompt !== void 0 ? [{ role: "user", content: t.prompt }] : [t.message],
      metadata: t.metadata ? [t.metadata] : void 0,
      skipEmbeddings: t.skipEmbeddings,
      promptMessageId: t.promptMessageId,
      pendingMessageId: t.pendingMessageId
    }), a = o.at(-1);
    return { messageId: a._id, message: a };
  }
  /**
   * Explicitly save messages associated with the thread (& user if provided)
   * If you have an embedding model set, it will also generate embeddings for
   * the messages.
   * @param ctx The ctx parameter to a mutation or action.
   * @param args The messages and context to save
   * @returns
   */
  async saveMessages(s, t) {
    let o, { skipEmbeddings: a, ...r } = t;
    return t.embeddings ? o = t.embeddings : !a && this.options.textEmbeddingModel && ("runAction" in s ? "workflowId" in s ? console.warn("You're trying to save messages and generate embeddings, but you're in a workflow. Pass `skipEmbeddings: true` to skip generating embeddings in the workflow and skip this warning. They will be generated lazily when you generate or stream text / objects. You can explicitly generate them asynchronously by using the scheduler to run an action later that calls `agent.generateAndSaveEmbeddings`.") : o = await this.generateEmbeddings(s, { userId: t.userId ?? void 0, threadId: t.threadId }, t.messages) : console.warn("You're trying to save messages and generate embeddings, but you're in a mutation. Pass `skipEmbeddings: true` to skip generating embeddings in the mutation and skip this warning. They will be generated lazily when you generate or stream text / objects. You can explicitly generate them asynchronously by using the scheduler to run an action later that calls `agent.generateAndSaveEmbeddings`.")), Y(s, this.component, {
      ...r,
      agentName: this.options.name,
      embeddings: o
    });
  }
  /**
   * List messages from a thread.
   * @param ctx A ctx object from a query, mutation, or action.
   * @param args.threadId The thread to list messages from.
   * @param args.paginationOpts Pagination options (e.g. via usePaginatedQuery).
   * @param args.excludeToolMessages Whether to exclude tool messages.
   *   False by default.
   * @param args.statuses What statuses to include. All by default.
   * @returns The MessageDoc's in a format compatible with usePaginatedQuery.
   */
  async listMessages(s, t) {
    return ce(s, this.component, t);
  }
  /**
   * A function that handles fetching stream deltas, used with the React hooks
   * `useThreadMessages` or `useStreamingThreadMessages`.
   * @param ctx A ctx object from a query, mutation, or action.
   * @param args.threadId The thread to sync streams for.
   * @param args.streamArgs The stream arguments with per-stream cursors.
   * @returns The deltas for each stream from their existing cursor.
   */
  async syncStreams(s, t) {
    return ue(s, this.component, t);
  }
  /**
   * Fetch the context messages for a thread.
   * @param ctx Either a query, mutation, or action ctx.
   *   If it is not an action context, you can't do text or
   *   vector search.
   * @param args The associated thread, user, message
   * @returns
   */
  async fetchContextMessages(s, t) {
    y(t.userId || t.threadId, "Specify userId or threadId");
    let o = {
      ...this.options.contextOptions,
      ...t.contextOptions
    };
    return Re(s, this.component, {
      ...t,
      contextOptions: o,
      getEmbedding: /* @__PURE__ */ i(async (a) => (y("runAction" in s), y(this.options.textEmbeddingModel, "A textEmbeddingModel is required to be set on the Agent that you're doing vector search with"), {
        embedding: (await V(s, {
          ...this.options,
          agentName: this.options.name,
          userId: t.userId,
          threadId: t.threadId,
          values: [a]
        })).embeddings[0],
        textEmbeddingModel: this.options.textEmbeddingModel
      }), "getEmbedding")
    });
  }
  /**
   * Get the metadata for a thread.
   * @param ctx A ctx object from a query, mutation, or action.
   * @param args.threadId The thread to get the metadata for.
   * @returns The metadata for the thread.
   */
  async getThreadMetadata(s, t) {
    return Fe(s, this.component, t);
  }
  /**
   * Update the metadata for a thread.
   * @param ctx A ctx object from a mutation or action.
   * @param args.threadId The thread to update the metadata for.
   * @param args.patch The patch to apply to the thread.
   * @returns The updated thread metadata.
   */
  async updateThreadMetadata(s, t) {
    return await s.runMutation(this.component.threads.updateThread, t);
  }
  /**
   * Get the embeddings for a set of messages.
   * @param messages The messages to get the embeddings for.
   * @returns The embeddings for the messages.
   */
  async generateEmbeddings(s, t, o) {
    return j(s, { ...t, ...this.options, agentName: this.options.name }, o);
  }
  /**
   * Generate embeddings for a set of messages, and save them to the database.
   * It will not generate or save embeddings for messages that already have an
   * embedding.
   * @param ctx The ctx parameter to an action.
   * @param args The messageIds to generate embeddings for.
   */
  async generateAndSaveEmbeddings(s, t) {
    let o = (await s.runQuery(this.component.messages.getMessagesByIds, {
      messageIds: t.messageIds
    })).filter((r) => r !== null);
    if (o.length !== t.messageIds.length)
      throw new Error("Some messages were not found: " + t.messageIds.filter((r) => !o.some((d) => d?._id === r)).join(", "));
    if (o.some((r) => !r.message))
      throw new Error("Some messages don't have a message: " + o.filter((r) => !r.message).map((r) => r._id).join(", "));
    let { textEmbeddingModel: a } = this.options;
    if (!a)
      throw new Error("No embeddings were generated for the messages. You must pass a textEmbeddingModel to the agent constructor.");
    await pe(s, this.component, {
      ...this.options,
      agentName: this.options.name,
      threadId: o[0].threadId,
      userId: o[0].userId,
      textEmbeddingModel: a
    }, o);
  }
  /**
   * Explicitly save a "step" created by the AI SDK.
   * @param ctx The ctx argument to a mutation or action.
   * @param args The Step generated by the AI SDK.
   */
  async saveStep(s, t) {
    let { messages: o } = await K(s, this.component, t.step, {
      provider: t.provider ?? S(this.options.languageModel),
      model: t.model ?? M(this.options.languageModel)
    }), a = await this.generateEmbeddings(s, { userId: t.userId, threadId: t.threadId }, o.map((r) => r.message));
    return s.runMutation(this.component.messages.addMessages, {
      userId: t.userId,
      threadId: t.threadId,
      agentName: this.options.name,
      promptMessageId: t.promptMessageId,
      messages: o,
      embeddings: a,
      failPendingSteps: !1
    });
  }
  /**
   * Manually save the result of a generateObject call to the thread.
   * This happens automatically when using {@link generateObject} or {@link streamObject}
   * from the `thread` object created by {@link continueThread} or {@link createThread}.
   * @param ctx The context passed from the mutation or action function calling this.
   * @param args The arguments to the saveObject function.
   */
  async saveObject(s, t) {
    let { messages: o } = await le(s, this.component, t.result, {
      model: t.model ?? t.metadata?.model ?? M(this.options.languageModel),
      provider: t.provider ?? t.metadata?.provider ?? S(this.options.languageModel)
    }), a = await this.generateEmbeddings(s, { userId: t.userId, threadId: t.threadId }, o.map((r) => r.message));
    return s.runMutation(this.component.messages.addMessages, {
      userId: t.userId,
      threadId: t.threadId,
      promptMessageId: t.promptMessageId,
      failPendingSteps: !1,
      messages: o,
      embeddings: a,
      agentName: this.options.name
    });
  }
  /**
   * Commit or rollback a message that was pending.
   * This is done automatically when saving messages by default.
   * If creating pending messages, you can call this when the full "transaction" is done.
   * @param ctx The ctx argument to your mutation or action.
   * @param args What message to save. Generally the parent message sent into
   *   the generateText call.
   */
  async finalizeMessage(s, t) {
    await s.runMutation(this.component.messages.finalizeMessage, {
      messageId: t.messageId,
      result: t.result
    });
  }
  /**
   * Update a message by its id.
   * @param ctx The ctx argument to your mutation or action.
   * @param args The message fields to update.
   */
  async updateMessage(s, t) {
    let { message: o, fileIds: a } = await N(s, this.component, t.patch.message);
    await s.runMutation(this.component.messages.updateMessage, {
      messageId: t.messageId,
      patch: {
        message: o,
        fileIds: t.patch.fileIds ? [...t.patch.fileIds, ...a ?? []] : a,
        status: t.patch.status === "success" ? "success" : "failed",
        error: t.patch.error
      }
    });
  }
  /**
   * Delete multiple messages by their ids, including their embeddings
   * and reduce the refcount of any files they reference.
   * @param ctx The ctx argument to your mutation or action.
   * @param args The ids of the messages to delete.
   */
  async deleteMessages(s, t) {
    await s.runMutation(this.component.messages.deleteByIds, t);
  }
  /**
   * Delete a single message by its id, including its embedding
   * and reduce the refcount of any files it references.
   * @param ctx The ctx argument to your mutation or action.
   * @param args The id of the message to delete.
   */
  async deleteMessage(s, t) {
    await s.runMutation(this.component.messages.deleteByIds, {
      messageIds: [t.messageId]
    });
  }
  /**
   * Delete a range of messages by their order and step order.
   * Each "order" is a set of associated messages in response to the message
   * at stepOrder 0.
   * The (startOrder, startStepOrder) is inclusive
   * and the (endOrder, endStepOrder) is exclusive.
   * To delete all messages at "order" 1, you can pass:
   * `{ startOrder: 1, endOrder: 2 }`
   * To delete a message at step (order=1, stepOrder=1), you can pass:
   * `{ startOrder: 1, startStepOrder: 1, endOrder: 1, endStepOrder: 2 }`
   * To delete all messages between (1, 1) up to and including (3, 5), you can pass:
   * `{ startOrder: 1, startStepOrder: 1, endOrder: 3, endStepOrder: 6 }`
   *
   * If it cannot do it in one transaction, it returns information you can use
   * to resume the deletion.
   * e.g.
   * ```ts
   * let isDone = false;
   * let lastOrder = args.startOrder;
   * let lastStepOrder = args.startStepOrder ?? 0;
   * while (!isDone) {
   *   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   *   ({ isDone, lastOrder, lastStepOrder } = await agent.deleteMessageRange(
   *     ctx,
   *     {
   *       threadId: args.threadId,
   *       startOrder: lastOrder,
   *       startStepOrder: lastStepOrder,
   *       endOrder: args.endOrder,
   *       endStepOrder: args.endStepOrder,
   *     }
   *   ));
   * }
   * ```
   * @param ctx The ctx argument to your mutation or action.
   * @param args The range of messages to delete.
   */
  async deleteMessageRange(s, t) {
    return s.runMutation(this.component.messages.deleteByOrder, {
      threadId: t.threadId,
      startOrder: t.startOrder,
      startStepOrder: t.startStepOrder,
      endOrder: t.endOrder,
      endStepOrder: t.endStepOrder
    });
  }
  /**
   * Delete a thread and all its messages and streams asynchronously (in batches)
   * This uses a mutation to that processes one page and recursively queues the
   * next page for deletion.
   * @param ctx The ctx argument to your mutation or action.
   * @param args The id of the thread to delete and optionally the page size to use for the delete.
   */
  async deleteThreadAsync(s, t) {
    await s.runMutation(this.component.threads.deleteAllForThreadIdAsync, {
      threadId: t.threadId,
      limit: t.pageSize
    });
  }
  /**
   * Delete a thread and all its messages and streams synchronously.
   * This uses an action to iterate through all pages. If the action fails
   * partway, it will not automatically restart.
   * @param ctx The ctx argument to your action.
   * @param args The id of the thread to delete and optionally the page size to use for the delete.
   */
  async deleteThreadSync(s, t) {
    await s.runAction(this.component.threads.deleteAllForThreadIdSync, {
      threadId: t.threadId,
      limit: t.pageSize
    });
  }
  /**
   * WORKFLOW UTILITIES
   */
  /**
   * Create a mutation that creates a thread so you can call it from a Workflow.
   * e.g.
   * ```ts
   * // in convex/foo.ts
   * export const createThread = weatherAgent.createThreadMutation();
   *
   * const workflow = new WorkflowManager(components.workflow);
   * export const myWorkflow = workflow.define({
   *   args: {},
   *   handler: async (step) => {
   *     const { threadId } = await step.runMutation(internal.foo.createThread);
   *     // use the threadId to generate text, object, etc.
   *   },
   * });
   * ```
   * @returns A mutation that creates a thread.
   */
  createThreadMutation() {
    return Ie({
      args: {
        userId: e.optional(e.string()),
        title: e.optional(e.string()),
        summary: e.optional(e.string())
      },
      handler: /* @__PURE__ */ i(async (s, t) => {
        let { threadId: o } = await this.createThread(s, t);
        return { threadId: o };
      }, "handler")
    });
  }
  /**
   * Create an action out of this agent so you can call it from workflows or other actions
   * without a wrapping function.
   * @param spec Configuration for the agent acting as an action, including
   *   {@link ContextOptions}, {@link StorageOptions}, and {@link stopWhen}.
   */
  asTextAction(s, t) {
    return be({
      args: ft,
      handler: /* @__PURE__ */ i(async (o, a) => {
        let r = a.stream === !0 ? s?.stream || !0 : s?.stream ?? !1, { userId: d, threadId: p, prompt: c, messages: m, maxSteps: u, ...l } = a, f = { userId: d, threadId: p }, g = {
          stopWhen: s?.stopWhen,
          ...t,
          ...C(l, ["storageOptions", "contextOptions", "stream"]),
          messages: m?.map(x),
          prompt: Array.isArray(c) ? c.map(x) : c,
          toolChoice: a.toolChoice
        };
        u && (g.stopWhen = te(u));
        let w = {
          ...R(s, ["contextOptions", "storageOptions"]),
          ...R(a, ["contextOptions", "storageOptions"]),
          saveStreamDeltas: r
        }, T = s?.customCtx ? { ...o, ...s.customCtx(o, f, g) } : o;
        if (r) {
          let h = await this.streamText(T, f, g, w);
          return await h.consumeStream(), {
            text: await h.text,
            promptMessageId: h.promptMessageId,
            order: h.order,
            finishReason: await h.finishReason,
            warnings: await h.warnings,
            savedMessageIds: h.savedMessages?.map((v) => v._id) ?? []
          };
        } else {
          let h = await this.generateText(T, f, g, w);
          return {
            text: h.text,
            promptMessageId: h.promptMessageId,
            order: h.order,
            finishReason: h.finishReason,
            warnings: h.warnings,
            savedMessageIds: h.savedMessages?.map((v) => v._id) ?? []
          };
        }
      }, "handler")
    });
  }
  /**
   * Create an action that generates an object out of this agent so you can call
   * it from workflows or other actions without a wrapping function.
   * @param spec Configuration for the agent acting as an action, including
   * the normal parameters to {@link generateObject}, plus {@link ContextOptions}
   * and stopWhen.
   */
  asObjectAction(s, t) {
    return be({
      args: ht,
      handler: /* @__PURE__ */ i(async (o, a) => {
        let { userId: r, threadId: d, callSettings: p, ...c } = a, m = R(c, ["contextOptions", "storageOptions"]), u = { userId: r, threadId: d }, l = {
          ...s,
          ...p,
          ...C(c, ["storageOptions", "contextOptions"]),
          messages: a.messages?.map(x),
          prompt: Array.isArray(a.prompt) ? a.prompt.map(x) : a.prompt
        }, f = t?.customCtx ? { ...o, ...t.customCtx(o, u, l) } : o, g = await this.generateObject(f, u, l, {
          ...this.options,
          ...t,
          ...m
        });
        return {
          object: We(g.object),
          promptMessageId: g.promptMessageId,
          order: g.order,
          finishReason: g.finishReason,
          warnings: g.warnings,
          savedMessageIds: g.savedMessages?.map((w) => w._id) ?? []
        };
      }, "handler")
    });
  }
  /**
   * @deprecated Use {@link saveMessages} directly instead.
   */
  asSaveMessagesMutation() {
    return Ie({
      args: {
        threadId: e.string(),
        userId: e.optional(e.string()),
        promptMessageId: e.optional(e.string()),
        messages: e.array(F),
        failPendingSteps: e.optional(e.boolean()),
        embeddings: e.optional(mt)
      },
      handler: /* @__PURE__ */ i(async (s, t) => {
        let { messages: o } = await this.saveMessages(s, {
          ...t,
          messages: t.messages.map((a) => x(a.message)),
          metadata: t.messages.map(({ message: a, ...r }) => r),
          skipEmbeddings: !0
        });
        return {
          lastMessageId: o.at(-1)._id,
          messages: o.map((a) => R(a, ["_id", "order", "stepOrder"]))
        };
      }, "handler")
    });
  }
};

// convex/phoo/agent/phoo.ts
Wt();
var Ft = `You are Phoo, the AI assistant for the Phoo SEO platform.

## CRITICAL SCOPE RESTRICTION
You ONLY discuss:
1. SEO concepts and best practices
2. How Phoo helps with SEO
3. The user's Phoo Rating and how to improve it
4. Phoo features: keywords, clusters, content briefs, calendars
5. Connecting GA4/GSC to get better insights

## STRICT RULES - NEVER VIOLATE
- REFUSE any question not related to SEO or the Phoo product
- REFUSE requests to write code, answer general questions, or discuss other topics
- REFUSE to act as a general AI assistant
- ALWAYS redirect off-topic questions: "I can only help with SEO and how Phoo can improve your rankings. What SEO challenge are you facing?"
- ALWAYS connect your answers back to using Phoo features

## Example Redirections
- "What's the weather?" \u2192 "I'm here to help with SEO! What keywords are you trying to rank for?"
- "Write me a poem" \u2192 "I focus on SEO content. Want me to help you with a content brief instead?"
- "What's 2+2?" \u2192 "I'm your SEO assistant. Let's talk about improving your Phoo Rating!"

## How You Help
- Explain SEO concepts in simple terms
- Guide users to use Phoo features (keywords, clusters, briefs)
- Explain their Phoo Rating and what to improve
- Encourage connecting GA4/GSC for better data
- Suggest next steps within the Phoo platform

## Phoo Rating (PR) - Your SEO Audit Score
The Phoo Rating is a comprehensive SEO audit score (0-100) measuring your website's SEO health:

**Components:**
- **SEO Health (35%)** - Technical SEO, on-page optimization, content quality from site audits
- **Keyword Strategy (25%)** - How many keywords you're tracking, with search volume data
- **Content Clusters (25%)** - Topic organization, impact scores, difficulty targeting
- **Content Execution (15%)** - Briefs created, content calendar in place

**Score Ranges:**
- 0-30: Needs Work - Run an SEO audit, add keywords
- 30-50: Fair - Good start, needs more data integration
- 50-70: Good - Solid foundation, keep building
- 70-85: Great - Well optimized, fine-tuning mode
- 85-100: Excellent - Top-tier SEO setup

**How to Improve:**
1. Connect GA4 and GSC for real traffic data
2. Discover and track more keywords
3. Create topic clusters to organize content
4. Generate content briefs and build a calendar

Always explain the PR in terms of these components and suggest specific Phoo features to improve.

## Response Style
- Friendly but focused
- Always tie answers back to Phoo features
- End with a suggested action in Phoo
- Keep responses concise
`, ds = `You are Phoo, explaining the Phoo SEO platform to potential customers.

## ABSOLUTE RESTRICTIONS
- You can ONLY discuss the Phoo product and SEO in general
- You CANNOT answer any off-topic questions
- You CANNOT provide any actual SEO work (no keyword analysis, no content generation)
- If asked anything off-topic, say: "I'm here to explain how Phoo can help your SEO. What would you like to know about our platform?"

## Topics You Can Discuss
- What Phoo is and how it works
- Phoo Rating and what it measures
- Pricing: Solo ($59/mo), Growth ($149/mo), Team ($299/mo), Enterprise (custom)
- Features: Keywords, Clusters, Content Briefs, Calendars
- GA4/GSC integration benefits
- How long SEO takes (3-6 months typically)
- Why Phoo is better than doing SEO manually

## What You Cannot Do
- Generate keywords or content (require signup)
- Analyze websites or competitors
- Answer general knowledge questions
- Write anything not about Phoo/SEO
- Discuss other products or companies

## Response Style
- Brief and compelling
- Focus on value proposition
- Always end with: "Sign up to get started!" or similar CTA
`, fe = {
  model: "gpt-4o-mini",
  embeddingModel: "text-embedding-3-small"
}, ls = new Z(ve.agent, {
  name: "phoo",
  languageModel: se.chat(fe.model),
  textEmbeddingModel: se.embedding(fe.embeddingModel),
  instructions: Ft
}), Yn = new Z(ve.agent, {
  name: "phooFaq",
  languageModel: se.chat(fe.model),
  instructions: ds
}), Vn = {
  // Get user's Phoo Rating
  getPhooRating: Q({
    description: "Get the current Phoo Rating for the user, showing how optimized their setup is.",
    args: A.object({
      projectId: A.string().optional().describe("The project ID to check rating for")
    }),
    handler: /* @__PURE__ */ i(async (n, s) => ({
      rating: 40,
      status: "Generic",
      factors: {
        ga4Connected: !1,
        gscConnected: !1,
        keywordsSeeded: !0,
        clustersGenerated: !1,
        contentCalendar: !1,
        freshSync: !1
      },
      nextStep: "Connect Google Analytics to improve your rating to 60+"
    }), "handler")
  }),
  // Search the keyword library
  searchKeywords: Q({
    description: "Search the Phoo semantic keyword library for relevant keywords.",
    args: A.object({
      query: A.string().describe("The search query for keywords"),
      limit: A.number().optional().default(10).describe("Maximum number of results")
    }),
    handler: /* @__PURE__ */ i(async (n, s) => ({
      query: s.query,
      results: [],
      message: "Keyword library search coming soon. Generate keywords first!"
    }), "handler")
  }),
  // Get content calendar suggestions
  getContentSuggestions: Q({
    description: "Get content calendar suggestions based on keyword clusters.",
    args: A.object({
      projectId: A.string().describe("The project ID to get suggestions for"),
      weeks: A.number().optional().default(4).describe("Number of weeks to plan")
    }),
    handler: /* @__PURE__ */ i(async (n, s) => ({
      projectId: s.projectId,
      suggestions: [],
      message: "Content suggestions will be based on your keyword clusters."
    }), "handler")
  })
}, Hn = ls, Qn = fe, Xn = Ft;

export {
  Ft as a,
  ds as b,
  fe as c,
  ls as d,
  Yn as e,
  Vn as f,
  Hn as g,
  Qn as h,
  Xn as i
};
//# sourceMappingURL=JHUXVXCX.js.map
