import {
  c as U,
  d as w,
  f as Y,
  k as x
} from "./HRR3KFHV.js";
import {
  a as E,
  c as V
} from "./V7X2J7BI.js";

// node_modules/node-fetch/src/utils/multipart-parser.js
function Z(H) {
  let o = H.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!o)
    return;
  let n = o[2] || o[3] || "", r = n.slice(n.lastIndexOf("\\") + 1);
  return r = r.replace(/%22/g, '"'), r = r.replace(/&#(\d{4});/g, (d, l) => String.fromCharCode(l)), r;
}
async function G(H, o) {
  if (!/multipart/i.test(o))
    throw new TypeError("Failed to fetch");
  let n = o.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!n)
    throw new TypeError("no or bad content-type header, no multipart boundary");
  let r = new k(n[1] || n[2]), d, l, c, b, e, i, A = [], L = new w(), O = /* @__PURE__ */ E((s) => {
    c += f.decode(s, { stream: !0 });
  }, "onPartData"), y = /* @__PURE__ */ E((s) => {
    A.push(s);
  }, "appendToFile"), a = /* @__PURE__ */ E(() => {
    let s = new U(A, i, { type: e });
    L.append(b, s);
  }, "appendFileToFormData"), P = /* @__PURE__ */ E(() => {
    L.append(b, c);
  }, "appendEntryToFormData"), f = new TextDecoder("utf-8");
  f.decode(), r.onPartBegin = function() {
    r.onPartData = O, r.onPartEnd = P, d = "", l = "", c = "", b = "", e = "", i = null, A.length = 0;
  }, r.onHeaderField = function(s) {
    d += f.decode(s, { stream: !0 });
  }, r.onHeaderValue = function(s) {
    l += f.decode(s, { stream: !0 });
  }, r.onHeaderEnd = function() {
    if (l += f.decode(), d = d.toLowerCase(), d === "content-disposition") {
      let s = l.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      s && (b = s[2] || s[3] || ""), i = Z(l), i && (r.onPartData = y, r.onPartEnd = a);
    } else d === "content-type" && (e = l);
    l = "", d = "";
  };
  for await (let s of H)
    r.write(s);
  return r.end(), L;
}
var D, t, B, R, g, N, C, p, I, M, $, v, u, k, j = V(() => {
  x();
  Y();
  D = 0, t = {
    START_BOUNDARY: D++,
    HEADER_FIELD_START: D++,
    HEADER_FIELD: D++,
    HEADER_VALUE_START: D++,
    HEADER_VALUE: D++,
    HEADER_VALUE_ALMOST_DONE: D++,
    HEADERS_ALMOST_DONE: D++,
    PART_DATA_START: D++,
    PART_DATA: D++,
    END: D++
  }, B = 1, R = {
    PART_BOUNDARY: B,
    LAST_BOUNDARY: B *= 2
  }, g = 10, N = 13, C = 32, p = 45, I = 58, M = 97, $ = 122, v = /* @__PURE__ */ E((H) => H | 32, "lower"), u = /* @__PURE__ */ E(() => {
  }, "noop"), k = class {
    static {
      E(this, "MultipartParser");
    }
    /**
     * @param {string} boundary
     */
    constructor(o) {
      this.index = 0, this.flags = 0, this.onHeaderEnd = u, this.onHeaderField = u, this.onHeadersEnd = u, this.onHeaderValue = u, this.onPartBegin = u, this.onPartData = u, this.onPartEnd = u, this.boundaryChars = {}, o = `\r
--` + o;
      let n = new Uint8Array(o.length);
      for (let r = 0; r < o.length; r++)
        n[r] = o.charCodeAt(r), this.boundaryChars[n[r]] = !0;
      this.boundary = n, this.lookbehind = new Uint8Array(this.boundary.length + 8), this.state = t.START_BOUNDARY;
    }
    /**
     * @param {Uint8Array} data
     */
    write(o) {
      let n = 0, r = o.length, d = this.index, { lookbehind: l, boundary: c, boundaryChars: b, index: e, state: i, flags: A } = this, L = this.boundary.length, O = L - 1, y = o.length, a, P, f = /* @__PURE__ */ E((h) => {
        this[h + "Mark"] = n;
      }, "mark"), s = /* @__PURE__ */ E((h) => {
        delete this[h + "Mark"];
      }, "clear"), T = /* @__PURE__ */ E((h, m, _, F) => {
        (m === void 0 || m !== _) && this[h](F && F.subarray(m, _));
      }, "callback"), S = /* @__PURE__ */ E((h, m) => {
        let _ = h + "Mark";
        _ in this && (m ? (T(h, this[_], n, o), delete this[_]) : (T(h, this[_], o.length, o), this[_] = 0));
      }, "dataCallback");
      for (n = 0; n < r; n++)
        switch (a = o[n], i) {
          case t.START_BOUNDARY:
            if (e === c.length - 2) {
              if (a === p)
                A |= R.LAST_BOUNDARY;
              else if (a !== N)
                return;
              e++;
              break;
            } else if (e - 1 === c.length - 2) {
              if (A & R.LAST_BOUNDARY && a === p)
                i = t.END, A = 0;
              else if (!(A & R.LAST_BOUNDARY) && a === g)
                e = 0, T("onPartBegin"), i = t.HEADER_FIELD_START;
              else
                return;
              break;
            }
            a !== c[e + 2] && (e = -2), a === c[e + 2] && e++;
            break;
          case t.HEADER_FIELD_START:
            i = t.HEADER_FIELD, f("onHeaderField"), e = 0;
          // falls through
          case t.HEADER_FIELD:
            if (a === N) {
              s("onHeaderField"), i = t.HEADERS_ALMOST_DONE;
              break;
            }
            if (e++, a === p)
              break;
            if (a === I) {
              if (e === 1)
                return;
              S("onHeaderField", !0), i = t.HEADER_VALUE_START;
              break;
            }
            if (P = v(a), P < M || P > $)
              return;
            break;
          case t.HEADER_VALUE_START:
            if (a === C)
              break;
            f("onHeaderValue"), i = t.HEADER_VALUE;
          // falls through
          case t.HEADER_VALUE:
            a === N && (S("onHeaderValue", !0), T("onHeaderEnd"), i = t.HEADER_VALUE_ALMOST_DONE);
            break;
          case t.HEADER_VALUE_ALMOST_DONE:
            if (a !== g)
              return;
            i = t.HEADER_FIELD_START;
            break;
          case t.HEADERS_ALMOST_DONE:
            if (a !== g)
              return;
            T("onHeadersEnd"), i = t.PART_DATA_START;
            break;
          case t.PART_DATA_START:
            i = t.PART_DATA, f("onPartData");
          // falls through
          case t.PART_DATA:
            if (d = e, e === 0) {
              for (n += O; n < y && !(o[n] in b); )
                n += L;
              n -= O, a = o[n];
            }
            if (e < c.length)
              c[e] === a ? (e === 0 && S("onPartData", !0), e++) : e = 0;
            else if (e === c.length)
              e++, a === N ? A |= R.PART_BOUNDARY : a === p ? A |= R.LAST_BOUNDARY : e = 0;
            else if (e - 1 === c.length)
              if (A & R.PART_BOUNDARY) {
                if (e = 0, a === g) {
                  A &= ~R.PART_BOUNDARY, T("onPartEnd"), T("onPartBegin"), i = t.HEADER_FIELD_START;
                  break;
                }
              } else A & R.LAST_BOUNDARY && a === p ? (T("onPartEnd"), i = t.END, A = 0) : e = 0;
            if (e > 0)
              l[e - 1] = a;
            else if (d > 0) {
              let h = new Uint8Array(l.buffer, l.byteOffset, l.byteLength);
              T("onPartData", 0, d, h), d = 0, f("onPartData"), n--;
            }
            break;
          case t.END:
            break;
          default:
            throw new Error(`Unexpected state entered: ${i}`);
        }
      S("onHeaderField"), S("onHeaderValue"), S("onPartData"), this.index = e, this.state = i, this.flags = A;
    }
    end() {
      if (this.state === t.HEADER_FIELD_START && this.index === 0 || this.state === t.PART_DATA && this.index === this.boundary.length)
        this.onPartEnd();
      else if (this.state !== t.END)
        throw new Error("MultipartParser.end(): stream ended unexpectedly");
    }
  };
  E(Z, "_fileName");
  E(G, "toFormData");
});
j();
export {
  G as toFormData
};
//# sourceMappingURL=ONVEAPKL.js.map
