# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: signup-flow.spec.ts >> Signup to Studio Flow >> Complete onboarding journey using Swarm seed credentials
- Location: tests\e2e\signup-flow.spec.ts:4:7

# Error details

```
Error: page.evaluate: Error: [CONVEX A(auth:signIn)] [Request ID: 9f8655527f959554] Server Error
Uncaught Error: Provider `test-password` is not configured, available providers are `google`, `password`, `resend`.

  Called by client
    at BaseConvexClient.action (webpack-internal:///(app-pages-browser)/./node_modules/convex/dist/esm/browser/sync/client.js:651:13)
    at async eval (webpack-internal:///(app-pages-browser)/./node_modules/@convex-dev/auth/dist/react/client.js:153:24)
    at async eval (eval at evaluate (:302:30), <anonymous>:5:7)
    at async <anonymous>:328:30
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - heading "Welcome to Phoo" [level=2] [ref=e6]
    - paragraph [ref=e7]: Sign in to your account to continue
    - button "Sign in with Google" [ref=e8] [cursor=pointer]:
      - img [ref=e10]
      - text: Sign in with Google
    - generic [ref=e12]:
      - separator [ref=e13]
      - paragraph [ref=e14]: OR CONTINUE WITH EMAIL
      - separator [ref=e15]
    - generic [ref=e16]:
      - tablist [ref=e17]:
        - tab "Password" [selected] [ref=e18] [cursor=pointer]:
          - img [ref=e19]
          - text: Password
        - tab "Email Link" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
          - text: Email Link
      - tabpanel "Password" [ref=e27]:
        - generic [ref=e29]:
          - group [ref=e30]:
            - generic [ref=e31]: Email*
            - textbox "Email" [ref=e32]:
              - /placeholder: Enter your email
          - group [ref=e33]:
            - generic [ref=e34]: Password*
            - textbox "Password" [ref=e35]:
              - /placeholder: Enter your password
          - paragraph [ref=e36]:
            - link "Forgot password?" [ref=e37] [cursor=pointer]:
              - /url: /auth/forgot-password
          - button "Sign In" [ref=e38] [cursor=pointer]
    - paragraph [ref=e39]:
      - text: Don't have an account?
      - link "Sign up" [ref=e40] [cursor=pointer]:
        - /url: /auth/signup
  - generic [ref=e42] [cursor=pointer]:
    - button "Minimize" [ref=e43]:
      - img [ref=e44]
    - paragraph [ref=e49]: Need help?
  - generic [ref=e54] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e55]:
      - img [ref=e56]
    - generic [ref=e59]:
      - button "Open issues overlay" [ref=e60]:
        - generic [ref=e61]:
          - generic [ref=e62]: "0"
          - generic [ref=e63]: "1"
        - generic [ref=e64]: Issue
      - button "Collapse issues badge" [ref=e65]:
        - img [ref=e66]
  - alert [ref=e68]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```