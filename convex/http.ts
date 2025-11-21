// @ts-nocheck
// HTTP action to handle scheduled publishing
// This can be called by external cron or webhook
// @ts-nocheck
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const checkScheduledPosts = httpAction(async (ctx, request) => {
  // Verify this is called by authorized source (cron, webhook, etc.)
  const authHeader = request.headers.get("authorization");
  const expectedAuth = process.env.CRON_SECRET || "your-cron-secret";
  
  if (authHeader !== `Bearer ${expectedAuth}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get all scheduled posts that are due
  const now = Date.now();
  let scheduledPosts = [];
  try {
    scheduledPosts = await ctx.runQuery(internal.scheduledPosts.getDuePosts, {
      beforeTime: now,
    });
  } catch (error) {
    console.error('Error getting due posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to get due posts' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Publish each due post
  for (const post of scheduledPosts) {
    if (post.status === 'scheduled') {
      await ctx.runMutation(internal.scheduledPosts.publishPost, {
        postId: post._id,
      });
    }
  }

  return new Response(JSON.stringify({ 
    processed: scheduledPosts.length 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

