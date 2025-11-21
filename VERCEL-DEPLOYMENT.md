# Vercel Deployment Fix Guide

## Quick Fix Steps

### 1. Set Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

   **Name:** `OPENAI_API_KEY`  
   **Value:** Your OpenAI API key (same one from `.env.local`)  
   **Environment:** Production, Preview, Development (select all)

5. Click **Save**

### 2. Verify Your Deployment

1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **...** menu → **Redeploy**
4. Make sure **Use existing Build Cache** is **unchecked**
5. Click **Redeploy**

### 3. Test the API

After redeployment completes:

1. Go to your deployment URL (e.g., `https://your-project.vercel.app`)
2. Test the health check: `https://your-project.vercel.app/api/seo-agent`
   - Should return: `{"status":"ok","message":"SEO Agent API is running","hasOpenAIConfig":true,"hasVercelGateway":false}`
3. Test the onboarding page: `https://your-project.vercel.app/onboarding`

## Troubleshooting

### If you still get 404:

1. **Check the deployment logs:**
   - Go to your deployment → **Functions** tab
   - Look for any errors

2. **Verify the route exists:**
   - Check that `app/api/seo-agent/route.ts` is in your repository
   - Make sure it's committed and pushed to GitHub

3. **Check environment variables:**
   - Go to Settings → Environment Variables
   - Verify `OPENAI_API_KEY` is set for all environments
   - Make sure there are no typos

4. **Clear Vercel cache:**
   - Settings → General → Clear Build Cache
   - Redeploy

### If API returns 500 error:

1. **Check function logs:**
   - Go to your deployment → **Functions** tab
   - Click on the function to see logs
   - Look for error messages

2. **Common issues:**
   - Missing environment variable → Add `OPENAI_API_KEY`
   - Invalid API key → Verify your OpenAI key is correct
   - Timeout → Already set to 60s in `vercel.json`

## Deployment Checklist

- [ ] Environment variable `OPENAI_API_KEY` is set in Vercel
- [ ] Environment variable is enabled for Production, Preview, and Development
- [ ] Latest code is pushed to GitHub
- [ ] Deployment completed successfully
- [ ] Health check endpoint works: `/api/seo-agent`
- [ ] Onboarding form submits successfully
- [ ] Results page displays correctly

## Next Steps After Deployment

1. **Set up custom domain** (optional):
   - Settings → Domains
   - Add your custom domain

2. **Enable analytics** (optional):
   - Analytics tab
   - Enable Vercel Analytics

3. **Set up monitoring:**
   - Check function logs regularly
   - Monitor API usage in OpenAI dashboard

## Quick Commands

If you have Vercel CLI installed:

```bash
# Login
vercel login

# Link project
vercel link

# Add environment variable
vercel env add OPENAI_API_KEY

# Deploy
vercel --prod
```

