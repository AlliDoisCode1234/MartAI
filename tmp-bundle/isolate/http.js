import {
  b as s
} from "./_deps/R4KVEYWB.js";
import {
  a as h
} from "./_deps/ZPFFT4DL.js";
import {
  a as p
} from "./_deps/WX3RPBOB.js";
import {
  c as r,
  e as m
} from "./_deps/GTU362KY.js";
import {
  a as e
} from "./_deps/OFY2WAT7.js";
import "./_deps/ZRD5YQUR.js";
import "./_deps/K33OSGN4.js";
import {
  s as o,
  x as d
} from "./_deps/4U34M3I6.js";
import "./_deps/RUVYHBJQ.js";

// convex/http.ts
d();
m();
var t = o();
e.addHttpRoutes(t);
t.route({
  path: "/check-scheduled-posts",
  method: "POST",
  handler: h
});
t.route({
  path: "/publish-scheduled-post",
  method: "POST",
  handler: p
});
s(t, r.stripe, {
  webhookPath: "/stripe/webhook"
});
var n = t;
export {
  n as default
};
//# sourceMappingURL=http.js.map
