import { httpRouter } from "convex/server";
import { checkScheduledPosts } from "./http/checkScheduledPosts";

const http = httpRouter();

http.route({
  path: "/check-scheduled-posts",
  method: "POST",
  handler: checkScheduledPosts,
});

export default http;
