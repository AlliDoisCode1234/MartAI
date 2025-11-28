import { httpAction } from "../_generated/server";
import { internal } from "../_generated/api";

/**
 * HTTP action to publish a scheduled post
 * Called by Convex scheduler when a post is due
 */
export const publishScheduledPost = httpAction(async (ctx, request) => {
  const authHeader = request.headers.get("authorization");
  const expectedAuth = process.env.CRON_SECRET || "your-cron-secret";

  // Verify this is called internally (from Convex scheduler)
  if (authHeader !== `Bearer ${expectedAuth}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { postId } = body;

  if (!postId) {
    return new Response(JSON.stringify({ error: "postId required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the post
    const post = await ctx.runQuery(internal.publishing.scheduledPosts.getScheduledPostById, {
      postId,
    });

    if (!post || post.status !== "scheduled") {
      return new Response(
        JSON.stringify({ error: "Post not found or not scheduled" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the Next.js app URL from environment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000";

    // Call the Next.js API to actually publish
    const publishUrl = `${appUrl}/api/publish/trigger`;
    const cronSecret = process.env.CRON_SECRET || "your-cron-secret";

    const response = await fetch(publishUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({ postId: post._id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Publish API error: ${errorText}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in publishScheduledPost:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

