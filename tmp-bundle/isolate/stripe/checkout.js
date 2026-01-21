import {
  a as d
} from "../_deps/R4KVEYWB.js";
import {
  c as o,
  e as m
} from "../_deps/GTU362KY.js";
import {
  a as c,
  e as u
} from "../_deps/K33OSGN4.js";
import {
  c as t,
  e as p
} from "../_deps/4U34M3I6.js";
import {
  a as n
} from "../_deps/RUVYHBJQ.js";

// convex/stripe/checkout.ts
m();
p();
var i = new d(o.stripe, {}), w = u({
  args: {
    priceId: t.string()
  },
  returns: t.object({
    sessionId: t.string(),
    url: t.union(t.string(), t.null())
  }),
  handler: /* @__PURE__ */ n(async (e, s) => {
    let r = await e.auth.getUserIdentity();
    if (!r)
      throw new Error("Not authenticated");
    let a = await i.getOrCreateCustomer(e, {
      userId: r.subject,
      email: r.email,
      name: r.name
    });
    return await i.createCheckoutSession(e, {
      priceId: s.priceId,
      customerId: a.customerId,
      mode: "subscription",
      successUrl: `${process.env.SITE_URL ?? "http://localhost:3000"}/home?success=true`,
      cancelUrl: `${process.env.SITE_URL ?? "http://localhost:3000"}/pricing?canceled=true`,
      subscriptionMetadata: {
        userId: r.subject
      }
    });
  }, "handler")
}), b = u({
  args: {
    priceId: t.string()
  },
  returns: t.object({
    sessionId: t.string(),
    url: t.union(t.string(), t.null())
  }),
  handler: /* @__PURE__ */ n(async (e, s) => {
    let r = await e.auth.getUserIdentity();
    if (!r)
      throw new Error("Not authenticated");
    let a = await i.getOrCreateCustomer(e, {
      userId: r.subject,
      email: r.email,
      name: r.name
    });
    return await i.createCheckoutSession(e, {
      priceId: s.priceId,
      customerId: a.customerId,
      mode: "payment",
      successUrl: `${process.env.SITE_URL ?? "http://localhost:3000"}/home?success=true`,
      cancelUrl: `${process.env.SITE_URL ?? "http://localhost:3000"}/pricing?canceled=true`,
      paymentIntentMetadata: {
        userId: r.subject
      }
    });
  }, "handler")
}), S = u({
  args: {
    returnUrl: t.optional(t.string())
  },
  returns: t.object({
    url: t.string()
  }),
  handler: /* @__PURE__ */ n(async (e, s) => {
    let r = await e.auth.getUserIdentity();
    if (!r)
      throw new Error("Not authenticated");
    let a = await i.getOrCreateCustomer(e, {
      userId: r.subject,
      email: r.email,
      name: r.name
    }), l = s.returnUrl ?? `${process.env.SITE_URL ?? "http://localhost:3000"}/settings`;
    return { url: (await i.createCustomerPortalSession(e, {
      customerId: a.customerId,
      returnUrl: l
    })).url };
  }, "handler")
}), C = c({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let s = await e.auth.getUserIdentity();
    return s ? await e.runQuery(o.stripe.public.listSubscriptionsByUserId, {
      userId: s.subject
    }) : [];
  }, "handler")
}), j = c({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let s = await e.auth.getUserIdentity();
    return s ? await e.runQuery(o.stripe.public.listPaymentsByUserId, {
      userId: s.subject
    }) : [];
  }, "handler")
}), f = c({
  args: {},
  handler: /* @__PURE__ */ n(async (e) => {
    let s = await e.auth.getUserIdentity();
    return s ? await e.runQuery(o.stripe.public.listInvoicesByUserId, {
      userId: s.subject
    }) : [];
  }, "handler")
});
export {
  b as createPaymentCheckout,
  S as createPortalSession,
  w as createSubscriptionCheckout,
  f as getUserInvoices,
  j as getUserPayments,
  C as getUserSubscriptions
};
//# sourceMappingURL=checkout.js.map
