/**
 * HTTP endpoint to seed admin user
 * POST /seed-admin
 * Body: { email: string, password: string, name?: string }
 * 
 * This is a development-only endpoint.
 * In production, use the Convex dashboard Functions tab to call auth.seed.createAdminUser
 */

import { httpRouter } from "convex/server";
import { internal } from "../_generated/api";
import { httpAction } from "../_generated/server";

const router = httpRouter();

router.route({
  path: "/seed-admin",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Only allow in development or if explicitly enabled
    const isDev = process.env.NODE_ENV === "development" || process.env.ENABLE_SEED === "true";
    
    if (!isDev) {
      return new Response(
        JSON.stringify({ error: "Seed endpoint disabled in production" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const body = await request.json();
      const { email, password, name } = body;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email and password are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Call the internal mutation
      const result = await ctx.runMutation(internal.auth.seed.createAdminUser, {
        email,
        password,
        name,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Admin user created successfully",
          user: {
            userId: result.userId,
            email: result.email,
            role: result.role,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          error: error.message || "Failed to create admin user",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default router;

