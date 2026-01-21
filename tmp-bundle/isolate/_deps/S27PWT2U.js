import {
  c as he,
  d as we,
  f as $,
  g as ge,
  h as Z,
  i as B
} from "./HHELKCCM.js";
import {
  c as pe,
  e as Le
} from "./GTU362KY.js";
import {
  a as M,
  b as fe,
  c as n,
  e as y,
  f as X,
  h as Y,
  o as K,
  p as de,
  t as b,
  v as j,
  w as me,
  x as E
} from "./4U34M3I6.js";
import {
  a as s,
  c as Ne,
  e as Q
} from "./RUVYHBJQ.js";

// node_modules/async-channel/lib/index.js
var V = Ne((f) => {
  "use strict";
  var _ = f && f.__awaiter || function(r, e, t, o) {
    function i(a) {
      return a instanceof t ? a : new t(function(l) {
        l(a);
      });
    }
    return s(i, "adopt"), new (t || (t = Promise))(function(a, l) {
      function c(d) {
        try {
          p(o.next(d));
        } catch (v) {
          l(v);
        }
      }
      s(c, "fulfilled");
      function u(d) {
        try {
          p(o.throw(d));
        } catch (v) {
          l(v);
        }
      }
      s(u, "rejected");
      function p(d) {
        d.done ? a(d.value) : i(d.value).then(c, u);
      }
      s(p, "step"), p((o = o.apply(r, e || [])).next());
    });
  }, T = f && f.__await || function(r) {
    return this instanceof T ? (this.v = r, this) : new T(r);
  }, Me = f && f.__asyncGenerator || function(r, e, t) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var o = t.apply(r, e || []), i, a = [];
    return i = {}, l("next"), l("throw"), l("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function l(m) {
      o[m] && (i[m] = function(g) {
        return new Promise(function(I, G) {
          a.push([m, g, I, G]) > 1 || c(m, g);
        });
      });
    }
    function c(m, g) {
      try {
        u(o[m](g));
      } catch (I) {
        v(a[0][3], I);
      }
    }
    function u(m) {
      m.value instanceof T ? Promise.resolve(m.value.v).then(p, d) : v(a[0][2], m);
    }
    function p(m) {
      c("next", m);
    }
    function d(m) {
      c("throw", m);
    }
    function v(m, g) {
      m(g), a.shift(), a.length && c(a[0][0], a[0][1]);
    }
  };
  Object.defineProperty(f, "__esModule", { value: !0 });
  f.IteratorChannel = f.Channel = f.BaseChannel = f.UnsupportedOperationError = f.ChannelClearedError = f.ChannelClosedError = void 0;
  var w = class extends Error {
    static {
      s(this, "ChannelClosedError");
    }
  };
  f.ChannelClosedError = w;
  var F = class extends Error {
    static {
      s(this, "ChannelClearedError");
    }
  };
  f.ChannelClearedError = F;
  var O = class extends Error {
    static {
      s(this, "UnsupportedOperationError");
    }
  };
  f.UnsupportedOperationError = O;
  var z = class {
    static {
      s(this, "BaseChannel");
    }
    /**
     * Create a new Channel.
     * @param bufferCapacity The maximum number of items to buffer.
     *   Defaults to 0; i.e. all push()/throw() calls will wait for a matching then() call.
     */
    constructor(e = 0) {
      this.bufferCapacity = e, this._senders = [], this._receivers = [], this._buffer = [], this._closed = !1, this._onClosePromise = new Promise((t) => this._onClose = t);
    }
    /**
     * Send a new value over the channel.
     * @param value The value to send, or a Promise resolving to a value.
     * @returns A Promise that resolves when the value has been successfully pushed.
     */
    push(e) {
      return this._send(Promise.resolve(e));
    }
    /**
     * Throw a new error in the channel. Note that errors are also buffered and subject to buffer capacity.
     * @param value The error to throw.
     * @returns A Promise that resolves when the error has been successfully thrown.
     */
    throw(e) {
      return this._send(Promise.reject(e));
    }
    /**
     * Close this channel.
     * @param clear Pass true to clear all buffered items / senders when closing the Channel. Defaults to false.
     */
    close(e = !1) {
      if (this.closed)
        throw new w();
      if (this._closed = !0, e) {
        for (let t of this._senders)
          t.reject(new w());
        this._senders = [], this._buffer = [];
      }
      for (let t of this._receivers)
        t.reject(new w());
      this._receivers = [], this._onClose();
    }
    /**
     * Clear the channel of all buffered items.
     * Also throws a `ChannelClearedError` to awaiting senders.
     * Does not close the Channel.
     */
    clear() {
      for (let t of this._senders)
        t.reject(new F());
      this._senders = [];
      let e = this._buffer;
      return this._buffer = [], e;
    }
    /**
     * Wait for the next value (or error) on this channel.
     * @returns A Promise that resolves/rejects when the next value (or error) on this channel is emitted.
     */
    get() {
      if (this.bufferSize > 0) {
        let e = this._buffer.shift();
        if (this._senders.length > 0 && this.bufferSize < this.bufferCapacity) {
          let t = this._senders.shift();
          this._buffer.push(t.item), t.resolve();
        }
        return e;
      }
      if (this._senders.length > 0) {
        let e = this._senders.shift();
        return e.resolve(), e.item;
      }
      return this.closed ? Promise.reject(new w()) : new Promise((e, t) => {
        this._receivers.push({ resolve: e, reject: t });
      });
    }
    /**
     * Wait for the next value (or error) on this channel and process it.
     * Shorthand for `chan.get().then(...)`.
     */
    then(e, t) {
      return this.get().then(e, t);
    }
    /**
     * The number of items currently buffered.
     */
    get bufferSize() {
      return this._buffer.length;
    }
    /**
     * True if this channel is closed and no longer accepts new values.
     */
    get closed() {
      return this._closed;
    }
    /**
     * A Promise that will resolve when this Channel is closed.
     */
    get onClose() {
      return this._onClosePromise;
    }
    /**
     * Returns true if this channel is closed and contains no buffered items or waiting senders.
     */
    get done() {
      return this.closed && this.bufferSize === 0 && this._senders.length === 0;
    }
    /**
     * Enables async iteration over the channel.
     * The iterator will stop and throw on the first error encountered.
     */
    [Symbol.asyncIterator]() {
      return Me(this, arguments, /* @__PURE__ */ s(function* () {
        try {
          for (; !this.done; )
            yield yield T(yield T(this));
        } catch (t) {
          if (!(t instanceof w))
            throw t;
        }
      }, "_a"));
    }
    /**
     * Throws the given error to all waiting receivers.
     * Useful if you want to interrupt all waiting routines immediately.
     */
    interrupt(e) {
      for (let t of this._receivers)
        t.reject(e);
      this._receivers = [];
    }
    /**
     * Send the given Item. Returns a Promise that resolves when sent.
     */
    _send(e) {
      return e.catch(() => {
      }), this.closed ? Promise.reject(new w()) : this._receivers.length > 0 ? (this._receivers.shift().resolve(e), Promise.resolve()) : this.bufferSize < this.bufferCapacity ? (this._buffer.push(e), Promise.resolve()) : new Promise((t, o) => {
        this._senders.push({ item: e, resolve: t, reject: o });
      });
    }
  };
  f.BaseChannel = z;
  var W = class r extends z {
    static {
      s(this, "Channel");
    }
    /**
     * Creates a new Channel from a given source.
     * @param values An Array-like or iterable object containing values to be processed.
     */
    static from(e) {
      return "length" in e ? new S(Array.from(e)) : new S(e);
    }
    /**
     * Creates a new Channel for the given values.
     * A new Channel will be created with these values.
     * @param values A list of values to be processed. These may be Promises, in which case they will be flattened.
     */
    static of(...e) {
      let t = new r(e.length);
      for (let o of e)
        t.push(o);
      return t.close(), t;
    }
    /**
     * Returns a new Channel that reads up to `n` items from this Channel
     * @param n The number of items to read from this Channel
     */
    take(e) {
      return new S(this, e);
    }
    /**
     * Applies a transformation function, applying the transformation to this Channel until it is empty and
     * @param func The transformation function.
     *   This function may read from the given input channel and write to the given output channel as desired.
     *   Because this function should at minimum read from the input channel, and possibly write to the output channel, it should return a Promise in order for concurrency limits to be obeyed.
     * @param concurrency The number of "coroutines" to spawn to perform this operation. Must be positive and finite. Defaults to 1.
     * @param bufferCapacity The buffer size of the output channel. Defaults to 0.
     */
    transform(e, t, o) {
      let i = new r(o);
      return this._consume((a) => _(this, void 0, void 0, function* () {
        try {
          yield e(a, i);
        } catch (l) {
          l instanceof w || i.throw(l);
        }
      }), t).then(() => i.close()), i;
    }
    /**
     * Applies the given 1-to-1 mapping function to this Channel and returns a new Channel with the mapped values.
     * @param onvalue A function that maps values from this Channel.
     *   To map to an error, either throw or return a rejecting Promise.
     *   May return a Promise or a plain value. If omitted, values will be propagated as-is.
     * @param onerror A function that maps errors from this Channel to *values*.
     *   To map to an error, either throw or return a rejecting Promise.
     *   May return a Promise or a plain value. If omitted, errors will be propagated as-is.
     * @param concurrency The number of "coroutines" to spawn to perform this operation. Must be positive and finite. Defaults to 1.
     * @param bufferCapacity The buffer size of the output channel. Defaults to 0.
     */
    map(e, t, o, i) {
      return this.transform((a, l) => a.then(e, t && ((c) => {
        if (c instanceof w)
          throw c;
        return t(c);
      })).then((c) => l.push(c), (c) => {
        if (!(c instanceof w))
          return l.throw(c);
      }), o, i);
    }
    /**
     * Applies the given filter function to the values from this Channel and returns a new Channel with only the filtered values.
     * @param onvalue A function that takes a value from this Channel and returns a boolean of whether to include the value in the resulting Channel.
     *   May return a Promise or a plain value. Defaults to passing all values.
     * @param onerror A function that takes an error from this Channel and returns a boolean of whether to include the error in the resulting Channel.
     *   May return a Promise or a plain value. Defaults to passing all values.
     * @param concurrency The number of "coroutines" to spawn to perform this operation. Must be positive and finite. Defaults to 1.
     * @param bufferCapacity The buffer size of the output channel. Defaults to 0.
     */
    filter(e, t, o, i) {
      return this.transform((a, l) => a.then((c) => _(this, void 0, void 0, function* () {
        (!e || (yield e(c))) && (yield l.push(c));
      }), (c) => _(this, void 0, void 0, function* () {
        !(c instanceof w) && (!t || (yield t(c))) && (yield l.throw(c));
      })), o, i);
    }
    /**
     * Consumes each value from this Channel, applying the given function on each. Errors on the Channel or in the function will cause the returned Promise to reject.
     * @param onvalue A function to invoke with each value from this Channel.
     * @param onerror A function to invoke with each error from this Channel.
     * @param concurrency The number of "coroutines" to spawn to perform this operation. Must be positive and finite. Defaults to 1.
     * @returns A Promise that resolves when all values have been consumed, or rejects when an error is received from the Channel.
     */
    forEach(e, t, o) {
      let i = !1, a;
      return this._consume((l) => _(this, void 0, void 0, function* () {
        if (i)
          throw a;
        yield l.then(e, (c) => {
          if (!(c instanceof w)) {
            if (!i && t)
              return t(c);
            throw c;
          }
        }).catch((c) => {
          throw i || (i = !0, a = c, l.interrupt(c)), c;
        });
      }), o);
    }
    /**
     * Consumes the values in this Channel and inserts them into an Array.
     * Returns a Promise that resolves to that Array if no errors were emitted.
     */
    toArray() {
      return _(this, void 0, void 0, function* () {
        let e = [];
        return yield this.forEach((t) => e.push(t)), e;
      });
    }
    /**
     * General function for applying a consumer function with multiple "coroutines" until the Channel is done.
     * Also handles errors by stopping all routines.
     */
    _consume(e, t = 1) {
      if (t <= 0 || !isFinite(t))
        throw new RangeError("Value for concurrency must be positive and finite");
      let o = [];
      for (let i = 0; i < t; i++)
        o.push(_(this, void 0, void 0, function* () {
          for (; !this.done; )
            yield e(this);
        }));
      return Promise.all(o).then();
    }
  };
  f.Channel = W;
  var S = class extends W {
    static {
      s(this, "IteratorChannel");
    }
    /**
     * Create a new IteratorChannel.
     * @param source the iterable source to take elements from.
     * @param limit An optional maximum number of items to take from the source before closing this Channel.
     */
    constructor(e, t = 1 / 0) {
      super(0), this.limit = t, this._iterating = !1, Symbol.asyncIterator in e ? this._iterator = e[Symbol.asyncIterator]() : this._iterator = e[Symbol.iterator]();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    push(e) {
      throw new O("Cannot push to an iterator-based Channel");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throw(e) {
      throw new O("Cannot push to an iterator-based Channel");
    }
    clear() {
      throw new O("Cannot clear an iterator-based Channel");
    }
    get() {
      this.limit <= 0 ? this.close() : this.limit--;
      let e = super.get();
      return this._iterate(), e;
    }
    _iterate() {
      return _(this, void 0, void 0, function* () {
        if (!this.closed && this._iterator && this._receivers.length > 0 && !this._iterating) {
          this._iterating = !0;
          try {
            let e = yield this._iterator.next();
            this._iterating = !1, e.done ? this.close() : (this._send(Promise.resolve(e.value)), this._senders.length === 0 && this._iterate());
          } catch (e) {
            this._iterating = !1, this._send(Promise.reject(e));
          }
        }
      });
    }
  };
  f.IteratorChannel = S;
});

// node_modules/@convex-dev/workflow/dist/client/index.js
E();

// node_modules/@convex-dev/workflow/dist/client/safeFunctionName.js
E();
function x(r) {
  let e = X(r);
  return e.name || e.reference && e.reference.split("/").slice(2).join("/") || e.functionHandle && e.functionHandle.slice(11) || K(r);
}
s(x, "safeFunctionName");

// node_modules/@convex-dev/workflow/dist/client/workflowMutation.js
var Oe = Q(V(), 1);
E();
y();

// node_modules/@convex-dev/workflow/dist/component/logging.js
y();
var Te = "WARN", te = n.union(n.literal("DEBUG"), n.literal("TRACE"), n.literal("INFO"), n.literal("REPORT"), n.literal("WARN"), n.literal("ERROR")), De = te.members.map((r) => r.value), R = De.reduce((r, e, t) => (r[e] = t, r), {});
var $e = R.DEBUG, ke = R.TRACE, ee = R.INFO, Be = R.REPORT, Fe = R.WARN, ze = R.ERROR;
function ye(r) {
  let e = r ?? Te, t = R[e];
  if (t === void 0)
    throw new Error(`Invalid log level: ${e}`);
  return {
    logLevel: e,
    debug: /* @__PURE__ */ s((...o) => {
      t <= $e && console.debug(...o);
    }, "debug"),
    log: /* @__PURE__ */ s((...o) => {
      t <= ee && console.log(...o);
    }, "log"),
    info: /* @__PURE__ */ s((...o) => {
      t <= ee && console.info(...o);
    }, "info"),
    warn: /* @__PURE__ */ s((...o) => {
      t <= Fe && console.warn(...o);
    }, "warn"),
    error: /* @__PURE__ */ s((...o) => {
      t <= ze && console.error(...o);
    }, "error"),
    time: /* @__PURE__ */ s((o) => {
      t <= ke && console.time(o);
    }, "time"),
    timeEnd: /* @__PURE__ */ s((o) => {
      t <= ke && console.timeEnd(o);
    }, "timeEnd"),
    event: /* @__PURE__ */ s((o, i) => {
      let a = {
        component: "workflow",
        event: o,
        ...i
      };
      (t === Be && o === "report" || t <= ee) && console.info(JSON.stringify(a));
    }, "event")
  };
}
s(ye, "createLogger");

// node_modules/@convex-dev/workpool/dist/client/index.js
E();
y();

// node_modules/@convex-dev/workpool/dist/component/logging.js
y();
var U = n.union(n.literal("DEBUG"), n.literal("TRACE"), n.literal("INFO"), n.literal("REPORT"), n.literal("WARN"), n.literal("ERROR")), We = U.members.map((r) => r.value), C = We.reduce((r, e, t) => (r[e] = t, r), {});
var gt = C.DEBUG, kt = C.TRACE, yt = C.INFO, bt = C.REPORT, vt = C.WARN, Et = C.ERROR;

// node_modules/@convex-dev/workpool/dist/component/shared.js
y();
var At = n.union(n.literal("action"), n.literal("mutation"), n.literal("query"));
var Ve = 1e3, Ue = 60 * Ve, qe = 60 * Ue, He = 24 * qe, jt = 365 * He;
var Ot = n.object({
  maxParallelism: n.number(),
  logLevel: U
}), Ge = n.object({
  maxAttempts: n.number(),
  initialBackoffMs: n.number(),
  base: n.number()
});
var k = n.union(n.object({
  kind: n.literal("success"),
  returnValue: n.any()
}), n.object({
  kind: n.literal("failed"),
  error: n.string()
}), n.object({
  kind: n.literal("canceled")
})), St = n.object({
  fnHandle: n.string(),
  // mutation
  context: n.optional(n.any())
}), Ct = n.union(n.union(n.object({
  state: n.literal("pending"),
  previousAttempts: n.number()
}), n.object({
  state: n.literal("running"),
  previousAttempts: n.number()
}), n.object({
  state: n.literal("finished")
})));

// node_modules/@convex-dev/workpool/dist/client/utils.js
E();

// node_modules/@convex-dev/workpool/dist/client/index.js
var P = n.string();
var Ht = Je(n.any());
function Je(r) {
  return n.object({
    workId: P,
    context: r ?? n.optional(n.any()),
    result: k
  });
}
s(Je, "vOnCompleteArgs");

// node_modules/@convex-dev/workflow/dist/component/schema.js
E();
y();
function re(r) {
  return JSON.stringify(M(r)).length;
}
s(re, "valueSize");
function Qe(r) {
  let e = 0;
  switch (e += r.kind.length, r.kind) {
    case "success": {
      e += 8 + re(r.returnValue);
      break;
    }
    case "failed": {
      e += r.error.length;
      break;
    }
    case "canceled":
      break;
  }
  return e;
}
s(Qe, "resultSize");
var Xe = n.object({
  fnHandle: n.string(),
  // mutation
  context: n.optional(n.any())
}), be = {
  name: n.optional(n.string()),
  workflowHandle: n.string(),
  args: n.any(),
  onComplete: n.optional(Xe),
  logLevel: $,
  startedAt: $,
  state: $,
  // undefined until it's completed
  runResult: n.optional(k),
  // Internal execution status, used to totally order mutations.
  generationNumber: n.number()
}, nn = n.object({
  _id: n.string(),
  _creationTime: n.number(),
  ...be
}), ne = {
  name: n.string(),
  inProgress: n.boolean(),
  argsSize: n.number(),
  args: n.any(),
  runResult: n.optional(k),
  startedAt: n.number(),
  completedAt: n.optional(n.number())
}, Ye = n.union(n.object({
  kind: n.optional(n.literal("function")),
  functionType: we("query", "mutation", "action"),
  handle: n.string(),
  workId: n.optional(P),
  ...ne
}), n.object({
  kind: n.literal("workflow"),
  handle: n.string(),
  workflowId: n.optional(n.id("workflows")),
  ...ne
}), n.object({
  kind: n.literal("event"),
  ...ne,
  eventId: n.optional(n.id("events")),
  args: n.object({ eventId: n.optional(n.id("events")) })
}));
function Ke(r) {
  let e = 0;
  switch (e += r.name.length, e += 1, r.kind && (e += r.kind.length), r.kind) {
    case void 0:
    case "function":
      e += r.handle.length, e += r.functionType.length, e += r.workId?.length ?? 0;
      break;
    case "workflow":
      e += r.handle.length, e += r.workflowId?.length ?? 0;
      break;
    case "event":
      e += r.eventId?.length ?? 0;
      break;
  }
  return e += 8 + r.argsSize, r.runResult && (e += Qe(r.runResult)), e += 8, e += 8, e;
}
s(Ke, "stepSize");
var ve = {
  workflowId: n.id("workflows"),
  stepNumber: n.number(),
  step: Ye
};
function oe(r) {
  let e = 0;
  return e += r.workflowId.length, e += 8, e += Ke(r.step), e += r._id.length, e += 8, e;
}
s(oe, "journalEntrySize");
var rn = n.object({
  _id: n.string(),
  _creationTime: n.number(),
  ...ve
}), Ze = {
  workflowId: n.id("workflows"),
  name: n.string(),
  state: n.union(n.object({
    kind: n.literal("created")
  }), n.object({
    kind: n.literal("sent"),
    result: k,
    sentAt: n.number()
  }), n.object({
    kind: n.literal("waiting"),
    waitingAt: n.number(),
    stepId: n.id("steps")
  }), n.object({
    kind: n.literal("consumed"),
    waitingAt: n.number(),
    sentAt: n.number(),
    consumedAt: n.number(),
    stepId: n.id("steps")
  }))
}, on = me({
  config: j({
    logLevel: n.optional(te),
    maxParallelism: n.optional(n.number())
  }),
  workflows: j(be),
  steps: j(ve).index("workflow", ["workflowId", "stepNumber"]).index("inProgress", ["step.inProgress", "workflowId"]),
  events: j(Ze).index("workflowId_state", [
    "workflowId",
    "state.kind"
  ]),
  onCompleteFailures: j(n.union(n.object({
    workId: n.optional(P),
    workflowId: n.optional(n.string()),
    result: k,
    context: n.any()
  }), n.object({
    workflowId: n.id("workflows"),
    generationNumber: n.number(),
    runResult: k,
    error: n.string()
  })))
});

// node_modules/@convex-dev/workflow/dist/client/environment.js
function et(r) {
  let e = 0;
  for (let t = 0; t < r.length; t++) {
    let o = r.charCodeAt(t);
    e = (e << 5) - e + o, e = e & e;
  }
  return e >>> 0;
}
s(et, "hashString");
function tt(r) {
  return () => {
    r = r + 2654435769 | 0;
    let e = Math.imul(r ^ r >>> 16, 569420461);
    return e = Math.imul(e ^ e >>> 15, 1935289751), ((e ^ e >>> 15) >>> 0) / 4294967296;
  };
}
s(tt, "createSeededRandom");
function nt(r, e) {
  let t = Object.create(Object.getPrototypeOf(r));
  for (let i of Object.getOwnPropertyNames(r))
    if (i !== "random") {
      let a = Object.getOwnPropertyDescriptor(r, i);
      a && Object.defineProperty(t, i, a);
    }
  let o = tt(et(e));
  return t.random = o, t;
}
s(nt, "patchMath");
function rt(r, e) {
  function t(...o) {
    if (!(this instanceof t))
      return new t().toString();
    if (o.length === 0) {
      let { now: i } = e();
      return new r(i);
    }
    return new r(...o);
  }
  return s(t, "DeterministicDate"), t.now = function() {
    let { now: o } = e();
    return o;
  }, t.parse = r.parse, t.UTC = r.UTC, t.prototype = r.prototype, t.prototype.constructor = t, t;
}
s(rt, "createDeterministicDate");
function xe(r, e) {
  let t = globalThis;
  t.Math = nt(t.Math, e);
  let o = t.Date;
  t.Date = rt(o, r), t.console = ot(t.console, r), t.fetch = (i, a) => {
    throw new Error("Fetch isn't currently supported within workflows. Perform the fetch within an action and call it with step.runAction().");
  }, delete t.process, delete t.Crypto, delete t.crypto, delete t.CryptoKey, delete t.SubtleCrypto, t.setTimeout = () => {
    throw new Error("setTimeout isn't supported within workflows yet");
  }, t.setInterval = () => {
    throw new Error("setInterval isn't supported within workflows yet");
  };
}
s(xe, "setupEnvironment");
function Ee() {
}
s(Ee, "noop");
function ot(r, e) {
  let t = {}, o = {};
  return new Proxy(r, {
    get: /* @__PURE__ */ s((i, a) => {
      let { now: l, latest: c } = e();
      switch (a) {
        case "assert":
        case "clear":
        case "debug":
        case "dir":
        case "dirxml":
        case "error":
        case "info":
        case "log":
        case "table":
        case "trace":
        case "warn":
        case "profile":
        case "profileEnd":
        case "timeStamp":
          return c ? i[a] : Ee;
        case "Console":
          throw new Error("console.Console() is not supported within workflows");
        case "count":
          return (u) => {
            let p = u ?? "default";
            t[p] = (t[p] ?? 0) + 1, c && i.info(`${p}: ${t[p]}`);
          };
        case "countReset":
          return (u) => {
            let p = u ?? "default";
            t[p] = 0;
          };
        case "group":
        case "groupCollapsed":
          return c ? i[a] : () => i.group();
        case "groupEnd":
          return i[a];
        case "time":
          return c ? i[a] : (u) => {
            o[u ?? "default"] = l;
          };
        case "timeEnd":
        case "timeLog":
          return c ? (u, ...p) => {
            let d = u ?? "default";
            o[d] === void 0 ? i[a](u) : i.info(`${d}: ${l - o[d]}ms`, ...p);
          } : Ee;
      }
      return i[a];
    }, "get")
  });
}
s(ot, "createConsole");

// node_modules/@convex-dev/workflow/dist/client/step.js
var dn = Q(V(), 1);
E();
y();

// node_modules/@convex-dev/workflow/dist/shared.js
function ie(r) {
  return r instanceof Error ? r.toString() + (r.stack ? `
` + r.stack : "") : String(r);
}
s(ie, "formatErrorWithStack");

// node_modules/@convex-dev/workflow/dist/client/step.js
var q = class {
  static {
    s(this, "StepExecutor");
  }
  workflowId;
  generationNumber;
  ctx;
  component;
  journalEntries;
  receiver;
  now;
  workpoolOptions;
  journalEntrySize;
  constructor(e, t, o, i, a, l, c, u) {
    if (this.workflowId = e, this.generationNumber = t, this.ctx = o, this.component = i, this.journalEntries = a, this.receiver = l, this.now = c, this.workpoolOptions = u, this.journalEntrySize = a.reduce((p, d) => p + oe(d), 0), this.journalEntrySize > 8388608)
      throw new Error(_e(this.journalEntrySize, this.workflowId));
  }
  async run() {
    for (; ; ) {
      let e = await this.receiver.get(), t = this.journalEntries.shift();
      if (t) {
        this.completeMessage(e, t);
        continue;
      }
      let o = [e], i = this.receiver.bufferSize;
      for (let l = 0; l < i; l++) {
        let c = await this.receiver.get();
        o.push(c);
      }
      let a = await this.startSteps(o);
      if (a.every((l) => l.step.runResult)) {
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          this.completeMessage(o[l], c);
        }
        continue;
      }
      return {
        type: "executorBlocked"
      };
    }
  }
  getGenerationState() {
    return this.journalEntries.length <= this.receiver.bufferSize ? { now: this.now, latest: !0 } : {
      // We use the next entry's startedAt, since we're in code just before that
      // step is invoked. We use the bufferSize, since multiple steps may be
      // currently enqueued in one generation, but the code after it has already
      // started executing.
      now: this.journalEntries[this.receiver.bufferSize].step.startedAt,
      latest: !1
    };
  }
  completeMessage(e, t) {
    if (t.step.inProgress)
      throw new Error("Assertion failed: not blocked but have in-progress journal entry");
    let o = JSON.stringify(M(t.step.args)), i = JSON.stringify(M(e.target.args));
    if (o !== i)
      throw new Error(`Journal entry mismatch: ${t.step.args} !== ${e.target.args}`);
    if (t.step.runResult === void 0)
      throw new Error("Assertion failed: no outcome for completed function call");
    switch (t.step.runResult.kind) {
      case "success":
        e.resolve(t.step.runResult.returnValue);
        break;
      case "failed":
        e.reject(new Error(t.step.runResult.error));
        break;
      case "canceled":
        e.reject(new Error("Canceled"));
        break;
    }
  }
  async startSteps(e) {
    let t = await Promise.all(e.map(async (i) => {
      let a = {
        inProgress: !0,
        name: i.name,
        args: i.target.args,
        argsSize: re(i.target.args),
        outcome: void 0,
        startedAt: this.now,
        completedAt: void 0
      }, l = i.target, c = l.kind === "function" ? {
        kind: "function",
        functionType: l.functionType,
        handle: await b(l.function),
        ...a
      } : l.kind === "workflow" ? {
        kind: "workflow",
        handle: await b(l.function),
        ...a
      } : {
        kind: "event",
        eventId: l.args.eventId,
        ...a,
        args: l.args
      };
      return {
        retry: i.retry,
        schedulerOptions: i.schedulerOptions,
        step: c
      };
    })), o = await this.ctx.runMutation(this.component.journal.startSteps, {
      workflowId: this.workflowId,
      generationNumber: this.generationNumber,
      steps: t,
      workpoolOptions: this.workpoolOptions
    });
    for (let i of o)
      if (this.journalEntrySize += oe(i), this.journalEntrySize > 8388608)
        throw new Error(_e(this.journalEntrySize, this.workflowId) + ` The failing step was ${i.step.name} (${i._id})`);
    return o;
  }
};
function _e(r, e) {
  return [
    `Workflow ${e} journal size limit exceeded (${r} bytes > ${8388608} bytes).`,
    "Consider breaking up the workflow into multiple runs, using smaller step     arguments or return values, or using fewer steps."
  ].join(`
`);
}
s(_e, "journalSizeError");

// node_modules/@convex-dev/workflow/dist/client/workflowContext.js
var bn = Q(V(), 1);
function Re(r, e) {
  return {
    workflowId: r,
    runQuery: /* @__PURE__ */ s(async (t, o, i) => ae(e, "query", t, o, i), "runQuery"),
    runMutation: /* @__PURE__ */ s(async (t, o, i) => ae(e, "mutation", t, o, i), "runMutation"),
    runAction: /* @__PURE__ */ s(async (t, o, i) => ae(e, "action", t, o, i), "runAction"),
    runWorkflow: /* @__PURE__ */ s(async (t, o, i) => {
      let { name: a, ...l } = i ?? {};
      return le(e, {
        name: a ?? x(t),
        target: {
          kind: "workflow",
          function: t,
          args: o
        },
        retry: void 0,
        schedulerOptions: l
      });
    }, "runWorkflow"),
    awaitEvent: /* @__PURE__ */ s(async (t) => {
      let o = await le(e, {
        name: t.name ?? t.id ?? "Event",
        target: {
          kind: "event",
          args: { eventId: t.id }
        },
        retry: void 0,
        schedulerOptions: {}
      });
      return t.validator ? B(t.validator, o) : o;
    }, "awaitEvent")
  };
}
s(Re, "createWorkflowCtx");
async function ae(r, e, t, o, i) {
  let { name: a, retry: l, ...c } = i ?? {};
  return le(r, {
    name: a ?? x(t),
    target: {
      kind: "function",
      functionType: e,
      function: t,
      args: o
    },
    retry: l,
    schedulerOptions: c
  });
}
s(ae, "runFunction");
async function le(r, e) {
  let t, o = new Promise((i, a) => {
    t = r.push({
      ...e,
      resolve: i,
      reject: a
    });
  });
  return await t, o;
}
s(le, "run");

// node_modules/@convex-dev/workflow/dist/client/validator.js
y();
function Ae(r, e) {
  if (!e)
    return;
  let t = N(r, n.object(e));
  if (!t.ok)
    throw new Error(t.message);
}
s(Ae, "checkArgs");
function N(r, e) {
  switch (e.kind) {
    case "id": {
      if (typeof r != "string")
        return {
          ok: !1,
          message: `v.id() failed: Expected an ID, received: ${r}`
        };
      break;
    }
    case "string": {
      if (typeof r != "string")
        return {
          ok: !1,
          message: `v.string() failed: Expected a string, received: ${r}`
        };
      break;
    }
    case "float64": {
      if (typeof r != "number")
        return {
          ok: !1,
          message: `v.float64() failed: Expected a number, received: ${r}`
        };
      break;
    }
    case "int64": {
      if (typeof r != "bigint")
        return {
          ok: !1,
          message: `v.int64() failed: Expected a number, received: ${r}`
        };
      break;
    }
    case "boolean": {
      if (typeof r != "boolean")
        return {
          ok: !1,
          message: `v.boolean() failed: Expected a boolean, received: ${r}`
        };
      break;
    }
    case "null": {
      if (r !== null)
        return {
          ok: !1,
          message: `v.null() failed: Expected null, received: ${r}`
        };
      break;
    }
    case "any":
      break;
    case "literal": {
      if (r !== e.value)
        return {
          ok: !1,
          message: `v.literal(${e.value}) failed: Expected ${e.value}, received: ${r}`
        };
      break;
    }
    case "bytes": {
      if (!(r instanceof ArrayBuffer))
        return {
          ok: !1,
          message: `v.bytes() failed: Expected an ArrayBuffer, received: ${r}`
        };
      break;
    }
    case "object": {
      if (!Ie(r))
        return {
          ok: !1,
          message: `v.object() failed: Expected a simple object, received: ${r}`
        };
      for (let [t, o] of Object.entries(e.fields)) {
        let i = r[t];
        if (i === void 0) {
          if (o.isOptional === "required")
            return {
              ok: !1,
              message: `v.object() failed: Expected field "${t}", received: ${r}`
            };
        } else {
          let a = N(i, o);
          if (!a.ok)
            return {
              ok: !1,
              message: `v.object() failed: ${a.message}`
            };
        }
      }
      break;
    }
    case "array": {
      if (!Array.isArray(r))
        return {
          ok: !1,
          message: `v.array() failed: Expected an array, received: ${r}`
        };
      for (let t of r) {
        let o = N(t, e.element);
        if (!o.ok)
          return { ok: !1, message: `v.array() failed: ${o.message}` };
      }
      break;
    }
    case "record": {
      if (!Ie(r))
        return {
          ok: !1,
          message: `v.record() failed: Expected a simple object, received: ${r}`
        };
      for (let [t, o] of Object.entries(r)) {
        let i = N(t, e.key);
        if (!i.ok)
          return {
            ok: !1,
            message: `v.record() failed: ${i.message}`
          };
        let a = N(o, e.value);
        if (!a.ok)
          return {
            ok: !1,
            message: `v.record() failed: ${a.message}`
          };
      }
      break;
    }
    case "union": {
      let t = !1;
      for (let o of e.members)
        if (N(r, o).ok) {
          t = !0;
          break;
        }
      if (!t)
        return {
          ok: !1,
          message: `v.union() failed: Expected one of: ${e.members.map((o) => o.kind).join(", ")}, received: ${r}`
        };
      break;
    }
    default:
      throw new Error("Unknown validator kind");
  }
  return { ok: !0 };
}
s(N, "check");
function Ie(r) {
  let e = typeof r == "object", t = Object.getPrototypeOf(r), o = t === null || t === Object.prototype || // Objects generated from other contexts (e.g. across Node.js `vm` modules) will not satisfy the previous
  // conditions but are still simple objects.
  t?.constructor?.name === "Object";
  return e && o;
}
s(Ie, "isSimpleObject");

// node_modules/@convex-dev/workflow/dist/types.js
y();
var D = n.string(), je = /* @__PURE__ */ s((r) => n.string(), "vEventId"), it = n.object({
  workflowId: D,
  name: n.string(),
  stepId: n.string(),
  stepNumber: n.number(),
  args: n.any(),
  runResult: n.optional(k),
  startedAt: n.number(),
  completedAt: n.optional(n.number()),
  kind: n.union(n.literal("function"), n.literal("workflow"), n.literal("event")),
  workId: n.optional(P),
  nestedWorkflowId: n.optional(D),
  eventId: n.optional(je())
});

// node_modules/@convex-dev/workflow/dist/client/workflowMutation.js
var st = n.union(n.object({
  workflowId: D,
  generationNumber: n.number()
}), n.object({
  fn: n.string(),
  args: n.any()
})), at = `Invalid arguments for workflow: Did you invoke the workflow with ctx.runMutation() instead of workflow.start()? Pro tip: to start a workflow directly from the CLI or dashboard, you can use args '{ fn: "path/to/file:workflowName", args: { ...your workflow args } }'`;
function Se(r, e, t) {
  let o = {
    ...t,
    ...e.workpoolOptions
  };
  return Y({
    handler: /* @__PURE__ */ s(async (i, a) => {
      if (!Z(st, a))
        throw new Error(at);
      if ("fn" in a) {
        let h = de(a.fn);
        return await i.runMutation(r.workflow.create, {
          workflowName: x(h),
          workflowHandle: await b(h),
          workflowArgs: a.args,
          maxParallelism: o.maxParallelism
        });
      }
      let { workflowId: l, generationNumber: c } = a, { workflow: u, logLevel: p, journalEntries: d, ok: v } = await i.runQuery(r.journal.load, { workflowId: l, shortCircuit: !0 }), m = d.filter(({ step: h }) => h.inProgress), g = ye(p);
      if (!v) {
        g.error(`Failed to load journal for ${l}`), await i.runMutation(r.workflow.complete, {
          workflowId: l,
          generationNumber: c,
          runResult: { kind: "failed", error: "Failed to load journal" }
        });
        return;
      }
      if (u.generationNumber !== c) {
        g.error(`Invalid generation number: ${c} running workflow ${u.name} (${l})`);
        return;
      }
      if (u.runResult?.kind === "success") {
        g.log(`Workflow ${l} completed, returning.`);
        return;
      }
      if (m.length > 0) {
        g.log(`Workflow ${l} blocked by ` + m.map((h) => `${h.step.name} (${h._id})`).join(", "));
        return;
      }
      for (let h of d)
        he(!h.step.inProgress, "Assertion failed: not blocked but have in-progress journal entry");
      let I = new Oe.BaseChannel(o.maxParallelism ?? 10), G = Re(l, I), J = new q(l, c, i, r, d, I, Date.now(), o);
      xe(J.getGenerationState.bind(J), l);
      let Ce = /* @__PURE__ */ s(async () => {
        let h;
        try {
          Ae(u.args, e.args);
          let L = await e.handler(G, u.args) ?? null;
          if (h = { kind: "success", returnValue: L }, e.returns)
            try {
              Z(fe(e.returns), L, {
                throw: !0
              });
            } catch (A) {
              let ue = A instanceof ge ? A.message : ie(A);
              g.error("Workflow handler returned invalid return value: ", ue), h = {
                kind: "failed",
                error: "Invalid return value: " + ue
              };
            }
        } catch (L) {
          let A = ie(L);
          g.error(A), h = { kind: "failed", error: A };
        }
        return { type: "handlerDone", runResult: h };
      }, "handlerWorker"), Pe = /* @__PURE__ */ s(async () => await J.run(), "executorWorker"), ce = await Promise.race([Ce(), Pe()]);
      switch (ce.type) {
        case "handlerDone": {
          await i.runMutation(r.workflow.complete, {
            workflowId: l,
            generationNumber: c,
            runResult: ce.runResult
          });
          break;
        }
        case "executorBlocked":
          break;
      }
    }, "handler")
  });
}
s(Se, "workflowMutation");

// node_modules/@convex-dev/workflow/dist/client/index.js
var H = class {
  static {
    s(this, "WorkflowManager");
  }
  component;
  options;
  constructor(e, t) {
    this.component = e, this.options = t;
  }
  /**
   * Define a new workflow.
   *
   * @param workflow - The workflow definition.
   * @returns The workflow mutation.
   */
  define(e) {
    return Se(this.component, e, this.options?.workpoolOptions);
  }
  /**
   * Kick off a defined workflow.
   *
   * @param ctx - The Convex context.
   * @param workflow - The workflow to start (e.g. `internal.index.exampleWorkflow`).
   * @param args - The workflow arguments.
   * @returns The workflow ID.
   */
  async start(e, t, o, i) {
    let a = await b(t), l = i?.onComplete ? {
      fnHandle: await b(i.onComplete),
      context: i.context
    } : void 0;
    return await e.runMutation(this.component.workflow.create, {
      workflowName: x(t),
      workflowHandle: a,
      workflowArgs: o,
      maxParallelism: this.options?.workpoolOptions?.maxParallelism,
      onComplete: l,
      startAsync: i?.startAsync ?? i?.validateAsync
    });
  }
  /**
   * Get a workflow's status.
   *
   * @param ctx - The Convex context.
   * @param workflowId - The workflow ID.
   * @returns The workflow status.
   */
  async status(e, t) {
    let { workflow: o, inProgress: i } = await e.runQuery(this.component.workflow.getStatus, { workflowId: t }), a = i.map((l) => l.step);
    switch (o.runResult?.kind) {
      case void 0:
        return { type: "inProgress", running: a };
      case "canceled":
        return { type: "canceled" };
      case "failed":
        return { type: "failed", error: o.runResult.error };
      case "success":
        return { type: "completed", result: o.runResult.returnValue };
    }
  }
  /**
   * Cancel a running workflow.
   *
   * @param ctx - The Convex context.
   * @param workflowId - The workflow ID.
   */
  async cancel(e, t) {
    await e.runMutation(this.component.workflow.cancel, {
      workflowId: t
    });
  }
  /**
   * List the steps in a workflow, including their name, args, return value etc.
   *
   * @param ctx - The Convex context from a query, mutation, or action.
   * @param workflowId - The workflow ID.
   * @param opts - How many steps to fetch and in what order.
   *   e.g. `{ order: "desc", paginationOpts: { cursor: null, numItems: 10 } }`
   *   will get the last 10 steps in descending order.
   *   Defaults to 100 steps in ascending order.
   * @returns The pagination result with per-step data.
   */
  async listSteps(e, t, o) {
    return await e.runQuery(this.component.workflow.listSteps, {
      workflowId: t,
      order: o?.order ?? "asc",
      paginationOpts: o?.paginationOpts ?? {
        cursor: null,
        numItems: 100
      }
    });
  }
  /**
   * Clean up a completed workflow's storage.
   *
   * @param ctx - The Convex context.
   * @param workflowId - The workflow ID.
   * @returns - Whether the workflow's state was cleaned up.
   */
  async cleanup(e, t) {
    return await e.runMutation(this.component.workflow.cleanup, {
      workflowId: t
    });
  }
  /**
   * Send an event to a workflow.
   *
   * @param ctx - From a mutation, action or workflow step.
   * @param args - Either send an event by its ID, or by name and workflow ID.
   *   If you have a validator, you must provide a value.
   *   If you provide an error string, awaiting the event will throw an error.
   */
  async sendEvent(e, t) {
    let o = "error" in t ? {
      kind: "failed",
      error: t.error
    } : {
      kind: "success",
      returnValue: t.validator ? B(t.validator, t.value) : "value" in t ? t.value : null
    };
    return await e.runMutation(this.component.event.send, {
      eventId: t.id,
      result: o,
      name: t.name,
      workflowId: t.workflowId,
      workpoolOptions: this.options?.workpoolOptions
    });
  }
  /**
   * Create an event ahead of time, enabling awaiting a specific event by ID.
   * @param ctx - From an action, mutation or workflow step.
   * @param args - The name of the event and what workflow it belongs to.
   * @returns The event ID, which can be used to send the event or await it.
   */
  async createEvent(e, t) {
    return await e.runMutation(this.component.event.create, {
      name: t.name,
      workflowId: t.workflowId
    });
  }
};

// convex/index.ts
Le();
var ir = new H(pe.workflow);

export {
  ir as a
};
//# sourceMappingURL=S27PWT2U.js.map
