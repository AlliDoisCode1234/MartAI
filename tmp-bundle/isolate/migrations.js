import {
  d
} from "./_deps/K33OSGN4.js";
import "./_deps/4U34M3I6.js";
import {
  a
} from "./_deps/RUVYHBJQ.js";

// convex/migrations.ts
var s = d({
  args: {},
  handler: /* @__PURE__ */ a(async (o) => {
    let n = await o.db.query("keywords").collect(), t = 0;
    for (let e of n) {
      let r = e;
      r.clientId && !r.projectId && (await o.db.delete(e._id), t++);
    }
    return { updatedCount: t };
  }, "handler")
});
export {
  s as fixKeywordsSchema
};
//# sourceMappingURL=migrations.js.map
