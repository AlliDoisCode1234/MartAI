# GitHub Pages Deployment

## Setup Steps

1. **Update homepage in package.json**
   - Replace `YOUR_USERNAME` with your GitHub username
   - Format: `https://YOUR_USERNAME.github.io/MartAI`

2. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create GitHub repository**
   - Go to GitHub and create a new repository named `MartAI`
   - Don't initialize with README

4. **Connect local repo to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/MartAI.git
   git branch -M main
   git push -u origin main
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: Select `gh-pages` branch
   - Save

Your site will be live at: `https://YOUR_USERNAME.github.io/MartAI`

## Future Deployments

Just run:
```bash
npm run deploy
```

This will automatically build and push to the `gh-pages` branch.

