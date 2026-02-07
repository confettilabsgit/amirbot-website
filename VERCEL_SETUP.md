# Vercel Environment Variables Setup

After deploying to Vercel, you need to add these environment variables:

## Go to Vercel Dashboard

1. Open your project: https://vercel.com/confettilabsgit/amirbot-website
2. Go to **Settings** tab
3. Click **Environment Variables** (left sidebar)
4. Add these variables:

### Variables to Add:

**TELEGRAM_BOT_TOKEN**
```
8004609234:AAG8zSMyGrzqACN917brSPEHvc0hSUo9eCQ
```

**TELEGRAM_CHAT_ID**
```
8281858600
```

## Steps:

1. Click "Add New"
2. Name: `TELEGRAM_BOT_TOKEN`
3. Value: `8004609234:AAG8zSMyGrzqACN917brSPEHvc0hSUo9eCQ`
4. Environments: Check all (Production, Preview, Development)
5. Click "Save"

Repeat for `TELEGRAM_CHAT_ID`

## After Adding Variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on latest deployment
3. Click **Redeploy**
4. Wait ~30 seconds

## How It Works:

When someone chats on the website:
1. Message forwards to your Telegram (@you, ID: 8281858600)
2. You see: "🌐 Website Visitor: [their message]"
3. You reply in Telegram
4. (We'll set up reply routing next!)

---

**Done!** Your website visitors can now message you via Telegram!
