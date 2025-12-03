import { internalQuery } from "../_generated/server";

export const getAllProjectsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});
