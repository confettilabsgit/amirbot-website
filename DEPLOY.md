# Deploying AmirBot to Vercel 🚀

## Quick Deploy (5 minutes)

### Step 1: Push to GitHub

```bash
cd /root/.openclaw/workspace/amirbot-website

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Initial AmirBot website"

# Create GitHub repo (via web or CLI), then:
git remote add origin https://github.com/YOUR_USERNAME/amirbot-website.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Website (Easiest)**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `amirbot-website` repo
5. Vercel auto-detects settings
6. Click "Deploy"
7. Done! You get: `amirbot-website.vercel.app`

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /root/.openclaw/workspace/amirbot-website
vercel

# Follow prompts:
# - Login to Vercel
# - Set project name
# - Deploy!
```

### Step 3: Get Your URL

After deploy, Vercel gives you:
- **Production:** `https://amirbot-website.vercel.app`
- **Preview:** Every git push creates a preview URL

### Step 4: Custom Domain (Optional)

In Vercel dashboard:
1. Go to Project Settings
2. Domains tab
3. Add custom domain (e.g., `amirbot.com`)
4. Update DNS records (Vercel shows you how)

## What Happens on Deploy

1. Vercel reads `vercel.json` config
2. Builds your Node.js server
3. Deploys globally on CDN
4. Provides HTTPS automatically
5. Any GitHub push → auto-redeploys

## Environment Variables (For Later)

When you connect to real backend:
1. Vercel dashboard → Settings → Environment Variables
2. Add secrets (API keys, tokens, etc.)
3. Use in code: `process.env.YOUR_SECRET`

## Monitoring

Vercel dashboard shows:
- Visitor analytics
- Function logs
- Performance metrics
- Error tracking

## Cost

**Free tier includes:**
- 100 GB bandwidth/month
- Unlimited static requests
- 100 GB-hours serverless execution
- Custom domains
- SSL certificates

(More than enough for this project!)

---

## Quick Commands

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# Check status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm PROJECT_NAME
```

---

**Ready?** Follow the steps above and you'll have a public URL in 5 minutes! 🎉
