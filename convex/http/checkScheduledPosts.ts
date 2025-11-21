import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const checkScheduledPosts = httpAction(async (ctx, request) => {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = process.env.CRON_SECRET || "your-cron-secret";

  if (authHeader !== `Bearer ${expectedAuth}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = Date.now();

  const scheduledPosts = await ctx.runQuery(
    internal.publishing.scheduledPosts.getDuePosts,
    { beforeTime: now }
  );

  for (const post of scheduledPosts) {
    if (post.status === "scheduled") {
      await ctx.runMutation(
        internal.publishing.scheduledPosts.publishPost,
        { postId: post._id }
      );
    }
  }

  return new Response(
    JSON.stringify({ processed: scheduledPosts.length }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});
