import {
  b as e,
  d as i
} from "./_deps/K33OSGN4.js";
import {
  c as t,
  e as s
} from "./_deps/4U34M3I6.js";
import {
  a as r
} from "./_deps/RUVYHBJQ.js";

// convex/aiStorage.ts
s();
var l = e({
  args: {
    inputHash: t.string()
  },
  handler: /* @__PURE__ */ r(async (n, o) => await n.db.query("aiGenerations").withIndex("by_hash", (a) => a.eq("inputHash", o.inputHash)).first(), "handler")
}), d = i({
  args: {
    inputHash: t.string(),
    operation: t.string(),
    provider: t.optional(t.string()),
    model: t.optional(t.string()),
    inputArgs: t.any(),
    output: t.any(),
    tokensIn: t.optional(t.number()),
    tokensOut: t.optional(t.number()),
    cost: t.optional(t.number()),
    metadata: t.optional(t.any())
  },
  handler: /* @__PURE__ */ r(async (n, o) => {
    await n.db.insert("aiGenerations", {
      ...o,
      createdAt: Date.now()
    });
  }, "handler")
});
export {
  l as getStored,
  d as store
};
//# sourceMappingURL=aiStorage.js.map
