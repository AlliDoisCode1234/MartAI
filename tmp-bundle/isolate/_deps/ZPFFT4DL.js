import {
  b as e,
  e as c
} from "./GTU362KY.js";
import {
  g as n
} from "./K33OSGN4.js";

// convex/http/checkScheduledPosts.ts
c();
var p = n(async (t, r) => {
  let i = r.headers.get("authorization"), u = process.env.CRON_SECRET || "your-cron-secret";
  if (i !== `Bearer ${u}`)
    return new Response("Unauthorized", { status: 401 });
  let a = Date.now(), s = await t.runQuery(
    e.publishing.scheduledPosts.getDuePosts,
    { beforeTime: a }
  );
  for (let o of s)
    o.status === "scheduled" && await t.runMutation(
      e.publishing.scheduledPosts.publishPost,
      { postId: o._id }
    );
  return new Response(
    JSON.stringify({ processed: s.length }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
});

export {
  p as a
};
//# sourceMappingURL=ZPFFT4DL.js.map
