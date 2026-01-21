import {
  d as c,
  e as p,
  f as h
} from "../../_deps/JHUXVXCX.js";
import "../../_deps/HHELKCCM.js";
import "../../_deps/YW3B7PJC.js";
import "../../_deps/GTU362KY.js";
import {
  a as d
} from "../../_deps/OFY2WAT7.js";
import "../../_deps/ZRD5YQUR.js";
import {
  e as i
} from "../../_deps/K33OSGN4.js";
import {
  c as e,
  e as l
} from "../../_deps/4U34M3I6.js";
import {
  a as n
} from "../../_deps/RUVYHBJQ.js";

// convex/phoo/agent/chat.ts
l();
var f = i({
  args: {
    projectId: e.optional(e.id("projects")),
    initialMessage: e.optional(e.string())
  },
  handler: /* @__PURE__ */ n(async (s, r) => {
    let t = await d.getUserId(s), o = t ? c : p, { threadId: a, thread: g } = await o.createThread(s, {
      userId: t ?? void 0
    });
    if (r.initialMessage) {
      let u = await g.generateText({
        prompt: r.initialMessage,
        // Only provide tools for authenticated users
        ...t ? { tools: h } : {}
      });
      return {
        threadId: a,
        response: u.text,
        isAuthenticated: !!t
      };
    }
    return {
      threadId: a,
      response: null,
      isAuthenticated: !!t
    };
  }, "handler")
}), j = i({
  args: {
    threadId: e.string(),
    message: e.string(),
    projectId: e.optional(e.id("projects"))
  },
  handler: /* @__PURE__ */ n(async (s, r) => {
    let t = await d.getUserId(s), o = t ? c : p, { thread: a } = await o.continueThread(s, {
      threadId: r.threadId
    });
    return {
      response: (await a.generateText({
        prompt: r.message,
        // Only provide tools for authenticated users
        ...t ? { tools: h } : {}
      })).text,
      isAuthenticated: !!t
    };
  }, "handler")
}), x = i({
  args: {
    threadId: e.string(),
    message: e.string(),
    projectId: e.optional(e.id("projects"))
  },
  handler: /* @__PURE__ */ n(async (s, r) => {
    let t = await d.getUserId(s), o = t ? c : p, { thread: a } = await o.continueThread(s, {
      threadId: r.threadId
    });
    return {
      response: (await a.streamText({
        prompt: r.message,
        // Only provide tools for authenticated users
        ...t ? { tools: h } : {}
      })).text,
      isAuthenticated: !!t
    };
  }, "handler")
});
export {
  f as createThread,
  j as sendMessage,
  x as streamMessage
};
//# sourceMappingURL=chat.js.map
