npx vitest __tests__/convex/apiKeys.integration.test.ts --run

 RUN  v4.0.16 C:/Users/josia/Desktop/Anti_MartAI/MartAI

 ❯ __tests__/convex/apiKeys.integration.test.ts (2 tests | 2 failed) 16ms
   ❯ API Keys (2)
     × should prevent non-enterprise users from creating keys 14ms
     × should allow enterprise users to create, list, validate, and revoke keys 2ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  __tests__/convex/apiKeys.integration.test.ts > API Keys > should prevent non-enterprise users from creating keys
Error: Validator error: Unexpected field `planId` in object
 ❯ performAsyncSyscall node_modules/convex/dist/esm/server/impl/syscall.js:28:11
 ❯ insert node_modules/convex/dist/esm/server/impl/database_impl.js:70:23
 ❯ Object.insert node_modules/convex/dist/esm/server/impl/database_impl.js:110:14
 ❯ __tests__/convex/apiKeys.integration.test.ts:23:7
     21|     // Seed a standard subscription
     22|     await t.run(async (ctx) => {
     23|       await ctx.db.insert('subscriptions', {
       |       ^
     24|         userId,
     25|         stripeCustomerId: 'cus_123',
 ❯ invokeFunction node_modules/convex/dist/esm/server/impl/registration_impl.js:50:14
 ❯ invokeMutation node_modules/convex/dist/esm/server/impl/registration_impl.js:36:18
 ❯ runTransaction node_modules/convex-test/dist/index.js:1215:31
 ❯ handler node_modules/convex-test/dist/index.js:1292:24
 ❯ invokeFunction node_modules/convex/dist/esm/server/impl/registration_impl.js:50:14

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  __tests__/convex/apiKeys.integration.test.ts > API Keys > should allow enterprise users to create, list, validate, and revoke keys
Error: Validator error: Unexpected field `planId` in object
 ❯ performAsyncSyscall node_modules/convex/dist/esm/server/impl/syscall.js:28:11
 ❯ insert node_modules/convex/dist/esm/server/impl/database_impl.js:70:23
 ❯ Object.insert node_modules/convex/dist/esm/server/impl/database_impl.js:110:14
 ❯ __tests__/convex/apiKeys.integration.test.ts:72:7
     70|     // Seed an enterprise subscription
     71|     await t.run(async (ctx) => {
     72|       await ctx.db.insert('subscriptions', {
       |       ^
     73|         userId,
     74|         stripeCustomerId: 'cus_ent',
 ❯ invokeFunction node_modules/convex/dist/esm/server/impl/registration_impl.js:50:14
 ❯ invokeMutation node_modules/convex/dist/esm/server/impl/registration_impl.js:36:18
 ❯ runTransaction node_modules/convex-test/dist/index.js:1215:31
 ❯ handler node_modules/convex-test/dist/index.js:1292:24
 ❯ invokeFunction node_modules/convex/dist/esm/server/impl/registration_impl.js:50:14

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed (2)
   Start at  03:49:34
   Duration  343ms (transform 127ms, setup 0ms, import 228ms, tests 16ms, environment 0ms)

