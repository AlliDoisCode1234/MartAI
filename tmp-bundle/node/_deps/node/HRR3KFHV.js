import {
  a as n,
  b as Ct,
  c as Tt,
  d as pr,
  f as Nn
} from "./V7X2J7BI.js";

// node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var Un = pr((Pt, Qn) => {
  (function(d, l) {
    typeof Pt == "object" && typeof Qn < "u" ? l(Pt) : typeof define == "function" && define.amd ? define(["exports"], l) : (d = typeof globalThis < "u" ? globalThis : d || self, l(d.WebStreamsPolyfill = {}));
  })(Pt, (function(d) {
    "use strict";
    function l() {
    }
    n(l, "noop");
    function u(e) {
      return typeof e == "object" && e !== null || typeof e == "function";
    }
    n(u, "typeIsObject");
    let m = l;
    function c(e, t) {
      try {
        Object.defineProperty(e, "name", {
          value: t,
          configurable: !0
        });
      } catch {
      }
    }
    n(c, "setFunctionName");
    let w = Promise, T = Promise.prototype.then, fe = Promise.reject.bind(w);
    function v(e) {
      return new w(e);
    }
    n(v, "newPromise");
    function g(e) {
      return v((t) => t(e));
    }
    n(g, "promiseResolvedWith");
    function h(e) {
      return fe(e);
    }
    n(h, "promiseRejectedWith");
    function B(e, t, r) {
      return T.call(e, t, r);
    }
    n(B, "PerformPromiseThen");
    function E(e, t, r) {
      B(B(e, t, r), void 0, m);
    }
    n(E, "uponPromise");
    function L(e, t) {
      E(e, t);
    }
    n(L, "uponFulfillment");
    function Q(e, t) {
      E(e, void 0, t);
    }
    n(Q, "uponRejection");
    function U(e, t, r) {
      return B(e, t, r);
    }
    n(U, "transformPromiseWith");
    function Ce(e) {
      B(e, void 0, m);
    }
    n(Ce, "setPromiseIsHandledToTrue");
    let de = /* @__PURE__ */ n((e) => {
      if (typeof queueMicrotask == "function")
        de = queueMicrotask;
      else {
        let t = g(void 0);
        de = /* @__PURE__ */ n((r) => B(t, r), "_queueMicrotask");
      }
      return de(e);
    }, "_queueMicrotask");
    function ce(e, t, r) {
      if (typeof e != "function")
        throw new TypeError("Argument is not a function");
      return Function.prototype.apply.call(e, t, r);
    }
    n(ce, "reflectCall");
    function K(e, t, r) {
      try {
        return g(ce(e, t, r));
      } catch (o) {
        return h(o);
      }
    }
    n(K, "promiseCall");
    let wr = 16384;
    class O {
      static {
        n(this, "SimpleQueue");
      }
      constructor() {
        this._cursor = 0, this._size = 0, this._front = {
          _elements: [],
          _next: void 0
        }, this._back = this._front, this._cursor = 0, this._size = 0;
      }
      get length() {
        return this._size;
      }
      // For exception safety, this method is structured in order:
      // 1. Read state
      // 2. Calculate required state mutations
      // 3. Perform state mutations
      push(t) {
        let r = this._back, o = r;
        r._elements.length === wr - 1 && (o = {
          _elements: [],
          _next: void 0
        }), r._elements.push(t), o !== r && (this._back = o, r._next = o), ++this._size;
      }
      // Like push(), shift() follows the read -> calculate -> mutate pattern for
      // exception safety.
      shift() {
        let t = this._front, r = t, o = this._cursor, a = o + 1, i = t._elements, s = i[o];
        return a === wr && (r = t._next, a = 0), --this._size, this._cursor = a, t !== r && (this._front = r), i[o] = void 0, s;
      }
      // The tricky thing about forEach() is that it can be called
      // re-entrantly. The queue may be mutated inside the callback. It is easy to
      // see that push() within the callback has no negative effects since the end
      // of the queue is checked for on every iteration. If shift() is called
      // repeatedly within the callback then the next iteration may return an
      // element that has been removed. In this case the callback will be called
      // with undefined values until we either "catch up" with elements that still
      // exist or reach the back of the queue.
      forEach(t) {
        let r = this._cursor, o = this._front, a = o._elements;
        for (; (r !== a.length || o._next !== void 0) && !(r === a.length && (o = o._next, a = o._elements, r = 0, a.length === 0)); )
          t(a[r]), ++r;
      }
      // Return the element that would be returned if shift() was called now,
      // without modifying the queue.
      peek() {
        let t = this._front, r = this._cursor;
        return t._elements[r];
      }
    }
    let Cr = Symbol("[[AbortSteps]]"), Tr = Symbol("[[ErrorSteps]]"), At = Symbol("[[CancelSteps]]"), Wt = Symbol("[[PullSteps]]"), Bt = Symbol("[[ReleaseSteps]]");
    function Pr(e, t) {
      e._ownerReadableStream = t, t._reader = e, t._state === "readable" ? Ot(e) : t._state === "closed" ? ro(e) : vr(e, t._storedError);
    }
    n(Pr, "ReadableStreamReaderGenericInitialize");
    function kt(e, t) {
      let r = e._ownerReadableStream;
      return D(r, t);
    }
    n(kt, "ReadableStreamReaderGenericCancel");
    function Y(e) {
      let t = e._ownerReadableStream;
      t._state === "readable" ? Ft(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : no(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t._readableStreamController[Bt](), t._reader = void 0, e._ownerReadableStream = void 0;
    }
    n(Y, "ReadableStreamReaderGenericRelease");
    function He(e) {
      return new TypeError("Cannot " + e + " a stream using a released reader");
    }
    n(He, "readerLockException");
    function Ot(e) {
      e._closedPromise = v((t, r) => {
        e._closedPromise_resolve = t, e._closedPromise_reject = r;
      });
    }
    n(Ot, "defaultReaderClosedPromiseInitialize");
    function vr(e, t) {
      Ot(e), Ft(e, t);
    }
    n(vr, "defaultReaderClosedPromiseInitializeAsRejected");
    function ro(e) {
      Ot(e), Er(e);
    }
    n(ro, "defaultReaderClosedPromiseInitializeAsResolved");
    function Ft(e, t) {
      e._closedPromise_reject !== void 0 && (Ce(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
    }
    n(Ft, "defaultReaderClosedPromiseReject");
    function no(e, t) {
      vr(e, t);
    }
    n(no, "defaultReaderClosedPromiseResetToRejected");
    function Er(e) {
      e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
    }
    n(Er, "defaultReaderClosedPromiseResolve");
    let qr = Number.isFinite || function(e) {
      return typeof e == "number" && isFinite(e);
    }, oo = Math.trunc || function(e) {
      return e < 0 ? Math.ceil(e) : Math.floor(e);
    };
    function ao(e) {
      return typeof e == "object" || typeof e == "function";
    }
    n(ao, "isDictionary");
    function $(e, t) {
      if (e !== void 0 && !ao(e))
        throw new TypeError(`${t} is not an object.`);
    }
    n($, "assertDictionary");
    function F(e, t) {
      if (typeof e != "function")
        throw new TypeError(`${t} is not a function.`);
    }
    n(F, "assertFunction");
    function io(e) {
      return typeof e == "object" && e !== null || typeof e == "function";
    }
    n(io, "isObject");
    function Ar(e, t) {
      if (!io(e))
        throw new TypeError(`${t} is not an object.`);
    }
    n(Ar, "assertObject");
    function V(e, t, r) {
      if (e === void 0)
        throw new TypeError(`Parameter ${t} is required in '${r}'.`);
    }
    n(V, "assertRequiredArgument");
    function zt(e, t, r) {
      if (e === void 0)
        throw new TypeError(`${t} is required in '${r}'.`);
    }
    n(zt, "assertRequiredField");
    function It(e) {
      return Number(e);
    }
    n(It, "convertUnrestrictedDouble");
    function Wr(e) {
      return e === 0 ? 0 : e;
    }
    n(Wr, "censorNegativeZero");
    function so(e) {
      return Wr(oo(e));
    }
    n(so, "integerPart");
    function jt(e, t) {
      let o = Number.MAX_SAFE_INTEGER, a = Number(e);
      if (a = Wr(a), !qr(a))
        throw new TypeError(`${t} is not a finite number`);
      if (a = so(a), a < 0 || a > o)
        throw new TypeError(`${t} is outside the accepted range of 0 to ${o}, inclusive`);
      return !qr(a) || a === 0 ? 0 : a;
    }
    n(jt, "convertUnsignedLongLongWithEnforceRange");
    function Dt(e, t) {
      if (!ie(e))
        throw new TypeError(`${t} is not a ReadableStream.`);
    }
    n(Dt, "assertReadableStream");
    function Te(e) {
      return new ee(e);
    }
    n(Te, "AcquireReadableStreamDefaultReader");
    function Br(e, t) {
      e._reader._readRequests.push(t);
    }
    n(Br, "ReadableStreamAddReadRequest");
    function Mt(e, t, r) {
      let a = e._reader._readRequests.shift();
      r ? a._closeSteps() : a._chunkSteps(t);
    }
    n(Mt, "ReadableStreamFulfillReadRequest");
    function Ge(e) {
      return e._reader._readRequests.length;
    }
    n(Ge, "ReadableStreamGetNumReadRequests");
    function kr(e) {
      let t = e._reader;
      return !(t === void 0 || !te(t));
    }
    n(kr, "ReadableStreamHasDefaultReader");
    class ee {
      static {
        n(this, "ReadableStreamDefaultReader");
      }
      constructor(t) {
        if (V(t, 1, "ReadableStreamDefaultReader"), Dt(t, "First parameter"), se(t))
          throw new TypeError("This stream has already been locked for exclusive reading by another reader");
        Pr(this, t), this._readRequests = new O();
      }
      /**
       * Returns a promise that will be fulfilled when the stream becomes closed,
       * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
       */
      get closed() {
        return te(this) ? this._closedPromise : h(xe("closed"));
      }
      /**
       * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
       */
      cancel(t = void 0) {
        return te(this) ? this._ownerReadableStream === void 0 ? h(He("cancel")) : kt(this, t) : h(xe("cancel"));
      }
      /**
       * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
       *
       * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
       */
      read() {
        if (!te(this))
          return h(xe("read"));
        if (this._ownerReadableStream === void 0)
          return h(He("read from"));
        let t, r, o = v((i, s) => {
          t = i, r = s;
        });
        return Ie(this, {
          _chunkSteps: /* @__PURE__ */ n((i) => t({ value: i, done: !1 }), "_chunkSteps"),
          _closeSteps: /* @__PURE__ */ n(() => t({ value: void 0, done: !0 }), "_closeSteps"),
          _errorSteps: /* @__PURE__ */ n((i) => r(i), "_errorSteps")
        }), o;
      }
      /**
       * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
       * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
       * from now on; otherwise, the reader will appear closed.
       *
       * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
       * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
       * do so will throw a `TypeError` and leave the reader locked to the stream.
       */
      releaseLock() {
        if (!te(this))
          throw xe("releaseLock");
        this._ownerReadableStream !== void 0 && lo(this);
      }
    }
    Object.defineProperties(ee.prototype, {
      cancel: { enumerable: !0 },
      read: { enumerable: !0 },
      releaseLock: { enumerable: !0 },
      closed: { enumerable: !0 }
    }), c(ee.prototype.cancel, "cancel"), c(ee.prototype.read, "read"), c(ee.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ee.prototype, Symbol.toStringTag, {
      value: "ReadableStreamDefaultReader",
      configurable: !0
    });
    function te(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readRequests") ? !1 : e instanceof ee;
    }
    n(te, "IsReadableStreamDefaultReader");
    function Ie(e, t) {
      let r = e._ownerReadableStream;
      r._disturbed = !0, r._state === "closed" ? t._closeSteps() : r._state === "errored" ? t._errorSteps(r._storedError) : r._readableStreamController[Wt](t);
    }
    n(Ie, "ReadableStreamDefaultReaderRead");
    function lo(e) {
      Y(e);
      let t = new TypeError("Reader was released");
      Or(e, t);
    }
    n(lo, "ReadableStreamDefaultReaderRelease");
    function Or(e, t) {
      let r = e._readRequests;
      e._readRequests = new O(), r.forEach((o) => {
        o._errorSteps(t);
      });
    }
    n(Or, "ReadableStreamDefaultReaderErrorReadRequests");
    function xe(e) {
      return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`);
    }
    n(xe, "defaultReaderBrandCheckException");
    let uo = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
    }).prototype);
    class Fr {
      static {
        n(this, "ReadableStreamAsyncIteratorImpl");
      }
      constructor(t, r) {
        this._ongoingPromise = void 0, this._isFinished = !1, this._reader = t, this._preventCancel = r;
      }
      next() {
        let t = /* @__PURE__ */ n(() => this._nextSteps(), "nextSteps");
        return this._ongoingPromise = this._ongoingPromise ? U(this._ongoingPromise, t, t) : t(), this._ongoingPromise;
      }
      return(t) {
        let r = /* @__PURE__ */ n(() => this._returnSteps(t), "returnSteps");
        return this._ongoingPromise ? U(this._ongoingPromise, r, r) : r();
      }
      _nextSteps() {
        if (this._isFinished)
          return Promise.resolve({ value: void 0, done: !0 });
        let t = this._reader, r, o, a = v((s, f) => {
          r = s, o = f;
        });
        return Ie(t, {
          _chunkSteps: /* @__PURE__ */ n((s) => {
            this._ongoingPromise = void 0, de(() => r({ value: s, done: !1 }));
          }, "_chunkSteps"),
          _closeSteps: /* @__PURE__ */ n(() => {
            this._ongoingPromise = void 0, this._isFinished = !0, Y(t), r({ value: void 0, done: !0 });
          }, "_closeSteps"),
          _errorSteps: /* @__PURE__ */ n((s) => {
            this._ongoingPromise = void 0, this._isFinished = !0, Y(t), o(s);
          }, "_errorSteps")
        }), a;
      }
      _returnSteps(t) {
        if (this._isFinished)
          return Promise.resolve({ value: t, done: !0 });
        this._isFinished = !0;
        let r = this._reader;
        if (!this._preventCancel) {
          let o = kt(r, t);
          return Y(r), U(o, () => ({ value: t, done: !0 }));
        }
        return Y(r), g({ value: t, done: !0 });
      }
    }
    let zr = {
      next() {
        return Ir(this) ? this._asyncIteratorImpl.next() : h(jr("next"));
      },
      return(e) {
        return Ir(this) ? this._asyncIteratorImpl.return(e) : h(jr("return"));
      }
    };
    Object.setPrototypeOf(zr, uo);
    function fo(e, t) {
      let r = Te(e), o = new Fr(r, t), a = Object.create(zr);
      return a._asyncIteratorImpl = o, a;
    }
    n(fo, "AcquireReadableStreamAsyncIterator");
    function Ir(e) {
      if (!u(e) || !Object.prototype.hasOwnProperty.call(e, "_asyncIteratorImpl"))
        return !1;
      try {
        return e._asyncIteratorImpl instanceof Fr;
      } catch {
        return !1;
      }
    }
    n(Ir, "IsReadableStreamAsyncIterator");
    function jr(e) {
      return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`);
    }
    n(jr, "streamAsyncIteratorBrandCheckException");
    let Dr = Number.isNaN || function(e) {
      return e !== e;
    };
    var Lt, $t, Nt;
    function je(e) {
      return e.slice();
    }
    n(je, "CreateArrayFromList");
    function Mr(e, t, r, o, a) {
      new Uint8Array(e).set(new Uint8Array(r, o, a), t);
    }
    n(Mr, "CopyDataBlockBytes");
    let H = /* @__PURE__ */ n((e) => (typeof e.transfer == "function" ? H = /* @__PURE__ */ n((t) => t.transfer(), "TransferArrayBuffer") : typeof structuredClone == "function" ? H = /* @__PURE__ */ n((t) => structuredClone(t, { transfer: [t] }), "TransferArrayBuffer") : H = /* @__PURE__ */ n((t) => t, "TransferArrayBuffer"), H(e)), "TransferArrayBuffer"), re = /* @__PURE__ */ n((e) => (typeof e.detached == "boolean" ? re = /* @__PURE__ */ n((t) => t.detached, "IsDetachedBuffer") : re = /* @__PURE__ */ n((t) => t.byteLength === 0, "IsDetachedBuffer"), re(e)), "IsDetachedBuffer");
    function Lr(e, t, r) {
      if (e.slice)
        return e.slice(t, r);
      let o = r - t, a = new ArrayBuffer(o);
      return Mr(a, 0, e, t, o), a;
    }
    n(Lr, "ArrayBufferSlice");
    function Ze(e, t) {
      let r = e[t];
      if (r != null) {
        if (typeof r != "function")
          throw new TypeError(`${String(t)} is not a function`);
        return r;
      }
    }
    n(Ze, "GetMethod");
    function co(e) {
      let t = {
        [Symbol.iterator]: () => e.iterator
      }, r = (async function* () {
        return yield* t;
      })(), o = r.next;
      return { iterator: r, nextMethod: o, done: !1 };
    }
    n(co, "CreateAsyncFromSyncIterator");
    let Qt = (Nt = (Lt = Symbol.asyncIterator) !== null && Lt !== void 0 ? Lt : ($t = Symbol.for) === null || $t === void 0 ? void 0 : $t.call(Symbol, "Symbol.asyncIterator")) !== null && Nt !== void 0 ? Nt : "@@asyncIterator";
    function $r(e, t = "sync", r) {
      if (r === void 0)
        if (t === "async") {
          if (r = Ze(e, Qt), r === void 0) {
            let i = Ze(e, Symbol.iterator), s = $r(e, "sync", i);
            return co(s);
          }
        } else
          r = Ze(e, Symbol.iterator);
      if (r === void 0)
        throw new TypeError("The object is not iterable");
      let o = ce(r, e, []);
      if (!u(o))
        throw new TypeError("The iterator method must return an object");
      let a = o.next;
      return { iterator: o, nextMethod: a, done: !1 };
    }
    n($r, "GetIterator");
    function ho(e) {
      let t = ce(e.nextMethod, e.iterator, []);
      if (!u(t))
        throw new TypeError("The iterator.next() method must return an object");
      return t;
    }
    n(ho, "IteratorNext");
    function bo(e) {
      return !!e.done;
    }
    n(bo, "IteratorComplete");
    function mo(e) {
      return e.value;
    }
    n(mo, "IteratorValue");
    function po(e) {
      return !(typeof e != "number" || Dr(e) || e < 0);
    }
    n(po, "IsNonNegativeNumber");
    function Nr(e) {
      let t = Lr(e.buffer, e.byteOffset, e.byteOffset + e.byteLength);
      return new Uint8Array(t);
    }
    n(Nr, "CloneAsUint8Array");
    function Ut(e) {
      let t = e._queue.shift();
      return e._queueTotalSize -= t.size, e._queueTotalSize < 0 && (e._queueTotalSize = 0), t.value;
    }
    n(Ut, "DequeueValue");
    function Yt(e, t, r) {
      if (!po(r) || r === 1 / 0)
        throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
      e._queue.push({ value: t, size: r }), e._queueTotalSize += r;
    }
    n(Yt, "EnqueueValueWithSize");
    function yo(e) {
      return e._queue.peek().value;
    }
    n(yo, "PeekQueueValue");
    function ne(e) {
      e._queue = new O(), e._queueTotalSize = 0;
    }
    n(ne, "ResetQueue");
    function Qr(e) {
      return e === DataView;
    }
    n(Qr, "isDataViewConstructor");
    function _o(e) {
      return Qr(e.constructor);
    }
    n(_o, "isDataView");
    function So(e) {
      return Qr(e) ? 1 : e.BYTES_PER_ELEMENT;
    }
    n(So, "arrayBufferViewElementSize");
    class he {
      static {
        n(this, "ReadableStreamBYOBRequest");
      }
      constructor() {
        throw new TypeError("Illegal constructor");
      }
      /**
       * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
       */
      get view() {
        if (!Vt(this))
          throw Xt("view");
        return this._view;
      }
      respond(t) {
        if (!Vt(this))
          throw Xt("respond");
        if (V(t, 1, "respond"), t = jt(t, "First parameter"), this._associatedReadableByteStreamController === void 0)
          throw new TypeError("This BYOB request has been invalidated");
        if (re(this._view.buffer))
          throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
        et(this._associatedReadableByteStreamController, t);
      }
      respondWithNewView(t) {
        if (!Vt(this))
          throw Xt("respondWithNewView");
        if (V(t, 1, "respondWithNewView"), !ArrayBuffer.isView(t))
          throw new TypeError("You can only respond with array buffer views");
        if (this._associatedReadableByteStreamController === void 0)
          throw new TypeError("This BYOB request has been invalidated");
        if (re(t.buffer))
          throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
        tt(this._associatedReadableByteStreamController, t);
      }
    }
    Object.defineProperties(he.prototype, {
      respond: { enumerable: !0 },
      respondWithNewView: { enumerable: !0 },
      view: { enumerable: !0 }
    }), c(he.prototype.respond, "respond"), c(he.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(he.prototype, Symbol.toStringTag, {
      value: "ReadableStreamBYOBRequest",
      configurable: !0
    });
    class G {
      static {
        n(this, "ReadableByteStreamController");
      }
      constructor() {
        throw new TypeError("Illegal constructor");
      }
      /**
       * Returns the current BYOB pull request, or `null` if there isn't one.
       */
      get byobRequest() {
        if (!be(this))
          throw Me("byobRequest");
        return Zt(this);
      }
      /**
       * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
       * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
       */
      get desiredSize() {
        if (!be(this))
          throw Me("desiredSize");
        return Kr(this);
      }
      /**
       * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
       * the stream, but once those are read, the stream will become closed.
       */
      close() {
        if (!be(this))
          throw Me("close");
        if (this._closeRequested)
          throw new TypeError("The stream has already been closed; do not close it again!");
        let t = this._controlledReadableByteStream._state;
        if (t !== "readable")
          throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be closed`);
        De(this);
      }
      enqueue(t) {
        if (!be(this))
          throw Me("enqueue");
        if (V(t, 1, "enqueue"), !ArrayBuffer.isView(t))
          throw new TypeError("chunk must be an array buffer view");
        if (t.byteLength === 0)
          throw new TypeError("chunk must have non-zero byteLength");
        if (t.buffer.byteLength === 0)
          throw new TypeError("chunk's buffer must have non-zero byteLength");
        if (this._closeRequested)
          throw new TypeError("stream is closed or draining");
        let r = this._controlledReadableByteStream._state;
        if (r !== "readable")
          throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);
        Ke(this, t);
      }
      /**
       * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
       */
      error(t = void 0) {
        if (!be(this))
          throw Me("error");
        z(this, t);
      }
      /** @internal */
      [At](t) {
        Ur(this), ne(this);
        let r = this._cancelAlgorithm(t);
        return Je(this), r;
      }
      /** @internal */
      [Wt](t) {
        let r = this._controlledReadableByteStream;
        if (this._queueTotalSize > 0) {
          Jr(this, t);
          return;
        }
        let o = this._autoAllocateChunkSize;
        if (o !== void 0) {
          let a;
          try {
            a = new ArrayBuffer(o);
          } catch (s) {
            t._errorSteps(s);
            return;
          }
          let i = {
            buffer: a,
            bufferByteLength: o,
            byteOffset: 0,
            byteLength: o,
            bytesFilled: 0,
            minimumFill: 1,
            elementSize: 1,
            viewConstructor: Uint8Array,
            readerType: "default"
          };
          this._pendingPullIntos.push(i);
        }
        Br(r, t), me(this);
      }
      /** @internal */
      [Bt]() {
        if (this._pendingPullIntos.length > 0) {
          let t = this._pendingPullIntos.peek();
          t.readerType = "none", this._pendingPullIntos = new O(), this._pendingPullIntos.push(t);
        }
      }
    }
    Object.defineProperties(G.prototype, {
      close: { enumerable: !0 },
      enqueue: { enumerable: !0 },
      error: { enumerable: !0 },
      byobRequest: { enumerable: !0 },
      desiredSize: { enumerable: !0 }
    }), c(G.prototype.close, "close"), c(G.prototype.enqueue, "enqueue"), c(G.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(G.prototype, Symbol.toStringTag, {
      value: "ReadableByteStreamController",
      configurable: !0
    });
    function be(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableByteStream") ? !1 : e instanceof G;
    }
    n(be, "IsReadableByteStreamController");
    function Vt(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_associatedReadableByteStreamController") ? !1 : e instanceof he;
    }
    n(Vt, "IsReadableStreamBYOBRequest");
    function me(e) {
      if (!To(e))
        return;
      if (e._pulling) {
        e._pullAgain = !0;
        return;
      }
      e._pulling = !0;
      let r = e._pullAlgorithm();
      E(r, () => (e._pulling = !1, e._pullAgain && (e._pullAgain = !1, me(e)), null), (o) => (z(e, o), null));
    }
    n(me, "ReadableByteStreamControllerCallPullIfNeeded");
    function Ur(e) {
      Gt(e), e._pendingPullIntos = new O();
    }
    n(Ur, "ReadableByteStreamControllerClearPendingPullIntos");
    function Ht(e, t) {
      let r = !1;
      e._state === "closed" && (r = !0);
      let o = Yr(t);
      t.readerType === "default" ? Mt(e, o, r) : Wo(e, o, r);
    }
    n(Ht, "ReadableByteStreamControllerCommitPullIntoDescriptor");
    function Yr(e) {
      let t = e.bytesFilled, r = e.elementSize;
      return new e.viewConstructor(e.buffer, e.byteOffset, t / r);
    }
    n(Yr, "ReadableByteStreamControllerConvertPullIntoDescriptor");
    function Xe(e, t, r, o) {
      e._queue.push({ buffer: t, byteOffset: r, byteLength: o }), e._queueTotalSize += o;
    }
    n(Xe, "ReadableByteStreamControllerEnqueueChunkToQueue");
    function Vr(e, t, r, o) {
      let a;
      try {
        a = Lr(t, r, r + o);
      } catch (i) {
        throw z(e, i), i;
      }
      Xe(e, a, 0, o);
    }
    n(Vr, "ReadableByteStreamControllerEnqueueClonedChunkToQueue");
    function Hr(e, t) {
      t.bytesFilled > 0 && Vr(e, t.buffer, t.byteOffset, t.bytesFilled), Pe(e);
    }
    n(Hr, "ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");
    function Gr(e, t) {
      let r = Math.min(e._queueTotalSize, t.byteLength - t.bytesFilled), o = t.bytesFilled + r, a = r, i = !1, s = o % t.elementSize, f = o - s;
      f >= t.minimumFill && (a = f - t.bytesFilled, i = !0);
      let y = e._queue;
      for (; a > 0; ) {
        let b = y.peek(), _ = Math.min(a, b.byteLength), S = t.byteOffset + t.bytesFilled;
        Mr(t.buffer, S, b.buffer, b.byteOffset, _), b.byteLength === _ ? y.shift() : (b.byteOffset += _, b.byteLength -= _), e._queueTotalSize -= _, xr(e, _, t), a -= _;
      }
      return i;
    }
    n(Gr, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
    function xr(e, t, r) {
      r.bytesFilled += t;
    }
    n(xr, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
    function Zr(e) {
      e._queueTotalSize === 0 && e._closeRequested ? (Je(e), Ye(e._controlledReadableByteStream)) : me(e);
    }
    n(Zr, "ReadableByteStreamControllerHandleQueueDrain");
    function Gt(e) {
      e._byobRequest !== null && (e._byobRequest._associatedReadableByteStreamController = void 0, e._byobRequest._view = null, e._byobRequest = null);
    }
    n(Gt, "ReadableByteStreamControllerInvalidateBYOBRequest");
    function xt(e) {
      for (; e._pendingPullIntos.length > 0; ) {
        if (e._queueTotalSize === 0)
          return;
        let t = e._pendingPullIntos.peek();
        Gr(e, t) && (Pe(e), Ht(e._controlledReadableByteStream, t));
      }
    }
    n(xt, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
    function go(e) {
      let t = e._controlledReadableByteStream._reader;
      for (; t._readRequests.length > 0; ) {
        if (e._queueTotalSize === 0)
          return;
        let r = t._readRequests.shift();
        Jr(e, r);
      }
    }
    n(go, "ReadableByteStreamControllerProcessReadRequestsUsingQueue");
    function Ro(e, t, r, o) {
      let a = e._controlledReadableByteStream, i = t.constructor, s = So(i), { byteOffset: f, byteLength: y } = t, b = r * s, _;
      try {
        _ = H(t.buffer);
      } catch (C) {
        o._errorSteps(C);
        return;
      }
      let S = {
        buffer: _,
        bufferByteLength: _.byteLength,
        byteOffset: f,
        byteLength: y,
        bytesFilled: 0,
        minimumFill: b,
        elementSize: s,
        viewConstructor: i,
        readerType: "byob"
      };
      if (e._pendingPullIntos.length > 0) {
        e._pendingPullIntos.push(S), rn(a, o);
        return;
      }
      if (a._state === "closed") {
        let C = new i(S.buffer, S.byteOffset, 0);
        o._closeSteps(C);
        return;
      }
      if (e._queueTotalSize > 0) {
        if (Gr(e, S)) {
          let C = Yr(S);
          Zr(e), o._chunkSteps(C);
          return;
        }
        if (e._closeRequested) {
          let C = new TypeError("Insufficient bytes to fill elements in the given buffer");
          z(e, C), o._errorSteps(C);
          return;
        }
      }
      e._pendingPullIntos.push(S), rn(a, o), me(e);
    }
    n(Ro, "ReadableByteStreamControllerPullInto");
    function wo(e, t) {
      t.readerType === "none" && Pe(e);
      let r = e._controlledReadableByteStream;
      if (Jt(r))
        for (; nn(r) > 0; ) {
          let o = Pe(e);
          Ht(r, o);
        }
    }
    n(wo, "ReadableByteStreamControllerRespondInClosedState");
    function Co(e, t, r) {
      if (xr(e, t, r), r.readerType === "none") {
        Hr(e, r), xt(e);
        return;
      }
      if (r.bytesFilled < r.minimumFill)
        return;
      Pe(e);
      let o = r.bytesFilled % r.elementSize;
      if (o > 0) {
        let a = r.byteOffset + r.bytesFilled;
        Vr(e, r.buffer, a - o, o);
      }
      r.bytesFilled -= o, Ht(e._controlledReadableByteStream, r), xt(e);
    }
    n(Co, "ReadableByteStreamControllerRespondInReadableState");
    function Xr(e, t) {
      let r = e._pendingPullIntos.peek();
      Gt(e), e._controlledReadableByteStream._state === "closed" ? wo(e, r) : Co(e, t, r), me(e);
    }
    n(Xr, "ReadableByteStreamControllerRespondInternal");
    function Pe(e) {
      return e._pendingPullIntos.shift();
    }
    n(Pe, "ReadableByteStreamControllerShiftPendingPullInto");
    function To(e) {
      let t = e._controlledReadableByteStream;
      return t._state !== "readable" || e._closeRequested || !e._started ? !1 : !!(kr(t) && Ge(t) > 0 || Jt(t) && nn(t) > 0 || Kr(e) > 0);
    }
    n(To, "ReadableByteStreamControllerShouldCallPull");
    function Je(e) {
      e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0;
    }
    n(Je, "ReadableByteStreamControllerClearAlgorithms");
    function De(e) {
      let t = e._controlledReadableByteStream;
      if (!(e._closeRequested || t._state !== "readable")) {
        if (e._queueTotalSize > 0) {
          e._closeRequested = !0;
          return;
        }
        if (e._pendingPullIntos.length > 0) {
          let r = e._pendingPullIntos.peek();
          if (r.bytesFilled % r.elementSize !== 0) {
            let o = new TypeError("Insufficient bytes to fill elements in the given buffer");
            throw z(e, o), o;
          }
        }
        Je(e), Ye(t);
      }
    }
    n(De, "ReadableByteStreamControllerClose");
    function Ke(e, t) {
      let r = e._controlledReadableByteStream;
      if (e._closeRequested || r._state !== "readable")
        return;
      let { buffer: o, byteOffset: a, byteLength: i } = t;
      if (re(o))
        throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
      let s = H(o);
      if (e._pendingPullIntos.length > 0) {
        let f = e._pendingPullIntos.peek();
        if (re(f.buffer))
          throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
        Gt(e), f.buffer = H(f.buffer), f.readerType === "none" && Hr(e, f);
      }
      if (kr(r))
        if (go(e), Ge(r) === 0)
          Xe(e, s, a, i);
        else {
          e._pendingPullIntos.length > 0 && Pe(e);
          let f = new Uint8Array(s, a, i);
          Mt(r, f, !1);
        }
      else Jt(r) ? (Xe(e, s, a, i), xt(e)) : Xe(e, s, a, i);
      me(e);
    }
    n(Ke, "ReadableByteStreamControllerEnqueue");
    function z(e, t) {
      let r = e._controlledReadableByteStream;
      r._state === "readable" && (Ur(e), ne(e), Je(e), qn(r, t));
    }
    n(z, "ReadableByteStreamControllerError");
    function Jr(e, t) {
      let r = e._queue.shift();
      e._queueTotalSize -= r.byteLength, Zr(e);
      let o = new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
      t._chunkSteps(o);
    }
    n(Jr, "ReadableByteStreamControllerFillReadRequestFromQueue");
    function Zt(e) {
      if (e._byobRequest === null && e._pendingPullIntos.length > 0) {
        let t = e._pendingPullIntos.peek(), r = new Uint8Array(t.buffer, t.byteOffset + t.bytesFilled, t.byteLength - t.bytesFilled), o = Object.create(he.prototype);
        vo(o, e, r), e._byobRequest = o;
      }
      return e._byobRequest;
    }
    n(Zt, "ReadableByteStreamControllerGetBYOBRequest");
    function Kr(e) {
      let t = e._controlledReadableByteStream._state;
      return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
    }
    n(Kr, "ReadableByteStreamControllerGetDesiredSize");
    function et(e, t) {
      let r = e._pendingPullIntos.peek();
      if (e._controlledReadableByteStream._state === "closed") {
        if (t !== 0)
          throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
      } else {
        if (t === 0)
          throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
        if (r.bytesFilled + t > r.byteLength)
          throw new RangeError("bytesWritten out of range");
      }
      r.buffer = H(r.buffer), Xr(e, t);
    }
    n(et, "ReadableByteStreamControllerRespond");
    function tt(e, t) {
      let r = e._pendingPullIntos.peek();
      if (e._controlledReadableByteStream._state === "closed") {
        if (t.byteLength !== 0)
          throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
      } else if (t.byteLength === 0)
        throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
      if (r.byteOffset + r.bytesFilled !== t.byteOffset)
        throw new RangeError("The region specified by view does not match byobRequest");
      if (r.bufferByteLength !== t.buffer.byteLength)
        throw new RangeError("The buffer of view has different capacity than byobRequest");
      if (r.bytesFilled + t.byteLength > r.byteLength)
        throw new RangeError("The region specified by view is larger than byobRequest");
      let a = t.byteLength;
      r.buffer = H(t.buffer), Xr(e, a);
    }
    n(tt, "ReadableByteStreamControllerRespondWithNewView");
    function en(e, t, r, o, a, i, s) {
      t._controlledReadableByteStream = e, t._pullAgain = !1, t._pulling = !1, t._byobRequest = null, t._queue = t._queueTotalSize = void 0, ne(t), t._closeRequested = !1, t._started = !1, t._strategyHWM = i, t._pullAlgorithm = o, t._cancelAlgorithm = a, t._autoAllocateChunkSize = s, t._pendingPullIntos = new O(), e._readableStreamController = t;
      let f = r();
      E(g(f), () => (t._started = !0, me(t), null), (y) => (z(t, y), null));
    }
    n(en, "SetUpReadableByteStreamController");
    function Po(e, t, r) {
      let o = Object.create(G.prototype), a, i, s;
      t.start !== void 0 ? a = /* @__PURE__ */ n(() => t.start(o), "startAlgorithm") : a = /* @__PURE__ */ n(() => {
      }, "startAlgorithm"), t.pull !== void 0 ? i = /* @__PURE__ */ n(() => t.pull(o), "pullAlgorithm") : i = /* @__PURE__ */ n(() => g(void 0), "pullAlgorithm"), t.cancel !== void 0 ? s = /* @__PURE__ */ n((y) => t.cancel(y), "cancelAlgorithm") : s = /* @__PURE__ */ n(() => g(void 0), "cancelAlgorithm");
      let f = t.autoAllocateChunkSize;
      if (f === 0)
        throw new TypeError("autoAllocateChunkSize must be greater than 0");
      en(e, o, a, i, s, r, f);
    }
    n(Po, "SetUpReadableByteStreamControllerFromUnderlyingSource");
    function vo(e, t, r) {
      e._associatedReadableByteStreamController = t, e._view = r;
    }
    n(vo, "SetUpReadableStreamBYOBRequest");
    function Xt(e) {
      return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`);
    }
    n(Xt, "byobRequestBrandCheckException");
    function Me(e) {
      return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`);
    }
    n(Me, "byteStreamControllerBrandCheckException");
    function Eo(e, t) {
      $(e, t);
      let r = e?.mode;
      return {
        mode: r === void 0 ? void 0 : qo(r, `${t} has member 'mode' that`)
      };
    }
    n(Eo, "convertReaderOptions");
    function qo(e, t) {
      if (e = `${e}`, e !== "byob")
        throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);
      return e;
    }
    n(qo, "convertReadableStreamReaderMode");
    function Ao(e, t) {
      var r;
      $(e, t);
      let o = (r = e?.min) !== null && r !== void 0 ? r : 1;
      return {
        min: jt(o, `${t} has member 'min' that`)
      };
    }
    n(Ao, "convertByobReadOptions");
    function tn(e) {
      return new oe(e);
    }
    n(tn, "AcquireReadableStreamBYOBReader");
    function rn(e, t) {
      e._reader._readIntoRequests.push(t);
    }
    n(rn, "ReadableStreamAddReadIntoRequest");
    function Wo(e, t, r) {
      let a = e._reader._readIntoRequests.shift();
      r ? a._closeSteps(t) : a._chunkSteps(t);
    }
    n(Wo, "ReadableStreamFulfillReadIntoRequest");
    function nn(e) {
      return e._reader._readIntoRequests.length;
    }
    n(nn, "ReadableStreamGetNumReadIntoRequests");
    function Jt(e) {
      let t = e._reader;
      return !(t === void 0 || !pe(t));
    }
    n(Jt, "ReadableStreamHasBYOBReader");
    class oe {
      static {
        n(this, "ReadableStreamBYOBReader");
      }
      constructor(t) {
        if (V(t, 1, "ReadableStreamBYOBReader"), Dt(t, "First parameter"), se(t))
          throw new TypeError("This stream has already been locked for exclusive reading by another reader");
        if (!be(t._readableStreamController))
          throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
        Pr(this, t), this._readIntoRequests = new O();
      }
      /**
       * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
       * the reader's lock is released before the stream finishes closing.
       */
      get closed() {
        return pe(this) ? this._closedPromise : h(rt("closed"));
      }
      /**
       * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
       */
      cancel(t = void 0) {
        return pe(this) ? this._ownerReadableStream === void 0 ? h(He("cancel")) : kt(this, t) : h(rt("cancel"));
      }
      read(t, r = {}) {
        if (!pe(this))
          return h(rt("read"));
        if (!ArrayBuffer.isView(t))
          return h(new TypeError("view must be an array buffer view"));
        if (t.byteLength === 0)
          return h(new TypeError("view must have non-zero byteLength"));
        if (t.buffer.byteLength === 0)
          return h(new TypeError("view's buffer must have non-zero byteLength"));
        if (re(t.buffer))
          return h(new TypeError("view's buffer has been detached"));
        let o;
        try {
          o = Ao(r, "options");
        } catch (b) {
          return h(b);
        }
        let a = o.min;
        if (a === 0)
          return h(new TypeError("options.min must be greater than 0"));
        if (_o(t)) {
          if (a > t.byteLength)
            return h(new RangeError("options.min must be less than or equal to view's byteLength"));
        } else if (a > t.length)
          return h(new RangeError("options.min must be less than or equal to view's length"));
        if (this._ownerReadableStream === void 0)
          return h(He("read from"));
        let i, s, f = v((b, _) => {
          i = b, s = _;
        });
        return on(this, t, a, {
          _chunkSteps: /* @__PURE__ */ n((b) => i({ value: b, done: !1 }), "_chunkSteps"),
          _closeSteps: /* @__PURE__ */ n((b) => i({ value: b, done: !0 }), "_closeSteps"),
          _errorSteps: /* @__PURE__ */ n((b) => s(b), "_errorSteps")
        }), f;
      }
      /**
       * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
       * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
       * from now on; otherwise, the reader will appear closed.
       *
       * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
       * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
       * do so will throw a `TypeError` and leave the reader locked to the stream.
       */
      releaseLock() {
        if (!pe(this))
          throw rt("releaseLock");
        this._ownerReadableStream !== void 0 && Bo(this);
      }
    }
    Object.defineProperties(oe.prototype, {
      cancel: { enumerable: !0 },
      read: { enumerable: !0 },
      releaseLock: { enumerable: !0 },
      closed: { enumerable: !0 }
    }), c(oe.prototype.cancel, "cancel"), c(oe.prototype.read, "read"), c(oe.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(oe.prototype, Symbol.toStringTag, {
      value: "ReadableStreamBYOBReader",
      configurable: !0
    });
    function pe(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readIntoRequests") ? !1 : e instanceof oe;
    }
    n(pe, "IsReadableStreamBYOBReader");
    function on(e, t, r, o) {
      let a = e._ownerReadableStream;
      a._disturbed = !0, a._state === "errored" ? o._errorSteps(a._storedError) : Ro(a._readableStreamController, t, r, o);
    }
    n(on, "ReadableStreamBYOBReaderRead");
    function Bo(e) {
      Y(e);
      let t = new TypeError("Reader was released");
      an(e, t);
    }
    n(Bo, "ReadableStreamBYOBReaderRelease");
    function an(e, t) {
      let r = e._readIntoRequests;
      e._readIntoRequests = new O(), r.forEach((o) => {
        o._errorSteps(t);
      });
    }
    n(an, "ReadableStreamBYOBReaderErrorReadIntoRequests");
    function rt(e) {
      return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`);
    }
    n(rt, "byobReaderBrandCheckException");
    function Le(e, t) {
      let { highWaterMark: r } = e;
      if (r === void 0)
        return t;
      if (Dr(r) || r < 0)
        throw new RangeError("Invalid highWaterMark");
      return r;
    }
    n(Le, "ExtractHighWaterMark");
    function nt(e) {
      let { size: t } = e;
      return t || (() => 1);
    }
    n(nt, "ExtractSizeAlgorithm");
    function ot(e, t) {
      $(e, t);
      let r = e?.highWaterMark, o = e?.size;
      return {
        highWaterMark: r === void 0 ? void 0 : It(r),
        size: o === void 0 ? void 0 : ko(o, `${t} has member 'size' that`)
      };
    }
    n(ot, "convertQueuingStrategy");
    function ko(e, t) {
      return F(e, t), (r) => It(e(r));
    }
    n(ko, "convertQueuingStrategySize");
    function Oo(e, t) {
      $(e, t);
      let r = e?.abort, o = e?.close, a = e?.start, i = e?.type, s = e?.write;
      return {
        abort: r === void 0 ? void 0 : Fo(r, e, `${t} has member 'abort' that`),
        close: o === void 0 ? void 0 : zo(o, e, `${t} has member 'close' that`),
        start: a === void 0 ? void 0 : Io(a, e, `${t} has member 'start' that`),
        write: s === void 0 ? void 0 : jo(s, e, `${t} has member 'write' that`),
        type: i
      };
    }
    n(Oo, "convertUnderlyingSink");
    function Fo(e, t, r) {
      return F(e, r), (o) => K(e, t, [o]);
    }
    n(Fo, "convertUnderlyingSinkAbortCallback");
    function zo(e, t, r) {
      return F(e, r), () => K(e, t, []);
    }
    n(zo, "convertUnderlyingSinkCloseCallback");
    function Io(e, t, r) {
      return F(e, r), (o) => ce(e, t, [o]);
    }
    n(Io, "convertUnderlyingSinkStartCallback");
    function jo(e, t, r) {
      return F(e, r), (o, a) => K(e, t, [o, a]);
    }
    n(jo, "convertUnderlyingSinkWriteCallback");
    function sn(e, t) {
      if (!ve(e))
        throw new TypeError(`${t} is not a WritableStream.`);
    }
    n(sn, "assertWritableStream");
    function Do(e) {
      if (typeof e != "object" || e === null)
        return !1;
      try {
        return typeof e.aborted == "boolean";
      } catch {
        return !1;
      }
    }
    n(Do, "isAbortSignal");
    let Mo = typeof AbortController == "function";
    function Lo() {
      if (Mo)
        return new AbortController();
    }
    n(Lo, "createAbortController");
    class ae {
      static {
        n(this, "WritableStream");
      }
      constructor(t = {}, r = {}) {
        t === void 0 ? t = null : Ar(t, "First parameter");
        let o = ot(r, "Second parameter"), a = Oo(t, "First parameter");
        if (un(this), a.type !== void 0)
          throw new RangeError("Invalid type is specified");
        let s = nt(o), f = Le(o, 1);
        ea(this, a, f, s);
      }
      /**
       * Returns whether or not the writable stream is locked to a writer.
       */
      get locked() {
        if (!ve(this))
          throw ut("locked");
        return Ee(this);
      }
      /**
       * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
       * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
       * mechanism of the underlying sink.
       *
       * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
       * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
       * the stream) if the stream is currently locked.
       */
      abort(t = void 0) {
        return ve(this) ? Ee(this) ? h(new TypeError("Cannot abort a stream that already has a writer")) : at(this, t) : h(ut("abort"));
      }
      /**
       * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
       * close behavior. During this time any further attempts to write will fail (without erroring the stream).
       *
       * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
       * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
       * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
       */
      close() {
        return ve(this) ? Ee(this) ? h(new TypeError("Cannot close a stream that already has a writer")) : N(this) ? h(new TypeError("Cannot close an already-closing stream")) : fn(this) : h(ut("close"));
      }
      /**
       * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
       * is locked, no other writer can be acquired until this one is released.
       *
       * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
       * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
       * the same time, which would cause the resulting written data to be unpredictable and probably useless.
       */
      getWriter() {
        if (!ve(this))
          throw ut("getWriter");
        return ln(this);
      }
    }
    Object.defineProperties(ae.prototype, {
      abort: { enumerable: !0 },
      close: { enumerable: !0 },
      getWriter: { enumerable: !0 },
      locked: { enumerable: !0 }
    }), c(ae.prototype.abort, "abort"), c(ae.prototype.close, "close"), c(ae.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ae.prototype, Symbol.toStringTag, {
      value: "WritableStream",
      configurable: !0
    });
    function ln(e) {
      return new x(e);
    }
    n(ln, "AcquireWritableStreamDefaultWriter");
    function $o(e, t, r, o, a = 1, i = () => 1) {
      let s = Object.create(ae.prototype);
      un(s);
      let f = Object.create(qe.prototype);
      return pn(s, f, e, t, r, o, a, i), s;
    }
    n($o, "CreateWritableStream");
    function un(e) {
      e._state = "writable", e._storedError = void 0, e._writer = void 0, e._writableStreamController = void 0, e._writeRequests = new O(), e._inFlightWriteRequest = void 0, e._closeRequest = void 0, e._inFlightCloseRequest = void 0, e._pendingAbortRequest = void 0, e._backpressure = !1;
    }
    n(un, "InitializeWritableStream");
    function ve(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_writableStreamController") ? !1 : e instanceof ae;
    }
    n(ve, "IsWritableStream");
    function Ee(e) {
      return e._writer !== void 0;
    }
    n(Ee, "IsWritableStreamLocked");
    function at(e, t) {
      var r;
      if (e._state === "closed" || e._state === "errored")
        return g(void 0);
      e._writableStreamController._abortReason = t, (r = e._writableStreamController._abortController) === null || r === void 0 || r.abort(t);
      let o = e._state;
      if (o === "closed" || o === "errored")
        return g(void 0);
      if (e._pendingAbortRequest !== void 0)
        return e._pendingAbortRequest._promise;
      let a = !1;
      o === "erroring" && (a = !0, t = void 0);
      let i = v((s, f) => {
        e._pendingAbortRequest = {
          _promise: void 0,
          _resolve: s,
          _reject: f,
          _reason: t,
          _wasAlreadyErroring: a
        };
      });
      return e._pendingAbortRequest._promise = i, a || er(e, t), i;
    }
    n(at, "WritableStreamAbort");
    function fn(e) {
      let t = e._state;
      if (t === "closed" || t === "errored")
        return h(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));
      let r = v((a, i) => {
        let s = {
          _resolve: a,
          _reject: i
        };
        e._closeRequest = s;
      }), o = e._writer;
      return o !== void 0 && e._backpressure && t === "writable" && lr(o), ta(e._writableStreamController), r;
    }
    n(fn, "WritableStreamClose");
    function No(e) {
      return v((r, o) => {
        let a = {
          _resolve: r,
          _reject: o
        };
        e._writeRequests.push(a);
      });
    }
    n(No, "WritableStreamAddWriteRequest");
    function Kt(e, t) {
      if (e._state === "writable") {
        er(e, t);
        return;
      }
      tr(e);
    }
    n(Kt, "WritableStreamDealWithRejection");
    function er(e, t) {
      let r = e._writableStreamController;
      e._state = "erroring", e._storedError = t;
      let o = e._writer;
      o !== void 0 && cn(o, t), !Ho(e) && r._started && tr(e);
    }
    n(er, "WritableStreamStartErroring");
    function tr(e) {
      e._state = "errored", e._writableStreamController[Tr]();
      let t = e._storedError;
      if (e._writeRequests.forEach((a) => {
        a._reject(t);
      }), e._writeRequests = new O(), e._pendingAbortRequest === void 0) {
        it(e);
        return;
      }
      let r = e._pendingAbortRequest;
      if (e._pendingAbortRequest = void 0, r._wasAlreadyErroring) {
        r._reject(t), it(e);
        return;
      }
      let o = e._writableStreamController[Cr](r._reason);
      E(o, () => (r._resolve(), it(e), null), (a) => (r._reject(a), it(e), null));
    }
    n(tr, "WritableStreamFinishErroring");
    function Qo(e) {
      e._inFlightWriteRequest._resolve(void 0), e._inFlightWriteRequest = void 0;
    }
    n(Qo, "WritableStreamFinishInFlightWrite");
    function Uo(e, t) {
      e._inFlightWriteRequest._reject(t), e._inFlightWriteRequest = void 0, Kt(e, t);
    }
    n(Uo, "WritableStreamFinishInFlightWriteWithError");
    function Yo(e) {
      e._inFlightCloseRequest._resolve(void 0), e._inFlightCloseRequest = void 0, e._state === "erroring" && (e._storedError = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._resolve(), e._pendingAbortRequest = void 0)), e._state = "closed";
      let r = e._writer;
      r !== void 0 && gn(r);
    }
    n(Yo, "WritableStreamFinishInFlightClose");
    function Vo(e, t) {
      e._inFlightCloseRequest._reject(t), e._inFlightCloseRequest = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._reject(t), e._pendingAbortRequest = void 0), Kt(e, t);
    }
    n(Vo, "WritableStreamFinishInFlightCloseWithError");
    function N(e) {
      return !(e._closeRequest === void 0 && e._inFlightCloseRequest === void 0);
    }
    n(N, "WritableStreamCloseQueuedOrInFlight");
    function Ho(e) {
      return !(e._inFlightWriteRequest === void 0 && e._inFlightCloseRequest === void 0);
    }
    n(Ho, "WritableStreamHasOperationMarkedInFlight");
    function Go(e) {
      e._inFlightCloseRequest = e._closeRequest, e._closeRequest = void 0;
    }
    n(Go, "WritableStreamMarkCloseRequestInFlight");
    function xo(e) {
      e._inFlightWriteRequest = e._writeRequests.shift();
    }
    n(xo, "WritableStreamMarkFirstWriteRequestInFlight");
    function it(e) {
      e._closeRequest !== void 0 && (e._closeRequest._reject(e._storedError), e._closeRequest = void 0);
      let t = e._writer;
      t !== void 0 && ir(t, e._storedError);
    }
    n(it, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
    function rr(e, t) {
      let r = e._writer;
      r !== void 0 && t !== e._backpressure && (t ? la(r) : lr(r)), e._backpressure = t;
    }
    n(rr, "WritableStreamUpdateBackpressure");
    class x {
      static {
        n(this, "WritableStreamDefaultWriter");
      }
      constructor(t) {
        if (V(t, 1, "WritableStreamDefaultWriter"), sn(t, "First parameter"), Ee(t))
          throw new TypeError("This stream has already been locked for exclusive writing by another writer");
        this._ownerWritableStream = t, t._writer = this;
        let r = t._state;
        if (r === "writable")
          !N(t) && t._backpressure ? dt(this) : Rn(this), ft(this);
        else if (r === "erroring")
          sr(this, t._storedError), ft(this);
        else if (r === "closed")
          Rn(this), ia(this);
        else {
          let o = t._storedError;
          sr(this, o), Sn(this, o);
        }
      }
      /**
       * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
       * the writer’s lock is released before the stream finishes closing.
       */
      get closed() {
        return ye(this) ? this._closedPromise : h(_e("closed"));
      }
      /**
       * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
       * A producer can use this information to determine the right amount of data to write.
       *
       * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
       * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
       * the writer’s lock is released.
       */
      get desiredSize() {
        if (!ye(this))
          throw _e("desiredSize");
        if (this._ownerWritableStream === void 0)
          throw Ne("desiredSize");
        return Ko(this);
      }
      /**
       * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
       * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
       * back to zero or below, the getter will return a new promise that stays pending until the next transition.
       *
       * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
       * rejected.
       */
      get ready() {
        return ye(this) ? this._readyPromise : h(_e("ready"));
      }
      /**
       * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
       */
      abort(t = void 0) {
        return ye(this) ? this._ownerWritableStream === void 0 ? h(Ne("abort")) : Zo(this, t) : h(_e("abort"));
      }
      /**
       * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
       */
      close() {
        if (!ye(this))
          return h(_e("close"));
        let t = this._ownerWritableStream;
        return t === void 0 ? h(Ne("close")) : N(t) ? h(new TypeError("Cannot close an already-closing stream")) : dn(this);
      }
      /**
       * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
       * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
       * now on; otherwise, the writer will appear closed.
       *
       * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
       * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
       * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
       * other producers from writing in an interleaved manner.
       */
      releaseLock() {
        if (!ye(this))
          throw _e("releaseLock");
        this._ownerWritableStream !== void 0 && hn(this);
      }
      write(t = void 0) {
        return ye(this) ? this._ownerWritableStream === void 0 ? h(Ne("write to")) : bn(this, t) : h(_e("write"));
      }
    }
    Object.defineProperties(x.prototype, {
      abort: { enumerable: !0 },
      close: { enumerable: !0 },
      releaseLock: { enumerable: !0 },
      write: { enumerable: !0 },
      closed: { enumerable: !0 },
      desiredSize: { enumerable: !0 },
      ready: { enumerable: !0 }
    }), c(x.prototype.abort, "abort"), c(x.prototype.close, "close"), c(x.prototype.releaseLock, "releaseLock"), c(x.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(x.prototype, Symbol.toStringTag, {
      value: "WritableStreamDefaultWriter",
      configurable: !0
    });
    function ye(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_ownerWritableStream") ? !1 : e instanceof x;
    }
    n(ye, "IsWritableStreamDefaultWriter");
    function Zo(e, t) {
      let r = e._ownerWritableStream;
      return at(r, t);
    }
    n(Zo, "WritableStreamDefaultWriterAbort");
    function dn(e) {
      let t = e._ownerWritableStream;
      return fn(t);
    }
    n(dn, "WritableStreamDefaultWriterClose");
    function Xo(e) {
      let t = e._ownerWritableStream, r = t._state;
      return N(t) || r === "closed" ? g(void 0) : r === "errored" ? h(t._storedError) : dn(e);
    }
    n(Xo, "WritableStreamDefaultWriterCloseWithErrorPropagation");
    function Jo(e, t) {
      e._closedPromiseState === "pending" ? ir(e, t) : sa(e, t);
    }
    n(Jo, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
    function cn(e, t) {
      e._readyPromiseState === "pending" ? wn(e, t) : ua(e, t);
    }
    n(cn, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
    function Ko(e) {
      let t = e._ownerWritableStream, r = t._state;
      return r === "errored" || r === "erroring" ? null : r === "closed" ? 0 : yn(t._writableStreamController);
    }
    n(Ko, "WritableStreamDefaultWriterGetDesiredSize");
    function hn(e) {
      let t = e._ownerWritableStream, r = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
      cn(e, r), Jo(e, r), t._writer = void 0, e._ownerWritableStream = void 0;
    }
    n(hn, "WritableStreamDefaultWriterRelease");
    function bn(e, t) {
      let r = e._ownerWritableStream, o = r._writableStreamController, a = ra(o, t);
      if (r !== e._ownerWritableStream)
        return h(Ne("write to"));
      let i = r._state;
      if (i === "errored")
        return h(r._storedError);
      if (N(r) || i === "closed")
        return h(new TypeError("The stream is closing or closed and cannot be written to"));
      if (i === "erroring")
        return h(r._storedError);
      let s = No(r);
      return na(o, t, a), s;
    }
    n(bn, "WritableStreamDefaultWriterWrite");
    let mn = {};
    class qe {
      static {
        n(this, "WritableStreamDefaultController");
      }
      constructor() {
        throw new TypeError("Illegal constructor");
      }
      /**
       * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
       *
       * @deprecated
       *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
       *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
       */
      get abortReason() {
        if (!nr(this))
          throw ar("abortReason");
        return this._abortReason;
      }
      /**
       * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
       */
      get signal() {
        if (!nr(this))
          throw ar("signal");
        if (this._abortController === void 0)
          throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
        return this._abortController.signal;
      }
      /**
       * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
       *
       * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
       * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
       * normal lifecycle of interactions with the underlying sink.
       */
      error(t = void 0) {
        if (!nr(this))
          throw ar("error");
        this._controlledWritableStream._state === "writable" && _n(this, t);
      }
      /** @internal */
      [Cr](t) {
        let r = this._abortAlgorithm(t);
        return st(this), r;
      }
      /** @internal */
      [Tr]() {
        ne(this);
      }
    }
    Object.defineProperties(qe.prototype, {
      abortReason: { enumerable: !0 },
      signal: { enumerable: !0 },
      error: { enumerable: !0 }
    }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(qe.prototype, Symbol.toStringTag, {
      value: "WritableStreamDefaultController",
      configurable: !0
    });
    function nr(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledWritableStream") ? !1 : e instanceof qe;
    }
    n(nr, "IsWritableStreamDefaultController");
    function pn(e, t, r, o, a, i, s, f) {
      t._controlledWritableStream = e, e._writableStreamController = t, t._queue = void 0, t._queueTotalSize = void 0, ne(t), t._abortReason = void 0, t._abortController = Lo(), t._started = !1, t._strategySizeAlgorithm = f, t._strategyHWM = s, t._writeAlgorithm = o, t._closeAlgorithm = a, t._abortAlgorithm = i;
      let y = or(t);
      rr(e, y);
      let b = r(), _ = g(b);
      E(_, () => (t._started = !0, lt(t), null), (S) => (t._started = !0, Kt(e, S), null));
    }
    n(pn, "SetUpWritableStreamDefaultController");
    function ea(e, t, r, o) {
      let a = Object.create(qe.prototype), i, s, f, y;
      t.start !== void 0 ? i = /* @__PURE__ */ n(() => t.start(a), "startAlgorithm") : i = /* @__PURE__ */ n(() => {
      }, "startAlgorithm"), t.write !== void 0 ? s = /* @__PURE__ */ n((b) => t.write(b, a), "writeAlgorithm") : s = /* @__PURE__ */ n(() => g(void 0), "writeAlgorithm"), t.close !== void 0 ? f = /* @__PURE__ */ n(() => t.close(), "closeAlgorithm") : f = /* @__PURE__ */ n(() => g(void 0), "closeAlgorithm"), t.abort !== void 0 ? y = /* @__PURE__ */ n((b) => t.abort(b), "abortAlgorithm") : y = /* @__PURE__ */ n(() => g(void 0), "abortAlgorithm"), pn(e, a, i, s, f, y, r, o);
    }
    n(ea, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
    function st(e) {
      e._writeAlgorithm = void 0, e._closeAlgorithm = void 0, e._abortAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
    }
    n(st, "WritableStreamDefaultControllerClearAlgorithms");
    function ta(e) {
      Yt(e, mn, 0), lt(e);
    }
    n(ta, "WritableStreamDefaultControllerClose");
    function ra(e, t) {
      try {
        return e._strategySizeAlgorithm(t);
      } catch (r) {
        return $e(e, r), 1;
      }
    }
    n(ra, "WritableStreamDefaultControllerGetChunkSize");
    function yn(e) {
      return e._strategyHWM - e._queueTotalSize;
    }
    n(yn, "WritableStreamDefaultControllerGetDesiredSize");
    function na(e, t, r) {
      try {
        Yt(e, t, r);
      } catch (a) {
        $e(e, a);
        return;
      }
      let o = e._controlledWritableStream;
      if (!N(o) && o._state === "writable") {
        let a = or(e);
        rr(o, a);
      }
      lt(e);
    }
    n(na, "WritableStreamDefaultControllerWrite");
    function lt(e) {
      let t = e._controlledWritableStream;
      if (!e._started || t._inFlightWriteRequest !== void 0)
        return;
      if (t._state === "erroring") {
        tr(t);
        return;
      }
      if (e._queue.length === 0)
        return;
      let o = yo(e);
      o === mn ? oa(e) : aa(e, o);
    }
    n(lt, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
    function $e(e, t) {
      e._controlledWritableStream._state === "writable" && _n(e, t);
    }
    n($e, "WritableStreamDefaultControllerErrorIfNeeded");
    function oa(e) {
      let t = e._controlledWritableStream;
      Go(t), Ut(e);
      let r = e._closeAlgorithm();
      st(e), E(r, () => (Yo(t), null), (o) => (Vo(t, o), null));
    }
    n(oa, "WritableStreamDefaultControllerProcessClose");
    function aa(e, t) {
      let r = e._controlledWritableStream;
      xo(r);
      let o = e._writeAlgorithm(t);
      E(o, () => {
        Qo(r);
        let a = r._state;
        if (Ut(e), !N(r) && a === "writable") {
          let i = or(e);
          rr(r, i);
        }
        return lt(e), null;
      }, (a) => (r._state === "writable" && st(e), Uo(r, a), null));
    }
    n(aa, "WritableStreamDefaultControllerProcessWrite");
    function or(e) {
      return yn(e) <= 0;
    }
    n(or, "WritableStreamDefaultControllerGetBackpressure");
    function _n(e, t) {
      let r = e._controlledWritableStream;
      st(e), er(r, t);
    }
    n(_n, "WritableStreamDefaultControllerError");
    function ut(e) {
      return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`);
    }
    n(ut, "streamBrandCheckException$2");
    function ar(e) {
      return new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`);
    }
    n(ar, "defaultControllerBrandCheckException$2");
    function _e(e) {
      return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`);
    }
    n(_e, "defaultWriterBrandCheckException");
    function Ne(e) {
      return new TypeError("Cannot " + e + " a stream using a released writer");
    }
    n(Ne, "defaultWriterLockException");
    function ft(e) {
      e._closedPromise = v((t, r) => {
        e._closedPromise_resolve = t, e._closedPromise_reject = r, e._closedPromiseState = "pending";
      });
    }
    n(ft, "defaultWriterClosedPromiseInitialize");
    function Sn(e, t) {
      ft(e), ir(e, t);
    }
    n(Sn, "defaultWriterClosedPromiseInitializeAsRejected");
    function ia(e) {
      ft(e), gn(e);
    }
    n(ia, "defaultWriterClosedPromiseInitializeAsResolved");
    function ir(e, t) {
      e._closedPromise_reject !== void 0 && (Ce(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "rejected");
    }
    n(ir, "defaultWriterClosedPromiseReject");
    function sa(e, t) {
      Sn(e, t);
    }
    n(sa, "defaultWriterClosedPromiseResetToRejected");
    function gn(e) {
      e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "resolved");
    }
    n(gn, "defaultWriterClosedPromiseResolve");
    function dt(e) {
      e._readyPromise = v((t, r) => {
        e._readyPromise_resolve = t, e._readyPromise_reject = r;
      }), e._readyPromiseState = "pending";
    }
    n(dt, "defaultWriterReadyPromiseInitialize");
    function sr(e, t) {
      dt(e), wn(e, t);
    }
    n(sr, "defaultWriterReadyPromiseInitializeAsRejected");
    function Rn(e) {
      dt(e), lr(e);
    }
    n(Rn, "defaultWriterReadyPromiseInitializeAsResolved");
    function wn(e, t) {
      e._readyPromise_reject !== void 0 && (Ce(e._readyPromise), e._readyPromise_reject(t), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "rejected");
    }
    n(wn, "defaultWriterReadyPromiseReject");
    function la(e) {
      dt(e);
    }
    n(la, "defaultWriterReadyPromiseReset");
    function ua(e, t) {
      sr(e, t);
    }
    n(ua, "defaultWriterReadyPromiseResetToRejected");
    function lr(e) {
      e._readyPromise_resolve !== void 0 && (e._readyPromise_resolve(void 0), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "fulfilled");
    }
    n(lr, "defaultWriterReadyPromiseResolve");
    function fa() {
      if (typeof globalThis < "u")
        return globalThis;
      if (typeof self < "u")
        return self;
      if (typeof global < "u")
        return global;
    }
    n(fa, "getGlobals");
    let ur = fa();
    function da(e) {
      if (!(typeof e == "function" || typeof e == "object") || e.name !== "DOMException")
        return !1;
      try {
        return new e(), !0;
      } catch {
        return !1;
      }
    }
    n(da, "isDOMExceptionConstructor");
    function ca() {
      let e = ur?.DOMException;
      return da(e) ? e : void 0;
    }
    n(ca, "getFromGlobal");
    function ha() {
      let e = /* @__PURE__ */ n(function(r, o) {
        this.message = r || "", this.name = o || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
      }, "DOMException");
      return c(e, "DOMException"), e.prototype = Object.create(Error.prototype), Object.defineProperty(e.prototype, "constructor", { value: e, writable: !0, configurable: !0 }), e;
    }
    n(ha, "createPolyfill");
    let ba = ca() || ha();
    function Cn(e, t, r, o, a, i) {
      let s = Te(e), f = ln(t);
      e._disturbed = !0;
      let y = !1, b = g(void 0);
      return v((_, S) => {
        let C;
        if (i !== void 0) {
          if (C = /* @__PURE__ */ n(() => {
            let p = i.reason !== void 0 ? i.reason : new ba("Aborted", "AbortError"), R = [];
            o || R.push(() => t._state === "writable" ? at(t, p) : g(void 0)), a || R.push(() => e._state === "readable" ? D(e, p) : g(void 0)), W(() => Promise.all(R.map((P) => P())), !0, p);
          }, "abortAlgorithm"), i.aborted) {
            C();
            return;
          }
          i.addEventListener("abort", C);
        }
        function M() {
          return v((p, R) => {
            function P(k) {
              k ? p() : B(ke(), P, R);
            }
            n(P, "next"), P(!1);
          });
        }
        n(M, "pipeLoop");
        function ke() {
          return y ? g(!0) : B(f._readyPromise, () => v((p, R) => {
            Ie(s, {
              _chunkSteps: /* @__PURE__ */ n((P) => {
                b = B(bn(f, P), void 0, l), p(!1);
              }, "_chunkSteps"),
              _closeSteps: /* @__PURE__ */ n(() => p(!0), "_closeSteps"),
              _errorSteps: R
            });
          }));
        }
        if (n(ke, "pipeStep"), X(e, s._closedPromise, (p) => (o ? I(!0, p) : W(() => at(t, p), !0, p), null)), X(t, f._closedPromise, (p) => (a ? I(!0, p) : W(() => D(e, p), !0, p), null)), A(e, s._closedPromise, () => (r ? I() : W(() => Xo(f)), null)), N(t) || t._state === "closed") {
          let p = new TypeError("the destination writable stream closed before all data could be piped to it");
          a ? I(!0, p) : W(() => D(e, p), !0, p);
        }
        Ce(M());
        function ue() {
          let p = b;
          return B(b, () => p !== b ? ue() : void 0);
        }
        n(ue, "waitForWritesToFinish");
        function X(p, R, P) {
          p._state === "errored" ? P(p._storedError) : Q(R, P);
        }
        n(X, "isOrBecomesErrored");
        function A(p, R, P) {
          p._state === "closed" ? P() : L(R, P);
        }
        n(A, "isOrBecomesClosed");
        function W(p, R, P) {
          if (y)
            return;
          y = !0, t._state === "writable" && !N(t) ? L(ue(), k) : k();
          function k() {
            return E(p(), () => J(R, P), (Oe) => J(!0, Oe)), null;
          }
          n(k, "doTheRest");
        }
        n(W, "shutdownWithAction");
        function I(p, R) {
          y || (y = !0, t._state === "writable" && !N(t) ? L(ue(), () => J(p, R)) : J(p, R));
        }
        n(I, "shutdown");
        function J(p, R) {
          return hn(f), Y(s), i !== void 0 && i.removeEventListener("abort", C), p ? S(R) : _(void 0), null;
        }
        n(J, "finalize");
      });
    }
    n(Cn, "ReadableStreamPipeTo");
    class Z {
      static {
        n(this, "ReadableStreamDefaultController");
      }
      constructor() {
        throw new TypeError("Illegal constructor");
      }
      /**
       * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
       * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
       */
      get desiredSize() {
        if (!ct(this))
          throw bt("desiredSize");
        return fr(this);
      }
      /**
       * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
       * the stream, but once those are read, the stream will become closed.
       */
      close() {
        if (!ct(this))
          throw bt("close");
        if (!We(this))
          throw new TypeError("The stream is not in a state that permits close");
        Se(this);
      }
      enqueue(t = void 0) {
        if (!ct(this))
          throw bt("enqueue");
        if (!We(this))
          throw new TypeError("The stream is not in a state that permits enqueue");
        return Ae(this, t);
      }
      /**
       * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
       */
      error(t = void 0) {
        if (!ct(this))
          throw bt("error");
        j(this, t);
      }
      /** @internal */
      [At](t) {
        ne(this);
        let r = this._cancelAlgorithm(t);
        return ht(this), r;
      }
      /** @internal */
      [Wt](t) {
        let r = this._controlledReadableStream;
        if (this._queue.length > 0) {
          let o = Ut(this);
          this._closeRequested && this._queue.length === 0 ? (ht(this), Ye(r)) : Qe(this), t._chunkSteps(o);
        } else
          Br(r, t), Qe(this);
      }
      /** @internal */
      [Bt]() {
      }
    }
    Object.defineProperties(Z.prototype, {
      close: { enumerable: !0 },
      enqueue: { enumerable: !0 },
      error: { enumerable: !0 },
      desiredSize: { enumerable: !0 }
    }), c(Z.prototype.close, "close"), c(Z.prototype.enqueue, "enqueue"), c(Z.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Z.prototype, Symbol.toStringTag, {
      value: "ReadableStreamDefaultController",
      configurable: !0
    });
    function ct(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableStream") ? !1 : e instanceof Z;
    }
    n(ct, "IsReadableStreamDefaultController");
    function Qe(e) {
      if (!Tn(e))
        return;
      if (e._pulling) {
        e._pullAgain = !0;
        return;
      }
      e._pulling = !0;
      let r = e._pullAlgorithm();
      E(r, () => (e._pulling = !1, e._pullAgain && (e._pullAgain = !1, Qe(e)), null), (o) => (j(e, o), null));
    }
    n(Qe, "ReadableStreamDefaultControllerCallPullIfNeeded");
    function Tn(e) {
      let t = e._controlledReadableStream;
      return !We(e) || !e._started ? !1 : !!(se(t) && Ge(t) > 0 || fr(e) > 0);
    }
    n(Tn, "ReadableStreamDefaultControllerShouldCallPull");
    function ht(e) {
      e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
    }
    n(ht, "ReadableStreamDefaultControllerClearAlgorithms");
    function Se(e) {
      if (!We(e))
        return;
      let t = e._controlledReadableStream;
      e._closeRequested = !0, e._queue.length === 0 && (ht(e), Ye(t));
    }
    n(Se, "ReadableStreamDefaultControllerClose");
    function Ae(e, t) {
      if (!We(e))
        return;
      let r = e._controlledReadableStream;
      if (se(r) && Ge(r) > 0)
        Mt(r, t, !1);
      else {
        let o;
        try {
          o = e._strategySizeAlgorithm(t);
        } catch (a) {
          throw j(e, a), a;
        }
        try {
          Yt(e, t, o);
        } catch (a) {
          throw j(e, a), a;
        }
      }
      Qe(e);
    }
    n(Ae, "ReadableStreamDefaultControllerEnqueue");
    function j(e, t) {
      let r = e._controlledReadableStream;
      r._state === "readable" && (ne(e), ht(e), qn(r, t));
    }
    n(j, "ReadableStreamDefaultControllerError");
    function fr(e) {
      let t = e._controlledReadableStream._state;
      return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
    }
    n(fr, "ReadableStreamDefaultControllerGetDesiredSize");
    function ma(e) {
      return !Tn(e);
    }
    n(ma, "ReadableStreamDefaultControllerHasBackpressure");
    function We(e) {
      let t = e._controlledReadableStream._state;
      return !e._closeRequested && t === "readable";
    }
    n(We, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
    function Pn(e, t, r, o, a, i, s) {
      t._controlledReadableStream = e, t._queue = void 0, t._queueTotalSize = void 0, ne(t), t._started = !1, t._closeRequested = !1, t._pullAgain = !1, t._pulling = !1, t._strategySizeAlgorithm = s, t._strategyHWM = i, t._pullAlgorithm = o, t._cancelAlgorithm = a, e._readableStreamController = t;
      let f = r();
      E(g(f), () => (t._started = !0, Qe(t), null), (y) => (j(t, y), null));
    }
    n(Pn, "SetUpReadableStreamDefaultController");
    function pa(e, t, r, o) {
      let a = Object.create(Z.prototype), i, s, f;
      t.start !== void 0 ? i = /* @__PURE__ */ n(() => t.start(a), "startAlgorithm") : i = /* @__PURE__ */ n(() => {
      }, "startAlgorithm"), t.pull !== void 0 ? s = /* @__PURE__ */ n(() => t.pull(a), "pullAlgorithm") : s = /* @__PURE__ */ n(() => g(void 0), "pullAlgorithm"), t.cancel !== void 0 ? f = /* @__PURE__ */ n((y) => t.cancel(y), "cancelAlgorithm") : f = /* @__PURE__ */ n(() => g(void 0), "cancelAlgorithm"), Pn(e, a, i, s, f, r, o);
    }
    n(pa, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
    function bt(e) {
      return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`);
    }
    n(bt, "defaultControllerBrandCheckException$1");
    function ya(e, t) {
      return be(e._readableStreamController) ? Sa(e) : _a(e);
    }
    n(ya, "ReadableStreamTee");
    function _a(e, t) {
      let r = Te(e), o = !1, a = !1, i = !1, s = !1, f, y, b, _, S, C = v((A) => {
        S = A;
      });
      function M() {
        return o ? (a = !0, g(void 0)) : (o = !0, Ie(r, {
          _chunkSteps: /* @__PURE__ */ n((W) => {
            de(() => {
              a = !1;
              let I = W, J = W;
              i || Ae(b._readableStreamController, I), s || Ae(_._readableStreamController, J), o = !1, a && M();
            });
          }, "_chunkSteps"),
          _closeSteps: /* @__PURE__ */ n(() => {
            o = !1, i || Se(b._readableStreamController), s || Se(_._readableStreamController), (!i || !s) && S(void 0);
          }, "_closeSteps"),
          _errorSteps: /* @__PURE__ */ n(() => {
            o = !1;
          }, "_errorSteps")
        }), g(void 0));
      }
      n(M, "pullAlgorithm");
      function ke(A) {
        if (i = !0, f = A, s) {
          let W = je([f, y]), I = D(e, W);
          S(I);
        }
        return C;
      }
      n(ke, "cancel1Algorithm");
      function ue(A) {
        if (s = !0, y = A, i) {
          let W = je([f, y]), I = D(e, W);
          S(I);
        }
        return C;
      }
      n(ue, "cancel2Algorithm");
      function X() {
      }
      return n(X, "startAlgorithm"), b = Ue(X, M, ke), _ = Ue(X, M, ue), Q(r._closedPromise, (A) => (j(b._readableStreamController, A), j(_._readableStreamController, A), (!i || !s) && S(void 0), null)), [b, _];
    }
    n(_a, "ReadableStreamDefaultTee");
    function Sa(e) {
      let t = Te(e), r = !1, o = !1, a = !1, i = !1, s = !1, f, y, b, _, S, C = v((p) => {
        S = p;
      });
      function M(p) {
        Q(p._closedPromise, (R) => (p !== t || (z(b._readableStreamController, R), z(_._readableStreamController, R), (!i || !s) && S(void 0)), null));
      }
      n(M, "forwardReaderError");
      function ke() {
        pe(t) && (Y(t), t = Te(e), M(t)), Ie(t, {
          _chunkSteps: /* @__PURE__ */ n((R) => {
            de(() => {
              o = !1, a = !1;
              let P = R, k = R;
              if (!i && !s)
                try {
                  k = Nr(R);
                } catch (Oe) {
                  z(b._readableStreamController, Oe), z(_._readableStreamController, Oe), S(D(e, Oe));
                  return;
                }
              i || Ke(b._readableStreamController, P), s || Ke(_._readableStreamController, k), r = !1, o ? X() : a && A();
            });
          }, "_chunkSteps"),
          _closeSteps: /* @__PURE__ */ n(() => {
            r = !1, i || De(b._readableStreamController), s || De(_._readableStreamController), b._readableStreamController._pendingPullIntos.length > 0 && et(b._readableStreamController, 0), _._readableStreamController._pendingPullIntos.length > 0 && et(_._readableStreamController, 0), (!i || !s) && S(void 0);
          }, "_closeSteps"),
          _errorSteps: /* @__PURE__ */ n(() => {
            r = !1;
          }, "_errorSteps")
        });
      }
      n(ke, "pullWithDefaultReader");
      function ue(p, R) {
        te(t) && (Y(t), t = tn(e), M(t));
        let P = R ? _ : b, k = R ? b : _;
        on(t, p, 1, {
          _chunkSteps: /* @__PURE__ */ n((Fe) => {
            de(() => {
              o = !1, a = !1;
              let ze = R ? s : i;
              if (R ? i : s)
                ze || tt(P._readableStreamController, Fe);
              else {
                let $n;
                try {
                  $n = Nr(Fe);
                } catch (mr) {
                  z(P._readableStreamController, mr), z(k._readableStreamController, mr), S(D(e, mr));
                  return;
                }
                ze || tt(P._readableStreamController, Fe), Ke(k._readableStreamController, $n);
              }
              r = !1, o ? X() : a && A();
            });
          }, "_chunkSteps"),
          _closeSteps: /* @__PURE__ */ n((Fe) => {
            r = !1;
            let ze = R ? s : i, wt = R ? i : s;
            ze || De(P._readableStreamController), wt || De(k._readableStreamController), Fe !== void 0 && (ze || tt(P._readableStreamController, Fe), !wt && k._readableStreamController._pendingPullIntos.length > 0 && et(k._readableStreamController, 0)), (!ze || !wt) && S(void 0);
          }, "_closeSteps"),
          _errorSteps: /* @__PURE__ */ n(() => {
            r = !1;
          }, "_errorSteps")
        });
      }
      n(ue, "pullWithBYOBReader");
      function X() {
        if (r)
          return o = !0, g(void 0);
        r = !0;
        let p = Zt(b._readableStreamController);
        return p === null ? ke() : ue(p._view, !1), g(void 0);
      }
      n(X, "pull1Algorithm");
      function A() {
        if (r)
          return a = !0, g(void 0);
        r = !0;
        let p = Zt(_._readableStreamController);
        return p === null ? ke() : ue(p._view, !0), g(void 0);
      }
      n(A, "pull2Algorithm");
      function W(p) {
        if (i = !0, f = p, s) {
          let R = je([f, y]), P = D(e, R);
          S(P);
        }
        return C;
      }
      n(W, "cancel1Algorithm");
      function I(p) {
        if (s = !0, y = p, i) {
          let R = je([f, y]), P = D(e, R);
          S(P);
        }
        return C;
      }
      n(I, "cancel2Algorithm");
      function J() {
      }
      return n(J, "startAlgorithm"), b = En(J, X, W), _ = En(J, A, I), M(t), [b, _];
    }
    n(Sa, "ReadableByteStreamTee");
    function ga(e) {
      return u(e) && typeof e.getReader < "u";
    }
    n(ga, "isReadableStreamLike");
    function Ra(e) {
      return ga(e) ? Ca(e.getReader()) : wa(e);
    }
    n(Ra, "ReadableStreamFrom");
    function wa(e) {
      let t, r = $r(e, "async"), o = l;
      function a() {
        let s;
        try {
          s = ho(r);
        } catch (y) {
          return h(y);
        }
        let f = g(s);
        return U(f, (y) => {
          if (!u(y))
            throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
          if (bo(y))
            Se(t._readableStreamController);
          else {
            let _ = mo(y);
            Ae(t._readableStreamController, _);
          }
        });
      }
      n(a, "pullAlgorithm");
      function i(s) {
        let f = r.iterator, y;
        try {
          y = Ze(f, "return");
        } catch (S) {
          return h(S);
        }
        if (y === void 0)
          return g(void 0);
        let b;
        try {
          b = ce(y, f, [s]);
        } catch (S) {
          return h(S);
        }
        let _ = g(b);
        return U(_, (S) => {
          if (!u(S))
            throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
        });
      }
      return n(i, "cancelAlgorithm"), t = Ue(o, a, i, 0), t;
    }
    n(wa, "ReadableStreamFromIterable");
    function Ca(e) {
      let t, r = l;
      function o() {
        let i;
        try {
          i = e.read();
        } catch (s) {
          return h(s);
        }
        return U(i, (s) => {
          if (!u(s))
            throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
          if (s.done)
            Se(t._readableStreamController);
          else {
            let f = s.value;
            Ae(t._readableStreamController, f);
          }
        });
      }
      n(o, "pullAlgorithm");
      function a(i) {
        try {
          return g(e.cancel(i));
        } catch (s) {
          return h(s);
        }
      }
      return n(a, "cancelAlgorithm"), t = Ue(r, o, a, 0), t;
    }
    n(Ca, "ReadableStreamFromDefaultReader");
    function Ta(e, t) {
      $(e, t);
      let r = e, o = r?.autoAllocateChunkSize, a = r?.cancel, i = r?.pull, s = r?.start, f = r?.type;
      return {
        autoAllocateChunkSize: o === void 0 ? void 0 : jt(o, `${t} has member 'autoAllocateChunkSize' that`),
        cancel: a === void 0 ? void 0 : Pa(a, r, `${t} has member 'cancel' that`),
        pull: i === void 0 ? void 0 : va(i, r, `${t} has member 'pull' that`),
        start: s === void 0 ? void 0 : Ea(s, r, `${t} has member 'start' that`),
        type: f === void 0 ? void 0 : qa(f, `${t} has member 'type' that`)
      };
    }
    n(Ta, "convertUnderlyingDefaultOrByteSource");
    function Pa(e, t, r) {
      return F(e, r), (o) => K(e, t, [o]);
    }
    n(Pa, "convertUnderlyingSourceCancelCallback");
    function va(e, t, r) {
      return F(e, r), (o) => K(e, t, [o]);
    }
    n(va, "convertUnderlyingSourcePullCallback");
    function Ea(e, t, r) {
      return F(e, r), (o) => ce(e, t, [o]);
    }
    n(Ea, "convertUnderlyingSourceStartCallback");
    function qa(e, t) {
      if (e = `${e}`, e !== "bytes")
        throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);
      return e;
    }
    n(qa, "convertReadableStreamType");
    function Aa(e, t) {
      return $(e, t), { preventCancel: !!e?.preventCancel };
    }
    n(Aa, "convertIteratorOptions");
    function vn(e, t) {
      $(e, t);
      let r = e?.preventAbort, o = e?.preventCancel, a = e?.preventClose, i = e?.signal;
      return i !== void 0 && Wa(i, `${t} has member 'signal' that`), {
        preventAbort: !!r,
        preventCancel: !!o,
        preventClose: !!a,
        signal: i
      };
    }
    n(vn, "convertPipeOptions");
    function Wa(e, t) {
      if (!Do(e))
        throw new TypeError(`${t} is not an AbortSignal.`);
    }
    n(Wa, "assertAbortSignal");
    function Ba(e, t) {
      $(e, t);
      let r = e?.readable;
      zt(r, "readable", "ReadableWritablePair"), Dt(r, `${t} has member 'readable' that`);
      let o = e?.writable;
      return zt(o, "writable", "ReadableWritablePair"), sn(o, `${t} has member 'writable' that`), { readable: r, writable: o };
    }
    n(Ba, "convertReadableWritablePair");
    class q {
      static {
        n(this, "ReadableStream");
      }
      constructor(t = {}, r = {}) {
        t === void 0 ? t = null : Ar(t, "First parameter");
        let o = ot(r, "Second parameter"), a = Ta(t, "First parameter");
        if (dr(this), a.type === "bytes") {
          if (o.size !== void 0)
            throw new RangeError("The strategy for a byte stream cannot have a size function");
          let i = Le(o, 0);
          Po(this, a, i);
        } else {
          let i = nt(o), s = Le(o, 1);
          pa(this, a, s, i);
        }
      }
      /**
       * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
       */
      get locked() {
        if (!ie(this))
          throw ge("locked");
        return se(this);
      }
      /**
       * Cancels the stream, signaling a loss of interest in the stream by a consumer.
       *
       * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
       * method, which might or might not use it.
       */
      cancel(t = void 0) {
        return ie(this) ? se(this) ? h(new TypeError("Cannot cancel a stream that already has a reader")) : D(this, t) : h(ge("cancel"));
      }
      getReader(t = void 0) {
        if (!ie(this))
          throw ge("getReader");
        return Eo(t, "First parameter").mode === void 0 ? Te(this) : tn(this);
      }
      pipeThrough(t, r = {}) {
        if (!ie(this))
          throw ge("pipeThrough");
        V(t, 1, "pipeThrough");
        let o = Ba(t, "First parameter"), a = vn(r, "Second parameter");
        if (se(this))
          throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
        if (Ee(o.writable))
          throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
        let i = Cn(this, o.writable, a.preventClose, a.preventAbort, a.preventCancel, a.signal);
        return Ce(i), o.readable;
      }
      pipeTo(t, r = {}) {
        if (!ie(this))
          return h(ge("pipeTo"));
        if (t === void 0)
          return h("Parameter 1 is required in 'pipeTo'.");
        if (!ve(t))
          return h(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
        let o;
        try {
          o = vn(r, "Second parameter");
        } catch (a) {
          return h(a);
        }
        return se(this) ? h(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Ee(t) ? h(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Cn(this, t, o.preventClose, o.preventAbort, o.preventCancel, o.signal);
      }
      /**
       * Tees this readable stream, returning a two-element array containing the two resulting branches as
       * new {@link ReadableStream} instances.
       *
       * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
       * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
       * propagated to the stream's underlying source.
       *
       * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
       * this could allow interference between the two branches.
       */
      tee() {
        if (!ie(this))
          throw ge("tee");
        let t = ya(this);
        return je(t);
      }
      values(t = void 0) {
        if (!ie(this))
          throw ge("values");
        let r = Aa(t, "First parameter");
        return fo(this, r.preventCancel);
      }
      [Qt](t) {
        return this.values(t);
      }
      /**
       * Creates a new ReadableStream wrapping the provided iterable or async iterable.
       *
       * This can be used to adapt various kinds of objects into a readable stream,
       * such as an array, an async generator, or a Node.js readable stream.
       */
      static from(t) {
        return Ra(t);
      }
    }
    Object.defineProperties(q, {
      from: { enumerable: !0 }
    }), Object.defineProperties(q.prototype, {
      cancel: { enumerable: !0 },
      getReader: { enumerable: !0 },
      pipeThrough: { enumerable: !0 },
      pipeTo: { enumerable: !0 },
      tee: { enumerable: !0 },
      values: { enumerable: !0 },
      locked: { enumerable: !0 }
    }), c(q.from, "from"), c(q.prototype.cancel, "cancel"), c(q.prototype.getReader, "getReader"), c(q.prototype.pipeThrough, "pipeThrough"), c(q.prototype.pipeTo, "pipeTo"), c(q.prototype.tee, "tee"), c(q.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(q.prototype, Symbol.toStringTag, {
      value: "ReadableStream",
      configurable: !0
    }), Object.defineProperty(q.prototype, Qt, {
      value: q.prototype.values,
      writable: !0,
      configurable: !0
    });
    function Ue(e, t, r, o = 1, a = () => 1) {
      let i = Object.create(q.prototype);
      dr(i);
      let s = Object.create(Z.prototype);
      return Pn(i, s, e, t, r, o, a), i;
    }
    n(Ue, "CreateReadableStream");
    function En(e, t, r) {
      let o = Object.create(q.prototype);
      dr(o);
      let a = Object.create(G.prototype);
      return en(o, a, e, t, r, 0, void 0), o;
    }
    n(En, "CreateReadableByteStream");
    function dr(e) {
      e._state = "readable", e._reader = void 0, e._storedError = void 0, e._disturbed = !1;
    }
    n(dr, "InitializeReadableStream");
    function ie(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readableStreamController") ? !1 : e instanceof q;
    }
    n(ie, "IsReadableStream");
    function se(e) {
      return e._reader !== void 0;
    }
    n(se, "IsReadableStreamLocked");
    function D(e, t) {
      if (e._disturbed = !0, e._state === "closed")
        return g(void 0);
      if (e._state === "errored")
        return h(e._storedError);
      Ye(e);
      let r = e._reader;
      if (r !== void 0 && pe(r)) {
        let a = r._readIntoRequests;
        r._readIntoRequests = new O(), a.forEach((i) => {
          i._closeSteps(void 0);
        });
      }
      let o = e._readableStreamController[At](t);
      return U(o, l);
    }
    n(D, "ReadableStreamCancel");
    function Ye(e) {
      e._state = "closed";
      let t = e._reader;
      if (t !== void 0 && (Er(t), te(t))) {
        let r = t._readRequests;
        t._readRequests = new O(), r.forEach((o) => {
          o._closeSteps();
        });
      }
    }
    n(Ye, "ReadableStreamClose");
    function qn(e, t) {
      e._state = "errored", e._storedError = t;
      let r = e._reader;
      r !== void 0 && (Ft(r, t), te(r) ? Or(r, t) : an(r, t));
    }
    n(qn, "ReadableStreamError");
    function ge(e) {
      return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`);
    }
    n(ge, "streamBrandCheckException$1");
    function An(e, t) {
      $(e, t);
      let r = e?.highWaterMark;
      return zt(r, "highWaterMark", "QueuingStrategyInit"), {
        highWaterMark: It(r)
      };
    }
    n(An, "convertQueuingStrategyInit");
    let Wn = /* @__PURE__ */ n((e) => e.byteLength, "byteLengthSizeFunction");
    c(Wn, "size");
    class mt {
      static {
        n(this, "ByteLengthQueuingStrategy");
      }
      constructor(t) {
        V(t, 1, "ByteLengthQueuingStrategy"), t = An(t, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t.highWaterMark;
      }
      /**
       * Returns the high water mark provided to the constructor.
       */
      get highWaterMark() {
        if (!kn(this))
          throw Bn("highWaterMark");
        return this._byteLengthQueuingStrategyHighWaterMark;
      }
      /**
       * Measures the size of `chunk` by returning the value of its `byteLength` property.
       */
      get size() {
        if (!kn(this))
          throw Bn("size");
        return Wn;
      }
    }
    Object.defineProperties(mt.prototype, {
      highWaterMark: { enumerable: !0 },
      size: { enumerable: !0 }
    }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(mt.prototype, Symbol.toStringTag, {
      value: "ByteLengthQueuingStrategy",
      configurable: !0
    });
    function Bn(e) {
      return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`);
    }
    n(Bn, "byteLengthBrandCheckException");
    function kn(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_byteLengthQueuingStrategyHighWaterMark") ? !1 : e instanceof mt;
    }
    n(kn, "IsByteLengthQueuingStrategy");
    let On = /* @__PURE__ */ n(() => 1, "countSizeFunction");
    c(On, "size");
    class pt {
      static {
        n(this, "CountQueuingStrategy");
      }
      constructor(t) {
        V(t, 1, "CountQueuingStrategy"), t = An(t, "First parameter"), this._countQueuingStrategyHighWaterMark = t.highWaterMark;
      }
      /**
       * Returns the high water mark provided to the constructor.
       */
      get highWaterMark() {
        if (!zn(this))
          throw Fn("highWaterMark");
        return this._countQueuingStrategyHighWaterMark;
      }
      /**
       * Measures the size of `chunk` by always returning 1.
       * This ensures that the total queue size is a count of the number of chunks in the queue.
       */
      get size() {
        if (!zn(this))
          throw Fn("size");
        return On;
      }
    }
    Object.defineProperties(pt.prototype, {
      highWaterMark: { enumerable: !0 },
      size: { enumerable: !0 }
    }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pt.prototype, Symbol.toStringTag, {
      value: "CountQueuingStrategy",
      configurable: !0
    });
    function Fn(e) {
      return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`);
    }
    n(Fn, "countBrandCheckException");
    function zn(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_countQueuingStrategyHighWaterMark") ? !1 : e instanceof pt;
    }
    n(zn, "IsCountQueuingStrategy");
    function ka(e, t) {
      $(e, t);
      let r = e?.cancel, o = e?.flush, a = e?.readableType, i = e?.start, s = e?.transform, f = e?.writableType;
      return {
        cancel: r === void 0 ? void 0 : Ia(r, e, `${t} has member 'cancel' that`),
        flush: o === void 0 ? void 0 : Oa(o, e, `${t} has member 'flush' that`),
        readableType: a,
        start: i === void 0 ? void 0 : Fa(i, e, `${t} has member 'start' that`),
        transform: s === void 0 ? void 0 : za(s, e, `${t} has member 'transform' that`),
        writableType: f
      };
    }
    n(ka, "convertTransformer");
    function Oa(e, t, r) {
      return F(e, r), (o) => K(e, t, [o]);
    }
    n(Oa, "convertTransformerFlushCallback");
    function Fa(e, t, r) {
      return F(e, r), (o) => ce(e, t, [o]);
    }
    n(Fa, "convertTransformerStartCallback");
    function za(e, t, r) {
      return F(e, r), (o, a) => K(e, t, [o, a]);
    }
    n(za, "convertTransformerTransformCallback");
    function Ia(e, t, r) {
      return F(e, r), (o) => K(e, t, [o]);
    }
    n(Ia, "convertTransformerCancelCallback");
    class yt {
      static {
        n(this, "TransformStream");
      }
      constructor(t = {}, r = {}, o = {}) {
        t === void 0 && (t = null);
        let a = ot(r, "Second parameter"), i = ot(o, "Third parameter"), s = ka(t, "First parameter");
        if (s.readableType !== void 0)
          throw new RangeError("Invalid readableType specified");
        if (s.writableType !== void 0)
          throw new RangeError("Invalid writableType specified");
        let f = Le(i, 0), y = nt(i), b = Le(a, 1), _ = nt(a), S, C = v((M) => {
          S = M;
        });
        ja(this, C, b, _, f, y), Ma(this, s), s.start !== void 0 ? S(s.start(this._transformStreamController)) : S(void 0);
      }
      /**
       * The readable side of the transform stream.
       */
      get readable() {
        if (!In(this))
          throw Ln("readable");
        return this._readable;
      }
      /**
       * The writable side of the transform stream.
       */
      get writable() {
        if (!In(this))
          throw Ln("writable");
        return this._writable;
      }
    }
    Object.defineProperties(yt.prototype, {
      readable: { enumerable: !0 },
      writable: { enumerable: !0 }
    }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(yt.prototype, Symbol.toStringTag, {
      value: "TransformStream",
      configurable: !0
    });
    function ja(e, t, r, o, a, i) {
      function s() {
        return t;
      }
      n(s, "startAlgorithm");
      function f(C) {
        return Na(e, C);
      }
      n(f, "writeAlgorithm");
      function y(C) {
        return Qa(e, C);
      }
      n(y, "abortAlgorithm");
      function b() {
        return Ua(e);
      }
      n(b, "closeAlgorithm"), e._writable = $o(s, f, b, y, r, o);
      function _() {
        return Ya(e);
      }
      n(_, "pullAlgorithm");
      function S(C) {
        return Va(e, C);
      }
      n(S, "cancelAlgorithm"), e._readable = Ue(s, _, S, a, i), e._backpressure = void 0, e._backpressureChangePromise = void 0, e._backpressureChangePromise_resolve = void 0, _t(e, !0), e._transformStreamController = void 0;
    }
    n(ja, "InitializeTransformStream");
    function In(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_transformStreamController") ? !1 : e instanceof yt;
    }
    n(In, "IsTransformStream");
    function jn(e, t) {
      j(e._readable._readableStreamController, t), cr(e, t);
    }
    n(jn, "TransformStreamError");
    function cr(e, t) {
      gt(e._transformStreamController), $e(e._writable._writableStreamController, t), hr(e);
    }
    n(cr, "TransformStreamErrorWritableAndUnblockWrite");
    function hr(e) {
      e._backpressure && _t(e, !1);
    }
    n(hr, "TransformStreamUnblockWrite");
    function _t(e, t) {
      e._backpressureChangePromise !== void 0 && e._backpressureChangePromise_resolve(), e._backpressureChangePromise = v((r) => {
        e._backpressureChangePromise_resolve = r;
      }), e._backpressure = t;
    }
    n(_t, "TransformStreamSetBackpressure");
    class le {
      static {
        n(this, "TransformStreamDefaultController");
      }
      constructor() {
        throw new TypeError("Illegal constructor");
      }
      /**
       * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
       */
      get desiredSize() {
        if (!St(this))
          throw Rt("desiredSize");
        let t = this._controlledTransformStream._readable._readableStreamController;
        return fr(t);
      }
      enqueue(t = void 0) {
        if (!St(this))
          throw Rt("enqueue");
        Dn(this, t);
      }
      /**
       * Errors both the readable side and the writable side of the controlled transform stream, making all future
       * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
       */
      error(t = void 0) {
        if (!St(this))
          throw Rt("error");
        La(this, t);
      }
      /**
       * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
       * transformer only needs to consume a portion of the chunks written to the writable side.
       */
      terminate() {
        if (!St(this))
          throw Rt("terminate");
        $a(this);
      }
    }
    Object.defineProperties(le.prototype, {
      enqueue: { enumerable: !0 },
      error: { enumerable: !0 },
      terminate: { enumerable: !0 },
      desiredSize: { enumerable: !0 }
    }), c(le.prototype.enqueue, "enqueue"), c(le.prototype.error, "error"), c(le.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(le.prototype, Symbol.toStringTag, {
      value: "TransformStreamDefaultController",
      configurable: !0
    });
    function St(e) {
      return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledTransformStream") ? !1 : e instanceof le;
    }
    n(St, "IsTransformStreamDefaultController");
    function Da(e, t, r, o, a) {
      t._controlledTransformStream = e, e._transformStreamController = t, t._transformAlgorithm = r, t._flushAlgorithm = o, t._cancelAlgorithm = a, t._finishPromise = void 0, t._finishPromise_resolve = void 0, t._finishPromise_reject = void 0;
    }
    n(Da, "SetUpTransformStreamDefaultController");
    function Ma(e, t) {
      let r = Object.create(le.prototype), o, a, i;
      t.transform !== void 0 ? o = /* @__PURE__ */ n((s) => t.transform(s, r), "transformAlgorithm") : o = /* @__PURE__ */ n((s) => {
        try {
          return Dn(r, s), g(void 0);
        } catch (f) {
          return h(f);
        }
      }, "transformAlgorithm"), t.flush !== void 0 ? a = /* @__PURE__ */ n(() => t.flush(r), "flushAlgorithm") : a = /* @__PURE__ */ n(() => g(void 0), "flushAlgorithm"), t.cancel !== void 0 ? i = /* @__PURE__ */ n((s) => t.cancel(s), "cancelAlgorithm") : i = /* @__PURE__ */ n(() => g(void 0), "cancelAlgorithm"), Da(e, r, o, a, i);
    }
    n(Ma, "SetUpTransformStreamDefaultControllerFromTransformer");
    function gt(e) {
      e._transformAlgorithm = void 0, e._flushAlgorithm = void 0, e._cancelAlgorithm = void 0;
    }
    n(gt, "TransformStreamDefaultControllerClearAlgorithms");
    function Dn(e, t) {
      let r = e._controlledTransformStream, o = r._readable._readableStreamController;
      if (!We(o))
        throw new TypeError("Readable side is not in a state that permits enqueue");
      try {
        Ae(o, t);
      } catch (i) {
        throw cr(r, i), r._readable._storedError;
      }
      ma(o) !== r._backpressure && _t(r, !0);
    }
    n(Dn, "TransformStreamDefaultControllerEnqueue");
    function La(e, t) {
      jn(e._controlledTransformStream, t);
    }
    n(La, "TransformStreamDefaultControllerError");
    function Mn(e, t) {
      let r = e._transformAlgorithm(t);
      return U(r, void 0, (o) => {
        throw jn(e._controlledTransformStream, o), o;
      });
    }
    n(Mn, "TransformStreamDefaultControllerPerformTransform");
    function $a(e) {
      let t = e._controlledTransformStream, r = t._readable._readableStreamController;
      Se(r);
      let o = new TypeError("TransformStream terminated");
      cr(t, o);
    }
    n($a, "TransformStreamDefaultControllerTerminate");
    function Na(e, t) {
      let r = e._transformStreamController;
      if (e._backpressure) {
        let o = e._backpressureChangePromise;
        return U(o, () => {
          let a = e._writable;
          if (a._state === "erroring")
            throw a._storedError;
          return Mn(r, t);
        });
      }
      return Mn(r, t);
    }
    n(Na, "TransformStreamDefaultSinkWriteAlgorithm");
    function Qa(e, t) {
      let r = e._transformStreamController;
      if (r._finishPromise !== void 0)
        return r._finishPromise;
      let o = e._readable;
      r._finishPromise = v((i, s) => {
        r._finishPromise_resolve = i, r._finishPromise_reject = s;
      });
      let a = r._cancelAlgorithm(t);
      return gt(r), E(a, () => (o._state === "errored" ? Be(r, o._storedError) : (j(o._readableStreamController, t), br(r)), null), (i) => (j(o._readableStreamController, i), Be(r, i), null)), r._finishPromise;
    }
    n(Qa, "TransformStreamDefaultSinkAbortAlgorithm");
    function Ua(e) {
      let t = e._transformStreamController;
      if (t._finishPromise !== void 0)
        return t._finishPromise;
      let r = e._readable;
      t._finishPromise = v((a, i) => {
        t._finishPromise_resolve = a, t._finishPromise_reject = i;
      });
      let o = t._flushAlgorithm();
      return gt(t), E(o, () => (r._state === "errored" ? Be(t, r._storedError) : (Se(r._readableStreamController), br(t)), null), (a) => (j(r._readableStreamController, a), Be(t, a), null)), t._finishPromise;
    }
    n(Ua, "TransformStreamDefaultSinkCloseAlgorithm");
    function Ya(e) {
      return _t(e, !1), e._backpressureChangePromise;
    }
    n(Ya, "TransformStreamDefaultSourcePullAlgorithm");
    function Va(e, t) {
      let r = e._transformStreamController;
      if (r._finishPromise !== void 0)
        return r._finishPromise;
      let o = e._writable;
      r._finishPromise = v((i, s) => {
        r._finishPromise_resolve = i, r._finishPromise_reject = s;
      });
      let a = r._cancelAlgorithm(t);
      return gt(r), E(a, () => (o._state === "errored" ? Be(r, o._storedError) : ($e(o._writableStreamController, t), hr(e), br(r)), null), (i) => ($e(o._writableStreamController, i), hr(e), Be(r, i), null)), r._finishPromise;
    }
    n(Va, "TransformStreamDefaultSourceCancelAlgorithm");
    function Rt(e) {
      return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`);
    }
    n(Rt, "defaultControllerBrandCheckException");
    function br(e) {
      e._finishPromise_resolve !== void 0 && (e._finishPromise_resolve(), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
    }
    n(br, "defaultControllerFinishPromiseResolve");
    function Be(e, t) {
      e._finishPromise_reject !== void 0 && (Ce(e._finishPromise), e._finishPromise_reject(t), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
    }
    n(Be, "defaultControllerFinishPromiseReject");
    function Ln(e) {
      return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`);
    }
    n(Ln, "streamBrandCheckException"), d.ByteLengthQueuingStrategy = mt, d.CountQueuingStrategy = pt, d.ReadableByteStreamController = G, d.ReadableStream = q, d.ReadableStreamBYOBReader = oe, d.ReadableStreamBYOBRequest = he, d.ReadableStreamDefaultController = Z, d.ReadableStreamDefaultReader = ee, d.TransformStream = yt, d.TransformStreamDefaultController = le, d.WritableStream = ae, d.WritableStreamDefaultController = qe, d.WritableStreamDefaultWriter = x;
  }));
});

// node_modules/fetch-blob/streams.cjs
var Yn = pr(() => {
  if (!globalThis.ReadableStream)
    try {
      let d = Ct("node:process"), { emitWarning: l } = d;
      try {
        d.emitWarning = () => {
        }, Object.assign(globalThis, Ct("node:stream/web")), d.emitWarning = l;
      } catch (u) {
        throw d.emitWarning = l, u;
      }
    } catch {
      Object.assign(globalThis, Un());
    }
  try {
    let { Blob: d } = Ct("buffer");
    d && !d.prototype.stream && (d.prototype.stream = /* @__PURE__ */ n(function(u) {
      let m = 0, c = this;
      return new ReadableStream({
        type: "bytes",
        async pull(w) {
          let fe = await c.slice(m, Math.min(c.size, m + 65536)).arrayBuffer();
          m += fe.byteLength, w.enqueue(new Uint8Array(fe)), m === c.size && w.close();
        }
      });
    }, "name"));
  } catch {
  }
});

// node_modules/fetch-blob/index.js
async function* yr(d, l = !0) {
  for (let u of d)
    if ("stream" in u)
      yield* (
        /** @type {AsyncIterableIterator<Uint8Array>} */
        u.stream()
      );
    else if (ArrayBuffer.isView(u))
      if (l) {
        let m = u.byteOffset, c = u.byteOffset + u.byteLength;
        for (; m !== c; ) {
          let w = Math.min(c - m, Vn), T = u.buffer.slice(m, m + w);
          m += T.byteLength, yield new Uint8Array(T);
        }
      } else
        yield u;
    else {
      let m = 0, c = (
        /** @type {Blob} */
        u
      );
      for (; m !== c.size; ) {
        let T = await c.slice(m, Math.min(c.size, m + Vn)).arrayBuffer();
        m += T.byteLength, yield new Uint8Array(T);
      }
    }
}
var li, Vn, Hn, Ha, Re, vt = Tt(() => {
  li = Nn(Yn(), 1);
  Vn = 65536;
  n(yr, "toIterator");
  Hn = class _r {
    static {
      n(this, "Blob");
    }
    /** @type {Array.<(Blob|Uint8Array)>} */
    #e = [];
    #t = "";
    #r = 0;
    #n = "transparent";
    /**
     * The Blob() constructor returns a new Blob object. The content
     * of the blob consists of the concatenation of the values given
     * in the parameter array.
     *
     * @param {*} blobParts
     * @param {{ type?: string, endings?: string }} [options]
     */
    constructor(l = [], u = {}) {
      if (typeof l != "object" || l === null)
        throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
      if (typeof l[Symbol.iterator] != "function")
        throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
      if (typeof u != "object" && typeof u != "function")
        throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
      u === null && (u = {});
      let m = new TextEncoder();
      for (let w of l) {
        let T;
        ArrayBuffer.isView(w) ? T = new Uint8Array(w.buffer.slice(w.byteOffset, w.byteOffset + w.byteLength)) : w instanceof ArrayBuffer ? T = new Uint8Array(w.slice(0)) : w instanceof _r ? T = w : T = m.encode(`${w}`), this.#r += ArrayBuffer.isView(T) ? T.byteLength : T.size, this.#e.push(T);
      }
      this.#n = `${u.endings === void 0 ? "transparent" : u.endings}`;
      let c = u.type === void 0 ? "" : String(u.type);
      this.#t = /^[\x20-\x7E]*$/.test(c) ? c : "";
    }
    /**
     * The Blob interface's size property returns the
     * size of the Blob in bytes.
     */
    get size() {
      return this.#r;
    }
    /**
     * The type property of a Blob object returns the MIME type of the file.
     */
    get type() {
      return this.#t;
    }
    /**
     * The text() method in the Blob interface returns a Promise
     * that resolves with a string containing the contents of
     * the blob, interpreted as UTF-8.
     *
     * @return {Promise<string>}
     */
    async text() {
      let l = new TextDecoder(), u = "";
      for await (let m of yr(this.#e, !1))
        u += l.decode(m, { stream: !0 });
      return u += l.decode(), u;
    }
    /**
     * The arrayBuffer() method in the Blob interface returns a
     * Promise that resolves with the contents of the blob as
     * binary data contained in an ArrayBuffer.
     *
     * @return {Promise<ArrayBuffer>}
     */
    async arrayBuffer() {
      let l = new Uint8Array(this.size), u = 0;
      for await (let m of yr(this.#e, !1))
        l.set(m, u), u += m.length;
      return l.buffer;
    }
    stream() {
      let l = yr(this.#e, !0);
      return new globalThis.ReadableStream({
        // @ts-ignore
        type: "bytes",
        async pull(u) {
          let m = await l.next();
          m.done ? u.close() : u.enqueue(m.value);
        },
        async cancel() {
          await l.return();
        }
      });
    }
    /**
     * The Blob interface's slice() method creates and returns a
     * new Blob object which contains data from a subset of the
     * blob on which it's called.
     *
     * @param {number} [start]
     * @param {number} [end]
     * @param {string} [type]
     */
    slice(l = 0, u = this.size, m = "") {
      let { size: c } = this, w = l < 0 ? Math.max(c + l, 0) : Math.min(l, c), T = u < 0 ? Math.max(c + u, 0) : Math.min(u, c), fe = Math.max(T - w, 0), v = this.#e, g = [], h = 0;
      for (let E of v) {
        if (h >= fe)
          break;
        let L = ArrayBuffer.isView(E) ? E.byteLength : E.size;
        if (w && L <= w)
          w -= L, T -= L;
        else {
          let Q;
          ArrayBuffer.isView(E) ? (Q = E.subarray(w, Math.min(L, T)), h += Q.byteLength) : (Q = E.slice(w, Math.min(L, T)), h += Q.size), T -= L, g.push(Q), w = 0;
        }
      }
      let B = new _r([], { type: String(m).toLowerCase() });
      return B.#r = fe, B.#e = g, B;
    }
    get [Symbol.toStringTag]() {
      return "Blob";
    }
    static [Symbol.hasInstance](l) {
      return l && typeof l == "object" && typeof l.constructor == "function" && (typeof l.stream == "function" || typeof l.arrayBuffer == "function") && /^(Blob|File)$/.test(l[Symbol.toStringTag]);
    }
  };
  Object.defineProperties(Hn.prototype, {
    size: { enumerable: !0 },
    type: { enumerable: !0 },
    slice: { enumerable: !0 }
  });
  Ha = Hn, Re = Ha;
});

// node_modules/fetch-blob/file.js
var Ga, xa, Et, Sr = Tt(() => {
  vt();
  Ga = class extends Re {
    static {
      n(this, "File");
    }
    #e = 0;
    #t = "";
    /**
     * @param {*[]} fileBits
     * @param {string} fileName
     * @param {{lastModified?: number, type?: string}} options
     */
    // @ts-ignore
    constructor(l, u, m = {}) {
      if (arguments.length < 2)
        throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
      super(l, m), m === null && (m = {});
      let c = m.lastModified === void 0 ? Date.now() : Number(m.lastModified);
      Number.isNaN(c) || (this.#e = c), this.#t = String(u);
    }
    get name() {
      return this.#t;
    }
    get lastModified() {
      return this.#e;
    }
    get [Symbol.toStringTag]() {
      return "File";
    }
    static [Symbol.hasInstance](l) {
      return !!l && l instanceof Re && /^(File)$/.test(l[Symbol.toStringTag]);
    }
  }, xa = Ga, Et = xa;
});

// node_modules/formdata-polyfill/esm.min.js
function Si(d, l = Re) {
  var u = `${Gn()}${Gn()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), m = [], c = `--${u}\r
Content-Disposition: form-data; name="`;
  return d.forEach((w, T) => typeof w == "string" ? m.push(c + gr(T) + `"\r
\r
${w.replace(/\r(?!\n)|(?<!\r)\n/g, `\r
`)}\r
`) : m.push(c + gr(T) + `"; filename="${gr(w.name, 1)}"\r
Content-Type: ${w.type || "application/octet-stream"}\r
\r
`, w, `\r
`)), m.push(`--${u}--`), new l(m, { type: "multipart/form-data; boundary=" + u });
}
var Ve, Za, Xa, Gn, Ja, xn, gr, we, yi, Ka = Tt(() => {
  vt();
  Sr();
  ({ toStringTag: Ve, iterator: Za, hasInstance: Xa } = Symbol), Gn = Math.random, Ja = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), xn = /* @__PURE__ */ n((d, l, u) => (d += "", /^(Blob|File)$/.test(l && l[Ve]) ? [(u = u !== void 0 ? u + "" : l[Ve] == "File" ? l.name : "blob", d), l.name !== u || l[Ve] == "blob" ? new Et([l], u, l) : l] : [d, l + ""]), "f"), gr = /* @__PURE__ */ n((d, l) => (l ? d : d.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e"), we = /* @__PURE__ */ n((d, l, u) => {
    if (l.length < u)
      throw new TypeError(`Failed to execute '${d}' on 'FormData': ${u} arguments required, but only ${l.length} present.`);
  }, "x"), yi = class {
    static {
      n(this, "FormData");
    }
    #e = [];
    constructor(...l) {
      if (l.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
    }
    get [Ve]() {
      return "FormData";
    }
    [Za]() {
      return this.entries();
    }
    static [Xa](l) {
      return l && typeof l == "object" && l[Ve] === "FormData" && !Ja.some((u) => typeof l[u] != "function");
    }
    append(...l) {
      we("append", arguments, 2), this.#e.push(xn(...l));
    }
    delete(l) {
      we("delete", arguments, 1), l += "", this.#e = this.#e.filter(([u]) => u !== l);
    }
    get(l) {
      we("get", arguments, 1), l += "";
      for (var u = this.#e, m = u.length, c = 0; c < m; c++) if (u[c][0] === l) return u[c][1];
      return null;
    }
    getAll(l, u) {
      return we("getAll", arguments, 1), u = [], l += "", this.#e.forEach((m) => m[0] === l && u.push(m[1])), u;
    }
    has(l) {
      return we("has", arguments, 1), l += "", this.#e.some((u) => u[0] === l);
    }
    forEach(l, u) {
      we("forEach", arguments, 1);
      for (var [m, c] of this) l.call(u, c, m, this);
    }
    set(...l) {
      we("set", arguments, 2);
      var u = [], m = !0;
      l = xn(...l), this.#e.forEach((c) => {
        c[0] === l[0] ? m && (m = !u.push(l)) : u.push(c);
      }), m && u.push(l), this.#e = u;
    }
    *entries() {
      yield* this.#e;
    }
    *keys() {
      for (var [l] of this) yield l;
    }
    *values() {
      for (var [, l] of this) yield l;
    }
  };
  n(Si, "formDataToBlob");
});

// node_modules/node-domexception/index.js
var Xn = pr((wi, Zn) => {
  if (!globalThis.DOMException)
    try {
      let { MessageChannel: d } = Ct("worker_threads"), l = new d().port1, u = new ArrayBuffer();
      l.postMessage(u, [u, u]);
    } catch (d) {
      d.constructor.name === "DOMException" && (globalThis.DOMException = d.constructor);
    }
  Zn.exports = globalThis.DOMException;
});

// node_modules/fetch-blob/from.js
import { statSync as Jn, createReadStream as ei, promises as ti } from "node:fs";
import { basename as ri } from "node:path";
var Kn, Rr, Ei, qi, Ai, Wi, eo, to, qt, ni = Tt(() => {
  Kn = Nn(Xn(), 1);
  Sr();
  vt();
  ({ stat: Rr } = ti), Ei = /* @__PURE__ */ n((d, l) => eo(Jn(d), d, l), "blobFromSync"), qi = /* @__PURE__ */ n((d, l) => Rr(d).then((u) => eo(u, d, l)), "blobFrom"), Ai = /* @__PURE__ */ n((d, l) => Rr(d).then((u) => to(u, d, l)), "fileFrom"), Wi = /* @__PURE__ */ n((d, l) => to(Jn(d), d, l), "fileFromSync"), eo = /* @__PURE__ */ n((d, l, u = "") => new Re([new qt({
    path: l,
    size: d.size,
    lastModified: d.mtimeMs,
    start: 0
  })], { type: u }), "fromBlob"), to = /* @__PURE__ */ n((d, l, u = "") => new Et([new qt({
    path: l,
    size: d.size,
    lastModified: d.mtimeMs,
    start: 0
  })], ri(l), { type: u, lastModified: d.mtimeMs }), "fromFile"), qt = class d {
    static {
      n(this, "BlobDataItem");
    }
    #e;
    #t;
    constructor(l) {
      this.#e = l.path, this.#t = l.start, this.size = l.size, this.lastModified = l.lastModified;
    }
    /**
     * Slicing arguments is first validated and formatted
     * to not be out of range by Blob.prototype.slice
     */
    slice(l, u) {
      return new d({
        path: this.#e,
        lastModified: this.lastModified,
        size: u - l,
        start: this.#t + l
      });
    }
    async *stream() {
      let { mtimeMs: l } = await Rr(this.#e);
      if (l > this.lastModified)
        throw new Kn.default("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
      yield* ei(this.#e, {
        start: this.#t,
        end: this.#t + this.size - 1
      });
    }
    get [Symbol.toStringTag]() {
      return "Blob";
    }
  };
});

export {
  Re as a,
  vt as b,
  Et as c,
  yi as d,
  Si as e,
  Ka as f,
  Ei as g,
  qi as h,
  Ai as i,
  Wi as j,
  ni as k
};
/*! Bundled license information:

web-streams-polyfill/dist/ponyfill.es2018.js:
  (**
   * @license
   * web-streams-polyfill v3.3.3
   * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
   * This code is released under the MIT license.
   * SPDX-License-Identifier: MIT
   *)

fetch-blob/index.js:
  (*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

formdata-polyfill/esm.min.js:
  (*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)

node-domexception/index.js:
  (*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)
*/
//# sourceMappingURL=HRR3KFHV.js.map
