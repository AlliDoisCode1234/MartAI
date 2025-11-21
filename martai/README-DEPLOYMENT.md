# Deployment Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the `martai` directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   OR if using Vercel AI Gateway:
   ```
   VERCEL_AI_GATEWAY_KEY=your_vercel_gateway_key_here
   ```

3. **Run local development server:**
   ```bash
   npm run dev
   ```

4. **Test locally:**
   - Visit: http://localhost:3000
   - Test API: http://localhost:3000/api/seo-agent (GET request)

## Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add AI agent"
   git push
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Set Environment Variables:**
   - In Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = your OpenAI API key
   - OR: `VERCEL_AI_GATEWAY_KEY` = your Vercel AI Gateway key

4. **Deploy:**
   - Vercel will automatically deploy on every git push
   - Or click "Redeploy" in the dashboard

### Option 2: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd martai
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add OPENAI_API_KEY
   # Paste your API key when prompted
   ```

5. **Redeploy with env vars:**
   ```bash
   vercel --prod
   ```

## Testing Your Deployment

After deploying to Vercel:

1. **Check your deployment URL:**
   - Found in Vercel Dashboard → Your Project → Deployments
   - Example: `https://your-project.vercel.app`

2. **Test the API:**
   - Visit: `https://your-project.vercel.app/api/seo-agent`
   - Should return JSON with status: "ok"

3. **Test the onboarding flow:**
   - Visit: `https://your-project.vercel.app/onboarding`
   - Fill out the form and submit

## Troubleshooting

### 404 Errors on Vercel:
- Make sure environment variables are set in Vercel Dashboard
- Check that the deployment completed successfully
- Verify you're using the correct deployment URL

### API Not Working:
- Check Vercel Function Logs in the dashboard
- Verify environment variables are set correctly
- Make sure `vercel.json` is in the root directory

