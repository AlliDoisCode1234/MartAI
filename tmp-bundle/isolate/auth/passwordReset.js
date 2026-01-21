import {
  a as i,
  c as w,
  d as l
} from "../_deps/K33OSGN4.js";
import {
  c as d,
  e as c
} from "../_deps/4U34M3I6.js";
import {
  a
} from "../_deps/RUVYHBJQ.js";

// convex/auth/passwordReset.ts
c();
async function u(r) {
  let n = new TextEncoder().encode(r), e = await crypto.subtle.digest("SHA-256", n);
  return Array.from(new Uint8Array(e)).map((o) => o.toString(16).padStart(2, "0")).join("");
}
a(u, "hashToken");
var p = i({
  args: {
    token: d.string()
  },
  handler: /* @__PURE__ */ a(async (r, s) => {
    let n = await u(s.token), e = await r.db.query("passwordResetTokens").withIndex("by_token_hash", (o) => o.eq("tokenHash", n)).first();
    if (!e)
      return { valid: !1, reason: "invalid" };
    if (e.usedAt)
      return { valid: !1, reason: "used" };
    if (Date.now() > e.expiresAt)
      return { valid: !1, reason: "expired" };
    let t = await r.db.get(e.userId);
    return {
      valid: !0,
      userId: e.userId,
      email: t?.email
    };
  }, "handler")
}), k = w({
  args: {
    token: d.string(),
    newPassword: d.string()
  },
  handler: /* @__PURE__ */ a(async (r, s) => {
    if (s.newPassword.length < 8)
      throw new Error("Password must be at least 8 characters");
    let n = await u(s.token), e = await r.db.query("passwordResetTokens").withIndex("by_token_hash", (o) => o.eq("tokenHash", n)).first();
    if (!e)
      throw new Error("Invalid reset token");
    if (e.usedAt)
      throw new Error("This reset link has already been used");
    if (Date.now() > e.expiresAt)
      throw new Error("This reset link has expired");
    let t = await r.db.get(e.userId);
    if (!t)
      throw new Error("User not found");
    return await r.db.patch(e._id, {
      usedAt: Date.now()
    }), await r.db.patch(e.userId, {
      passwordHash: void 0,
      updatedAt: Date.now()
    }), console.log(`[PasswordReset] Password reset completed for user ${e.userId}`), {
      success: !0,
      email: t.email
    };
  }, "handler")
}), y = l({
  args: {},
  handler: /* @__PURE__ */ a(async (r) => {
    let s = Date.now(), n = await r.db.query("passwordResetTokens").filter((t) => t.lt(t.field("expiresAt"), s - 1440 * 60 * 1e3)).collect(), e = 0;
    for (let t of n)
      await r.db.delete(t._id), e++;
    return e > 0 && console.log(`[PasswordReset] Cleaned up ${e} expired tokens`), { deleted: e };
  }, "handler")
});
export {
  y as cleanupExpiredTokens,
  k as resetPassword,
  p as validateToken
};
//# sourceMappingURL=passwordReset.js.map
