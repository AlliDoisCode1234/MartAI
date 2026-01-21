import {
  a as r
} from "./RUVYHBJQ.js";

// node_modules/@google/generative-ai/dist/index.mjs
var D;
(function(t) {
  t.STRING = "string", t.NUMBER = "number", t.INTEGER = "integer", t.BOOLEAN = "boolean", t.ARRAY = "array", t.OBJECT = "object";
})(D || (D = {}));
var x;
(function(t) {
  t.LANGUAGE_UNSPECIFIED = "language_unspecified", t.PYTHON = "python";
})(x || (x = {}));
var U;
(function(t) {
  t.OUTCOME_UNSPECIFIED = "outcome_unspecified", t.OUTCOME_OK = "outcome_ok", t.OUTCOME_FAILED = "outcome_failed", t.OUTCOME_DEADLINE_EXCEEDED = "outcome_deadline_exceeded";
})(U || (U = {}));
var H = ["user", "model", "function", "system"], F;
(function(t) {
  t.HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED", t.HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH", t.HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT", t.HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT", t.HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT", t.HARM_CATEGORY_CIVIC_INTEGRITY = "HARM_CATEGORY_CIVIC_INTEGRITY";
})(F || (F = {}));
var $;
(function(t) {
  t.HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED", t.BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE", t.BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE", t.BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH", t.BLOCK_NONE = "BLOCK_NONE";
})($ || ($ = {}));
var j;
(function(t) {
  t.HARM_PROBABILITY_UNSPECIFIED = "HARM_PROBABILITY_UNSPECIFIED", t.NEGLIGIBLE = "NEGLIGIBLE", t.LOW = "LOW", t.MEDIUM = "MEDIUM", t.HIGH = "HIGH";
})(j || (j = {}));
var G;
(function(t) {
  t.BLOCKED_REASON_UNSPECIFIED = "BLOCKED_REASON_UNSPECIFIED", t.SAFETY = "SAFETY", t.OTHER = "OTHER";
})(G || (G = {}));
var I;
(function(t) {
  t.FINISH_REASON_UNSPECIFIED = "FINISH_REASON_UNSPECIFIED", t.STOP = "STOP", t.MAX_TOKENS = "MAX_TOKENS", t.SAFETY = "SAFETY", t.RECITATION = "RECITATION", t.LANGUAGE = "LANGUAGE", t.BLOCKLIST = "BLOCKLIST", t.PROHIBITED_CONTENT = "PROHIBITED_CONTENT", t.SPII = "SPII", t.MALFORMED_FUNCTION_CALL = "MALFORMED_FUNCTION_CALL", t.OTHER = "OTHER";
})(I || (I = {}));
var K;
(function(t) {
  t.TASK_TYPE_UNSPECIFIED = "TASK_TYPE_UNSPECIFIED", t.RETRIEVAL_QUERY = "RETRIEVAL_QUERY", t.RETRIEVAL_DOCUMENT = "RETRIEVAL_DOCUMENT", t.SEMANTIC_SIMILARITY = "SEMANTIC_SIMILARITY", t.CLASSIFICATION = "CLASSIFICATION", t.CLUSTERING = "CLUSTERING";
})(K || (K = {}));
var Y;
(function(t) {
  t.MODE_UNSPECIFIED = "MODE_UNSPECIFIED", t.AUTO = "AUTO", t.ANY = "ANY", t.NONE = "NONE";
})(Y || (Y = {}));
var B;
(function(t) {
  t.MODE_UNSPECIFIED = "MODE_UNSPECIFIED", t.MODE_DYNAMIC = "MODE_DYNAMIC";
})(B || (B = {}));
var f = class extends Error {
  static {
    r(this, "GoogleGenerativeAIError");
  }
  constructor(e) {
    super(`[GoogleGenerativeAI Error]: ${e}`);
  }
}, C = class extends f {
  static {
    r(this, "GoogleGenerativeAIResponseError");
  }
  constructor(e, n) {
    super(e), this.response = n;
  }
}, T = class extends f {
  static {
    r(this, "GoogleGenerativeAIFetchError");
  }
  constructor(e, n, s, o) {
    super(e), this.status = n, this.statusText = s, this.errorDetails = o;
  }
}, E = class extends f {
  static {
    r(this, "GoogleGenerativeAIRequestInputError");
  }
}, m = class extends f {
  static {
    r(this, "GoogleGenerativeAIAbortError");
  }
};
var tt = "https://generativelanguage.googleapis.com", et = "v1beta", nt = "0.24.1", st = "genai-js", O;
(function(t) {
  t.GENERATE_CONTENT = "generateContent", t.STREAM_GENERATE_CONTENT = "streamGenerateContent", t.COUNT_TOKENS = "countTokens", t.EMBED_CONTENT = "embedContent", t.BATCH_EMBED_CONTENTS = "batchEmbedContents";
})(O || (O = {}));
var b = class {
  static {
    r(this, "RequestUrl");
  }
  constructor(e, n, s, o, i) {
    this.model = e, this.task = n, this.apiKey = s, this.stream = o, this.requestOptions = i;
  }
  toString() {
    var e, n;
    let s = ((e = this.requestOptions) === null || e === void 0 ? void 0 : e.apiVersion) || et, i = `${((n = this.requestOptions) === null || n === void 0 ? void 0 : n.baseUrl) || tt}/${s}/${this.model}:${this.task}`;
    return this.stream && (i += "?alt=sse"), i;
  }
};
function ot(t) {
  let e = [];
  return t?.apiClient && e.push(t.apiClient), e.push(`${st}/${nt}`), e.join(" ");
}
r(ot, "getClientHeaders");
async function it(t) {
  var e;
  let n = new Headers();
  n.append("Content-Type", "application/json"), n.append("x-goog-api-client", ot(t.requestOptions)), n.append("x-goog-api-key", t.apiKey);
  let s = (e = t.requestOptions) === null || e === void 0 ? void 0 : e.customHeaders;
  if (s) {
    if (!(s instanceof Headers))
      try {
        s = new Headers(s);
      } catch (o) {
        throw new E(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`);
      }
    for (let [o, i] of s.entries()) {
      if (o === "x-goog-api-key")
        throw new E(`Cannot set reserved header name ${o}`);
      if (o === "x-goog-api-client")
        throw new E(`Header name ${o} can only be set using the apiClient field`);
      n.append(o, i);
    }
  }
  return n;
}
r(it, "getHeaders");
async function at(t, e, n, s, o, i) {
  let a = new b(t, e, n, s, i);
  return {
    url: a.toString(),
    fetchOptions: Object.assign(Object.assign({}, lt(i)), { method: "POST", headers: await it(a), body: o })
  };
}
r(at, "constructModelRequest");
async function N(t, e, n, s, o, i = {}, a = fetch) {
  let { url: c, fetchOptions: l } = await at(t, e, n, s, o, i);
  return rt(c, l, a);
}
r(N, "makeModelRequest");
async function rt(t, e, n = fetch) {
  let s;
  try {
    s = await n(t, e);
  } catch (o) {
    ct(o, t);
  }
  return s.ok || await dt(s, t), s;
}
r(rt, "makeRequest");
function ct(t, e) {
  let n = t;
  throw n.name === "AbortError" ? (n = new m(`Request aborted when fetching ${e.toString()}: ${t.message}`), n.stack = t.stack) : t instanceof T || t instanceof E || (n = new f(`Error fetching from ${e.toString()}: ${t.message}`), n.stack = t.stack), n;
}
r(ct, "handleResponseError");
async function dt(t, e) {
  let n = "", s;
  try {
    let o = await t.json();
    n = o.error.message, o.error.details && (n += ` ${JSON.stringify(o.error.details)}`, s = o.error.details);
  } catch {
  }
  throw new T(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${n}`, t.status, t.statusText, s);
}
r(dt, "handleResponseNotOk");
function lt(t) {
  let e = {};
  if (t?.signal !== void 0 || t?.timeout >= 0) {
    let n = new AbortController();
    t?.timeout >= 0 && setTimeout(() => n.abort(), t.timeout), t?.signal && t.signal.addEventListener("abort", () => {
      n.abort();
    }), e.signal = n.signal;
  }
  return e;
}
r(lt, "buildFetchOptions");
function L(t) {
  return t.text = () => {
    if (t.candidates && t.candidates.length > 0) {
      if (t.candidates.length > 1 && console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`), A(t.candidates[0]))
        throw new C(`${_(t)}`, t);
      return ut(t);
    } else if (t.promptFeedback)
      throw new C(`Text not available. ${_(t)}`, t);
    return "";
  }, t.functionCall = () => {
    if (t.candidates && t.candidates.length > 0) {
      if (t.candidates.length > 1 && console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`), A(t.candidates[0]))
        throw new C(`${_(t)}`, t);
      return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."), k(t)[0];
    } else if (t.promptFeedback)
      throw new C(`Function call not available. ${_(t)}`, t);
  }, t.functionCalls = () => {
    if (t.candidates && t.candidates.length > 0) {
      if (t.candidates.length > 1 && console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`), A(t.candidates[0]))
        throw new C(`${_(t)}`, t);
      return k(t);
    } else if (t.promptFeedback)
      throw new C(`Function call not available. ${_(t)}`, t);
  }, t;
}
r(L, "addHelpers");
function ut(t) {
  var e, n, s, o;
  let i = [];
  if (!((n = (e = t.candidates) === null || e === void 0 ? void 0 : e[0].content) === null || n === void 0) && n.parts)
    for (let a of (o = (s = t.candidates) === null || s === void 0 ? void 0 : s[0].content) === null || o === void 0 ? void 0 : o.parts)
      a.text && i.push(a.text), a.executableCode && i.push("\n```" + a.executableCode.language + `
` + a.executableCode.code + "\n```\n"), a.codeExecutionResult && i.push("\n```\n" + a.codeExecutionResult.output + "\n```\n");
  return i.length > 0 ? i.join("") : "";
}
r(ut, "getText");
function k(t) {
  var e, n, s, o;
  let i = [];
  if (!((n = (e = t.candidates) === null || e === void 0 ? void 0 : e[0].content) === null || n === void 0) && n.parts)
    for (let a of (o = (s = t.candidates) === null || s === void 0 ? void 0 : s[0].content) === null || o === void 0 ? void 0 : o.parts)
      a.functionCall && i.push(a.functionCall);
  if (i.length > 0)
    return i;
}
r(k, "getFunctionCalls");
var ft = [
  I.RECITATION,
  I.SAFETY,
  I.LANGUAGE
];
function A(t) {
  return !!t.finishReason && ft.includes(t.finishReason);
}
r(A, "hadBadFinishReason");
function _(t) {
  var e, n, s;
  let o = "";
  if ((!t.candidates || t.candidates.length === 0) && t.promptFeedback)
    o += "Response was blocked", !((e = t.promptFeedback) === null || e === void 0) && e.blockReason && (o += ` due to ${t.promptFeedback.blockReason}`), !((n = t.promptFeedback) === null || n === void 0) && n.blockReasonMessage && (o += `: ${t.promptFeedback.blockReasonMessage}`);
  else if (!((s = t.candidates) === null || s === void 0) && s[0]) {
    let i = t.candidates[0];
    A(i) && (o += `Candidate was blocked due to ${i.finishReason}`, i.finishMessage && (o += `: ${i.finishMessage}`));
  }
  return o;
}
r(_, "formatBlockErrorMessage");
function y(t) {
  return this instanceof y ? (this.v = t, this) : new y(t);
}
r(y, "__await");
function ht(t, e, n) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var s = n.apply(t, e || []), o, i = [];
  return o = {}, a("next"), a("throw"), a("return"), o[Symbol.asyncIterator] = function() {
    return this;
  }, o;
  function a(u) {
    s[u] && (o[u] = function(d) {
      return new Promise(function(h, p) {
        i.push([u, d, h, p]) > 1 || c(u, d);
      });
    });
  }
  function c(u, d) {
    try {
      l(s[u](d));
    } catch (h) {
      v(i[0][3], h);
    }
  }
  function l(u) {
    u.value instanceof y ? Promise.resolve(u.value.v).then(g, R) : v(i[0][2], u);
  }
  function g(u) {
    c("next", u);
  }
  function R(u) {
    c("throw", u);
  }
  function v(u, d) {
    u(d), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
r(ht, "__asyncGenerator");
var P = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function gt(t) {
  let e = t.body.pipeThrough(new TextDecoderStream("utf8", { fatal: !0 })), n = _t(e), [s, o] = n.tee();
  return {
    stream: Ct(s),
    response: Et(o)
  };
}
r(gt, "processStream");
async function Et(t) {
  let e = [], n = t.getReader();
  for (; ; ) {
    let { done: s, value: o } = await n.read();
    if (s)
      return L(Ot(e));
    e.push(o);
  }
}
r(Et, "getResponsePromise");
function Ct(t) {
  return ht(this, arguments, /* @__PURE__ */ r(function* () {
    let n = t.getReader();
    for (; ; ) {
      let { value: s, done: o } = yield y(n.read());
      if (o)
        break;
      yield yield y(L(s));
    }
  }, "generateResponseSequence_1"));
}
r(Ct, "generateResponseSequence");
function _t(t) {
  let e = t.getReader();
  return new ReadableStream({
    start(s) {
      let o = "";
      return i();
      function i() {
        return e.read().then(({ value: a, done: c }) => {
          if (c) {
            if (o.trim()) {
              s.error(new f("Failed to parse stream"));
              return;
            }
            s.close();
            return;
          }
          o += a;
          let l = o.match(P), g;
          for (; l; ) {
            try {
              g = JSON.parse(l[1]);
            } catch {
              s.error(new f(`Error parsing JSON response: "${l[1]}"`));
              return;
            }
            s.enqueue(g), o = o.substring(l[0].length), l = o.match(P);
          }
          return i();
        }).catch((a) => {
          let c = a;
          throw c.stack = a.stack, c.name === "AbortError" ? c = new m("Request aborted when reading from the stream") : c = new f("Error reading from the stream"), c;
        });
      }
    }
  });
}
r(_t, "getResponseStream");
function Ot(t) {
  let e = t[t.length - 1], n = {
    promptFeedback: e?.promptFeedback
  };
  for (let s of t) {
    if (s.candidates) {
      let o = 0;
      for (let i of s.candidates)
        if (n.candidates || (n.candidates = []), n.candidates[o] || (n.candidates[o] = {
          index: o
        }), n.candidates[o].citationMetadata = i.citationMetadata, n.candidates[o].groundingMetadata = i.groundingMetadata, n.candidates[o].finishReason = i.finishReason, n.candidates[o].finishMessage = i.finishMessage, n.candidates[o].safetyRatings = i.safetyRatings, i.content && i.content.parts) {
          n.candidates[o].content || (n.candidates[o].content = {
            role: i.content.role || "user",
            parts: []
          });
          let a = {};
          for (let c of i.content.parts)
            c.text && (a.text = c.text), c.functionCall && (a.functionCall = c.functionCall), c.executableCode && (a.executableCode = c.executableCode), c.codeExecutionResult && (a.codeExecutionResult = c.codeExecutionResult), Object.keys(a).length === 0 && (a.text = ""), n.candidates[o].content.parts.push(a);
        }
      o++;
    }
    s.usageMetadata && (n.usageMetadata = s.usageMetadata);
  }
  return n;
}
r(Ot, "aggregateResponses");
async function Q(t, e, n, s) {
  let o = await N(
    e,
    O.STREAM_GENERATE_CONTENT,
    t,
    /* stream */
    !0,
    JSON.stringify(n),
    s
  );
  return gt(o);
}
r(Q, "generateContentStream");
async function z(t, e, n, s) {
  let i = await (await N(
    e,
    O.GENERATE_CONTENT,
    t,
    /* stream */
    !1,
    JSON.stringify(n),
    s
  )).json();
  return {
    response: L(i)
  };
}
r(z, "generateContent");
function Z(t) {
  if (t != null) {
    if (typeof t == "string")
      return { role: "system", parts: [{ text: t }] };
    if (t.text)
      return { role: "system", parts: [t] };
    if (t.parts)
      return t.role ? t : { role: "system", parts: t.parts };
  }
}
r(Z, "formatSystemInstruction");
function S(t) {
  let e = [];
  if (typeof t == "string")
    e = [{ text: t }];
  else
    for (let n of t)
      typeof n == "string" ? e.push({ text: n }) : e.push(n);
  return Rt(e);
}
r(S, "formatNewContent");
function Rt(t) {
  let e = { role: "user", parts: [] }, n = { role: "function", parts: [] }, s = !1, o = !1;
  for (let i of t)
    "functionResponse" in i ? (n.parts.push(i), o = !0) : (e.parts.push(i), s = !0);
  if (s && o)
    throw new f("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");
  if (!s && !o)
    throw new f("No content is provided for sending chat message.");
  return s ? e : n;
}
r(Rt, "assignRoleToPartsAndValidateSendMessageRequest");
function vt(t, e) {
  var n;
  let s = {
    model: e?.model,
    generationConfig: e?.generationConfig,
    safetySettings: e?.safetySettings,
    tools: e?.tools,
    toolConfig: e?.toolConfig,
    systemInstruction: e?.systemInstruction,
    cachedContent: (n = e?.cachedContent) === null || n === void 0 ? void 0 : n.name,
    contents: []
  }, o = t.generateContentRequest != null;
  if (t.contents) {
    if (o)
      throw new E("CountTokensRequest must have one of contents or generateContentRequest, not both.");
    s.contents = t.contents;
  } else if (o)
    s = Object.assign(Object.assign({}, s), t.generateContentRequest);
  else {
    let i = S(t);
    s.contents = [i];
  }
  return { generateContentRequest: s };
}
r(vt, "formatCountTokensInput");
function q(t) {
  let e;
  return t.contents ? e = t : e = { contents: [S(t)] }, t.systemInstruction && (e.systemInstruction = Z(t.systemInstruction)), e;
}
r(q, "formatGenerateContentInput");
function pt(t) {
  return typeof t == "string" || Array.isArray(t) ? { content: S(t) } : t;
}
r(pt, "formatEmbedContentInput");
var V = [
  "text",
  "inlineData",
  "functionCall",
  "functionResponse",
  "executableCode",
  "codeExecutionResult"
], It = {
  user: ["text", "inlineData"],
  function: ["functionResponse"],
  model: ["text", "functionCall", "executableCode", "codeExecutionResult"],
  // System instructions shouldn't be in history anyway.
  system: ["text"]
};
function yt(t) {
  let e = !1;
  for (let n of t) {
    let { role: s, parts: o } = n;
    if (!e && s !== "user")
      throw new f(`First content should be with role 'user', got ${s}`);
    if (!H.includes(s))
      throw new f(`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(H)}`);
    if (!Array.isArray(o))
      throw new f("Content should have 'parts' property with an array of Parts");
    if (o.length === 0)
      throw new f("Each Content should have at least one part");
    let i = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0,
      fileData: 0,
      executableCode: 0,
      codeExecutionResult: 0
    };
    for (let c of o)
      for (let l of V)
        l in c && (i[l] += 1);
    let a = It[s];
    for (let c of V)
      if (!a.includes(c) && i[c] > 0)
        throw new f(`Content with role '${s}' can't contain '${c}' part`);
    e = !0;
  }
}
r(yt, "validateChatHistory");
function J(t) {
  var e;
  if (t.candidates === void 0 || t.candidates.length === 0)
    return !1;
  let n = (e = t.candidates[0]) === null || e === void 0 ? void 0 : e.content;
  if (n === void 0 || n.parts === void 0 || n.parts.length === 0)
    return !1;
  for (let s of n.parts)
    if (s === void 0 || Object.keys(s).length === 0 || s.text !== void 0 && s.text === "")
      return !1;
  return !0;
}
r(J, "isValidResponse");
var W = "SILENT_ERROR", M = class {
  static {
    r(this, "ChatSession");
  }
  constructor(e, n, s, o = {}) {
    this.model = n, this.params = s, this._requestOptions = o, this._history = [], this._sendPromise = Promise.resolve(), this._apiKey = e, s?.history && (yt(s.history), this._history = s.history);
  }
  /**
   * Gets the chat history so far. Blocked prompts are not added to history.
   * Blocked candidates are not added to history, nor are the prompts that
   * generated them.
   */
  async getHistory() {
    return await this._sendPromise, this._history;
  }
  /**
   * Sends a chat message and receives a non-streaming
   * {@link GenerateContentResult}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessage(e, n = {}) {
    var s, o, i, a, c, l;
    await this._sendPromise;
    let g = S(e), R = {
      safetySettings: (s = this.params) === null || s === void 0 ? void 0 : s.safetySettings,
      generationConfig: (o = this.params) === null || o === void 0 ? void 0 : o.generationConfig,
      tools: (i = this.params) === null || i === void 0 ? void 0 : i.tools,
      toolConfig: (a = this.params) === null || a === void 0 ? void 0 : a.toolConfig,
      systemInstruction: (c = this.params) === null || c === void 0 ? void 0 : c.systemInstruction,
      cachedContent: (l = this.params) === null || l === void 0 ? void 0 : l.cachedContent,
      contents: [...this._history, g]
    }, v = Object.assign(Object.assign({}, this._requestOptions), n), u;
    return this._sendPromise = this._sendPromise.then(() => z(this._apiKey, this.model, R, v)).then((d) => {
      var h;
      if (J(d.response)) {
        this._history.push(g);
        let p = Object.assign({
          parts: [],
          // Response seems to come back without a role set.
          role: "model"
        }, (h = d.response.candidates) === null || h === void 0 ? void 0 : h[0].content);
        this._history.push(p);
      } else {
        let p = _(d.response);
        p && console.warn(`sendMessage() was unsuccessful. ${p}. Inspect response object for details.`);
      }
      u = d;
    }).catch((d) => {
      throw this._sendPromise = Promise.resolve(), d;
    }), await this._sendPromise, u;
  }
  /**
   * Sends a chat message and receives the response as a
   * {@link GenerateContentStreamResult} containing an iterable stream
   * and a response promise.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async sendMessageStream(e, n = {}) {
    var s, o, i, a, c, l;
    await this._sendPromise;
    let g = S(e), R = {
      safetySettings: (s = this.params) === null || s === void 0 ? void 0 : s.safetySettings,
      generationConfig: (o = this.params) === null || o === void 0 ? void 0 : o.generationConfig,
      tools: (i = this.params) === null || i === void 0 ? void 0 : i.tools,
      toolConfig: (a = this.params) === null || a === void 0 ? void 0 : a.toolConfig,
      systemInstruction: (c = this.params) === null || c === void 0 ? void 0 : c.systemInstruction,
      cachedContent: (l = this.params) === null || l === void 0 ? void 0 : l.cachedContent,
      contents: [...this._history, g]
    }, v = Object.assign(Object.assign({}, this._requestOptions), n), u = Q(this._apiKey, this.model, R, v);
    return this._sendPromise = this._sendPromise.then(() => u).catch((d) => {
      throw new Error(W);
    }).then((d) => d.response).then((d) => {
      if (J(d)) {
        this._history.push(g);
        let h = Object.assign({}, d.candidates[0].content);
        h.role || (h.role = "model"), this._history.push(h);
      } else {
        let h = _(d);
        h && console.warn(`sendMessageStream() was unsuccessful. ${h}. Inspect response object for details.`);
      }
    }).catch((d) => {
      d.message !== W && console.error(d);
    }), u;
  }
};
async function St(t, e, n, s) {
  return (await N(e, O.COUNT_TOKENS, t, !1, JSON.stringify(n), s)).json();
}
r(St, "countTokens");
async function Nt(t, e, n, s) {
  return (await N(e, O.EMBED_CONTENT, t, !1, JSON.stringify(n), s)).json();
}
r(Nt, "embedContent");
async function At(t, e, n, s) {
  let o = n.requests.map((a) => Object.assign(Object.assign({}, a), { model: e }));
  return (await N(e, O.BATCH_EMBED_CONTENTS, t, !1, JSON.stringify({ requests: o }), s)).json();
}
r(At, "batchEmbedContents");
var w = class {
  static {
    r(this, "GenerativeModel");
  }
  constructor(e, n, s = {}) {
    this.apiKey = e, this._requestOptions = s, n.model.includes("/") ? this.model = n.model : this.model = `models/${n.model}`, this.generationConfig = n.generationConfig || {}, this.safetySettings = n.safetySettings || [], this.tools = n.tools, this.toolConfig = n.toolConfig, this.systemInstruction = Z(n.systemInstruction), this.cachedContent = n.cachedContent;
  }
  /**
   * Makes a single non-streaming call to the model
   * and returns an object containing a single {@link GenerateContentResponse}.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContent(e, n = {}) {
    var s;
    let o = q(e), i = Object.assign(Object.assign({}, this._requestOptions), n);
    return z(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (s = this.cachedContent) === null || s === void 0 ? void 0 : s.name }, o), i);
  }
  /**
   * Makes a single streaming call to the model and returns an object
   * containing an iterable stream that iterates over all chunks in the
   * streaming response as well as a promise that returns the final
   * aggregated response.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async generateContentStream(e, n = {}) {
    var s;
    let o = q(e), i = Object.assign(Object.assign({}, this._requestOptions), n);
    return Q(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (s = this.cachedContent) === null || s === void 0 ? void 0 : s.name }, o), i);
  }
  /**
   * Gets a new {@link ChatSession} instance which can be used for
   * multi-turn chats.
   */
  startChat(e) {
    var n;
    return new M(this.apiKey, this.model, Object.assign({ generationConfig: this.generationConfig, safetySettings: this.safetySettings, tools: this.tools, toolConfig: this.toolConfig, systemInstruction: this.systemInstruction, cachedContent: (n = this.cachedContent) === null || n === void 0 ? void 0 : n.name }, e), this._requestOptions);
  }
  /**
   * Counts the tokens in the provided request.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async countTokens(e, n = {}) {
    let s = vt(e, {
      model: this.model,
      generationConfig: this.generationConfig,
      safetySettings: this.safetySettings,
      tools: this.tools,
      toolConfig: this.toolConfig,
      systemInstruction: this.systemInstruction,
      cachedContent: this.cachedContent
    }), o = Object.assign(Object.assign({}, this._requestOptions), n);
    return St(this.apiKey, this.model, s, o);
  }
  /**
   * Embeds the provided content.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async embedContent(e, n = {}) {
    let s = pt(e), o = Object.assign(Object.assign({}, this._requestOptions), n);
    return Nt(this.apiKey, this.model, s, o);
  }
  /**
   * Embeds an array of {@link EmbedContentRequest}s.
   *
   * Fields set in the optional {@link SingleRequestOptions} parameter will
   * take precedence over the {@link RequestOptions} values provided to
   * {@link GoogleGenerativeAI.getGenerativeModel }.
   */
  async batchEmbedContents(e, n = {}) {
    let s = Object.assign(Object.assign({}, this._requestOptions), n);
    return At(this.apiKey, this.model, e, s);
  }
};
var X = class {
  static {
    r(this, "GoogleGenerativeAI");
  }
  constructor(e) {
    this.apiKey = e;
  }
  /**
   * Gets a {@link GenerativeModel} instance for the provided model name.
   */
  getGenerativeModel(e, n) {
    if (!e.model)
      throw new f("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");
    return new w(this.apiKey, e, n);
  }
  /**
   * Creates a {@link GenerativeModel} instance from provided content cache.
   */
  getGenerativeModelFromCachedContent(e, n, s) {
    if (!e.name)
      throw new E("Cached content must contain a `name` field.");
    if (!e.model)
      throw new E("Cached content must contain a `model` field.");
    let o = ["model", "systemInstruction"];
    for (let a of o)
      if (n?.[a] && e[a] && n?.[a] !== e[a]) {
        if (a === "model") {
          let c = n.model.startsWith("models/") ? n.model.replace("models/", "") : n.model, l = e.model.startsWith("models/") ? e.model.replace("models/", "") : e.model;
          if (c === l)
            continue;
        }
        throw new E(`Different value for "${a}" specified in modelParams (${n[a]}) and cachedContent (${e[a]})`);
      }
    let i = Object.assign(Object.assign({}, n), { model: e.model, tools: e.tools, toolConfig: e.toolConfig, systemInstruction: e.systemInstruction, cachedContent: e });
    return new w(this.apiKey, i, s);
  }
};
export {
  G as BlockReason,
  M as ChatSession,
  B as DynamicRetrievalMode,
  x as ExecutableCodeLanguage,
  I as FinishReason,
  Y as FunctionCallingMode,
  w as GenerativeModel,
  X as GoogleGenerativeAI,
  m as GoogleGenerativeAIAbortError,
  f as GoogleGenerativeAIError,
  T as GoogleGenerativeAIFetchError,
  E as GoogleGenerativeAIRequestInputError,
  C as GoogleGenerativeAIResponseError,
  $ as HarmBlockThreshold,
  F as HarmCategory,
  j as HarmProbability,
  U as Outcome,
  H as POSSIBLE_ROLES,
  D as SchemaType,
  K as TaskType
};
/*! Bundled license information:

@google/generative-ai/dist/index.mjs:
@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=JBJ5UODT.js.map
