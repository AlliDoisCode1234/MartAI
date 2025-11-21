# 🚀 Quick Vercel Deployment Fix

## Step 1: Add Environment Variable (CRITICAL)

1. Open: https://vercel.com/dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** (paste your OpenAI API key from `.env.local`)
   - **Environment:** ✅ Production ✅ Preview ✅ Development
6. Click **Save**

## Step 2: Redeploy

1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy**

## Step 3: Test

Visit: `https://your-project.vercel.app/api/seo-agent`

Should see:
```json
{
  "status": "ok",
  "message": "SEO Agent API is running",
  "hasOpenAIConfig": true,
  "hasVercelGateway": false
}
```

## ✅ Done!

If `hasOpenAIConfig` is `true`, your deployment is fixed!

---

**Still getting 404?**
- Check that `app/api/seo-agent/route.ts` is committed to GitHub
- Verify the file exists in your repository
- Check deployment logs for errors

