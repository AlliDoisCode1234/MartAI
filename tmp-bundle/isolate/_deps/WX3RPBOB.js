import {
  a as n,
  e as y
} from "./GTU362KY.js";
import {
  g as o
} from "./K33OSGN4.js";

// convex/http/publishScheduledPost.ts
y();
var E = o(async (i, r) => {
  let a = r.headers.get("authorization"), p = process.env.CRON_SECRET || "your-cron-secret";
  if (a !== `Bearer ${p}`)
    return new Response("Unauthorized", { status: 401 });
  let c = await r.json(), { postId: s } = c;
  if (!s)
    return new Response(JSON.stringify({ error: "postId required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  try {
    let e = await i.runQuery(n.publishing.scheduledPosts.getScheduledPostById, {
      postId: s
    });
    if (!e || e.status !== "scheduled")
      return new Response(
        JSON.stringify({ error: "Post not found or not scheduled" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    let u = `${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/publish/trigger`, d = process.env.CRON_SECRET || "your-cron-secret", t = await fetch(u, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${d}`
      },
      body: JSON.stringify({ postId: e._id })
    });
    if (!t.ok) {
      let l = await t.text();
      throw new Error(`Publish API error: ${l}`);
    }
    let h = await t.json();
    return new Response(JSON.stringify({ success: !0, result: h }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return console.error("Error in publishScheduledPost:", e), new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});

export {
  E as a
};
//# sourceMappingURL=WX3RPBOB.js.map
