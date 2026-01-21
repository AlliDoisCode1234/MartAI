import {
  a as F,
  b as J,
  c as X,
  e as Q,
  f as q,
  g as Y,
  h as Z,
  i as K
} from "./ZRD5YQUR.js";
import {
  a as l
} from "./RUVYHBJQ.js";

// node_modules/@auth/core/providers/google.js
function M(e) {
  return {
    id: "google",
    name: "Google",
    type: "oidc",
    issuer: "https://accounts.google.com",
    style: {
      brandColor: "#1a73e8"
    },
    options: e
  };
}
l(M, "Google");

// node_modules/@auth/core/lib/utils/email.js
function ee(e) {
  let { url: r, host: s, theme: t } = e, n = s.replace(/\./g, "&#8203;."), o = t.brandColor || "#346df1", c = t.buttonText || "#fff", a = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: o,
    buttonBorder: o,
    buttonText: c
  };
  return `
<body style="background: ${a.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${a.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${a.text};">
        Sign in to <strong>${n}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${a.buttonBackground}"><a href="${r}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${a.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${a.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${a.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}
l(ee, "html");
function te({ url: e, host: r }) {
  return `Sign in to ${r}
${e}

`;
}
l(te, "text");

// node_modules/@auth/core/providers/resend.js
function _(e) {
  return {
    id: "resend",
    type: "email",
    name: "Resend",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 1440 * 60,
    async sendVerificationRequest(r) {
      let { identifier: s, provider: t, url: n, theme: o } = r, { host: c } = new URL(n), a = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${t.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: t.from,
          to: s,
          subject: `Sign in to ${c}`,
          html: ee({ url: n, host: c, theme: o }),
          text: te({ url: n, host: c })
        })
      });
      if (!a.ok)
        throw new Error("Resend error: " + JSON.stringify(await a.json()));
    },
    options: e
  };
}
l(_, "Resend");

// node_modules/@convex-dev/auth/dist/providers/ConvexCredentials.js
function se(e) {
  return {
    id: "credentials",
    type: "credentials",
    authorize: /* @__PURE__ */ l(async () => null, "authorize"),
    // @ts-expect-error Internal
    options: e
  };
}
l(se, "ConvexCredentials");

// node_modules/@oslojs/crypto/dist/subtle/index.js
function re(e, r) {
  if (e.length !== r.length)
    return !1;
  let s = 0;
  for (let t = 0; t < e.length; t++)
    s |= e[t] ^ r[t];
  return s === 0;
}
l(re, "constantTimeEqual");

// node_modules/lucia/dist/scrypt/index.js
async function ie(e, r, s) {
  let { N: t, r: n, p: o } = s, c = s.dkLen ?? 32, a = 1024 ** 3 + 1024, u = 128 * n, f = u / 4;
  if (t <= 1 || (t & t - 1) !== 0 || t >= 2 ** (u / 8) || t > 2 ** 32)
    throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");
  if (o < 0 || o > (2 ** 32 - 1) * 32 / u)
    throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");
  if (c < 0 || c > (2 ** 32 - 1) * 32)
    throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");
  let y = u * (t + o);
  if (y > a)
    throw new Error(`Scrypt: parameters too large, ${y} (128 * r * (N + p)) > ${a} (maxmem)`);
  let d = await oe(e, r, { c: 1, dkLen: u * o }), w = j(d), p = j(new Uint8Array(u * t)), x = j(new Uint8Array(u));
  for (let D = 0; D < o; D++) {
    let g = f * D;
    for (let h = 0; h < f; h++)
      p[h] = w[g + h];
    for (let h = 0, k = 0; h < t - 1; h++)
      H(p, k, p, k += f, n), await new Promise((m) => m());
    H(p, (t - 1) * f, w, g, n);
    for (let h = 0; h < t; h++) {
      let k = w[g + f - 16] % t;
      for (let m = 0; m < f; m++)
        x[m] = w[g + m] ^ p[k * f + m];
      H(x, 0, w, g, n), await new Promise((m) => m());
    }
  }
  let V = await oe(e, d, { c: 1, dkLen: c });
  return d.fill(0), p.fill(0), x.fill(0), V;
}
l(ie, "scrypt");
function i(e, r) {
  return e << r | e >>> 32 - r;
}
l(i, "rotl");
function ne(e, r, s, t, n, o) {
  let c = e[r++] ^ s[t++], a = e[r++] ^ s[t++], u = e[r++] ^ s[t++], f = e[r++] ^ s[t++], y = e[r++] ^ s[t++], d = e[r++] ^ s[t++], w = e[r++] ^ s[t++], p = e[r++] ^ s[t++], x = e[r++] ^ s[t++], V = e[r++] ^ s[t++], D = e[r++] ^ s[t++], g = e[r++] ^ s[t++], h = e[r++] ^ s[t++], k = e[r++] ^ s[t++], m = e[r++] ^ s[t++], G = e[r++] ^ s[t++], S = c, b = a, A = u, C = f, E = y, v = d, I = w, U = p, R = x, P = V, N = D, $ = g, B = h, z = k, L = m, T = G;
  for (let W = 0; W < 8; W += 2)
    E ^= i(S + B | 0, 7), R ^= i(E + S | 0, 9), B ^= i(R + E | 0, 13), S ^= i(B + R | 0, 18), P ^= i(v + b | 0, 7), z ^= i(P + v | 0, 9), b ^= i(z + P | 0, 13), v ^= i(b + z | 0, 18), L ^= i(N + I | 0, 7), A ^= i(L + N | 0, 9), I ^= i(A + L | 0, 13), N ^= i(I + A | 0, 18), C ^= i(T + $ | 0, 7), U ^= i(C + T | 0, 9), $ ^= i(U + C | 0, 13), T ^= i($ + U | 0, 18), b ^= i(S + C | 0, 7), A ^= i(b + S | 0, 9), C ^= i(A + b | 0, 13), S ^= i(C + A | 0, 18), I ^= i(v + E | 0, 7), U ^= i(I + v | 0, 9), E ^= i(U + I | 0, 13), v ^= i(E + U | 0, 18), $ ^= i(N + P | 0, 7), R ^= i($ + N | 0, 9), P ^= i(R + $ | 0, 13), N ^= i(P + R | 0, 18), B ^= i(T + L | 0, 7), z ^= i(B + T | 0, 9), L ^= i(z + B | 0, 13), T ^= i(L + z | 0, 18);
  n[o++] = c + S | 0, n[o++] = a + b | 0, n[o++] = u + A | 0, n[o++] = f + C | 0, n[o++] = y + E | 0, n[o++] = d + v | 0, n[o++] = w + I | 0, n[o++] = p + U | 0, n[o++] = x + R | 0, n[o++] = V + P | 0, n[o++] = D + N | 0, n[o++] = g + $ | 0, n[o++] = h + B | 0, n[o++] = k + z | 0, n[o++] = m + L | 0, n[o++] = G + T | 0;
}
l(ne, "XorAndSalsa");
async function oe(e, r, s) {
  let t = await crypto.subtle.importKey("raw", e, "PBKDF2", !1, ["deriveBits"]), n = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt: r,
    iterations: s.c
  }, t, s.dkLen * 8);
  return new Uint8Array(n);
}
l(oe, "pbkdf2");
function H(e, r, s, t, n) {
  let o = t + 0, c = t + 16 * n;
  for (let a = 0; a < 16; a++)
    s[c + a] = e[r + (2 * n - 1) * 16 + a];
  for (let a = 0; a < n; a++, o += 16, r += 16)
    ne(s, c, e, r, s, o), a > 0 && (c += 16), ne(s, o, e, r += 16, s, c);
}
l(H, "BlockMix");
function j(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
l(j, "u32");

// node_modules/lucia/dist/crypto.js
async function ae(e, r, s = 16) {
  let t = new TextEncoder().encode(e), n = new TextEncoder().encode(r), o = await ie(t, n, {
    N: 16384,
    r: s,
    p: 1,
    dkLen: 64
  });
  return new Uint8Array(o);
}
l(ae, "generateScryptKey");
var O = class {
  static {
    l(this, "Scrypt");
  }
  async hash(r) {
    let s = F(crypto.getRandomValues(new Uint8Array(16))), t = await ae(r.normalize("NFKC"), s);
    return `${s}:${F(t)}`;
  }
  async verify(r, s) {
    let t = r.split(":");
    if (t.length !== 2)
      return !1;
    let [n, o] = t, c = await ae(s.normalize("NFKC"), n);
    return re(c, J(o));
  }
};

// node_modules/@convex-dev/auth/dist/providers/Password.js
function le(e = {}) {
  let r = e.id ?? "password";
  return se({
    id: "password",
    authorize: /* @__PURE__ */ l(async (s, t) => {
      let n = s.flow, o = n === "signUp" ? s.password : n === "reset-verification" ? s.newPassword : null;
      o !== null && (e.validatePasswordRequirements !== void 0 ? e.validatePasswordRequirements(o) : ue(o));
      let c = e.profile?.(s, t) ?? fe(s), { email: a } = c, u = s.password, f, y;
      if (n === "signUp") {
        if (u === void 0)
          throw new Error("Missing `password` param for `signUp` flow");
        ({ account: f, user: y } = await Q(t, {
          provider: r,
          account: { id: a, secret: u },
          profile: c,
          shouldLinkViaEmail: e.verify !== void 0,
          shouldLinkViaPhone: !1
        }));
      } else if (n === "signIn") {
        if (u === void 0)
          throw new Error("Missing `password` param for `signIn` flow");
        let d = await q(t, {
          provider: r,
          account: { id: a, secret: u }
        });
        if (d === null)
          throw new Error("Invalid credentials");
        ({ account: f, user: y } = d);
      } else if (n === "reset") {
        if (!e.reset)
          throw new Error(`Password reset is not enabled for ${r}`);
        let { account: d } = await q(t, {
          provider: r,
          account: { id: a }
        });
        return await K(t, e.reset, {
          accountId: d._id,
          params: s
        });
      } else if (n === "reset-verification") {
        if (!e.reset)
          throw new Error(`Password reset is not enabled for ${r}`);
        if (s.newPassword === void 0)
          throw new Error("Missing `newPassword` param for `reset-verification` flow");
        let d = await K(t, e.reset, { params: s });
        if (d === null)
          throw new Error("Invalid code");
        let { userId: w, sessionId: p } = d, x = s.newPassword;
        return await Y(t, {
          provider: r,
          account: { id: a, secret: x }
        }), await Z(t, { userId: w, except: [p] }), { userId: w, sessionId: p };
      } else if (n === "email-verification") {
        if (!e.verify)
          throw new Error(`Email verification is not enabled for ${r}`);
        let { account: d } = await q(t, {
          provider: r,
          account: { id: a }
        });
        return await K(t, e.verify, {
          accountId: d._id,
          params: s
        });
      } else
        throw new Error('Missing `flow` param, it must be one of "signUp", "signIn", "reset", "reset-verification" or "email-verification"!');
      return e.verify && !f.emailVerified ? await K(t, e.verify, {
        accountId: f._id,
        params: s
      }) : { userId: y._id };
    }, "authorize"),
    crypto: {
      async hashSecret(s) {
        return await new O().hash(s);
      },
      async verifySecret(s, t) {
        return await new O().verify(t, s);
      }
    },
    extraProviders: [e.reset, e.verify],
    ...e
  });
}
l(le, "Password");
function ue(e) {
  if (!e || e.length < 8)
    throw new Error("Invalid password");
}
l(ue, "validateDefaultPasswordRequirements");
function fe(e) {
  return {
    email: e.email
  };
}
l(fe, "defaultProfile");

// convex/auth.ts
var he = process.env.RESEND_FROM_EMAIL || "Phoo <onboarding@resend.dev>", { auth: mt, signIn: wt, signOut: yt, store: xt } = X({
  providers: [
    M({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    // TODO: Re-enable email verification for production after domain is verified
    // Password({ verify: Resend({ from: RESEND_FROM }) }),
    le,
    // No email verification for dev
    // Standalone Resend for magic link login
    _({
      id: "resend",
      from: he
    })
  ]
});

export {
  mt as a,
  wt as b,
  yt as c,
  xt as d
};
//# sourceMappingURL=OFY2WAT7.js.map
