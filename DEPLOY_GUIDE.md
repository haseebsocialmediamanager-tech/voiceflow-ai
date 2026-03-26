# VoiceFlow AI — Deployment Guide
## Domain: linkedwin.io | Hosting: Hostinger

---

## IMPORTANT: Understanding Your Options

Hostinger **shared hosting** (file manager / public_html) only supports
static HTML/CSS/JS files — it does NOT run Node.js.

This means you have 3 paths:

| Option | AI Enhancement | Cost | Difficulty |
|--------|---------------|------|------------|
| **A. Vercel (Recommended)** | ✅ Full | Free | Easy |
| **B. Hostinger VPS** | ✅ Full | ~$4/mo | Medium |
| **C. Hostinger Shared (static)** | ❌ No AI | $0 extra | Easy |

---

## ✅ OPTION A — Vercel (RECOMMENDED)

**Full AI features. Free. Best for Next.js. Custom domain.**

### Step 1 — Push code to GitHub

1. Go to github.com → New repository → Name it `voiceflow-ai`
2. Open terminal in your Voice folder:

```bash
git init
git add .
git commit -m "VoiceFlow AI initial"
git remote add origin https://github.com/YOUR_USERNAME/voiceflow-ai.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to **vercel.com** → Sign up with GitHub (free)
2. Click **"Add New Project"**
3. Select your `voiceflow-ai` repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Wait ~2 minutes → your app is live at `yourproject.vercel.app`

### Step 3 — Add API Keys

1. In Vercel → your project → **Settings → Environment Variables**
2. Add these one by one:

```
ANTHROPIC_API_KEY = sk-ant-YOUR_KEY_HERE
NEXT_PUBLIC_APP_URL = https://linkedwin.io
NEXT_PUBLIC_APP_NAME = VoiceFlow AI
```

3. Get Anthropic key: console.anthropic.com → API Keys → Create

### Step 4 — Connect linkedwin.io Domain

**In Vercel:**
1. Project → Settings → **Domains**
2. Add `linkedwin.io` and `www.linkedwin.io`
3. Vercel shows you DNS records to add

**In Hostinger (your domain registrar):**
1. Log in → **Domains** → linkedwin.io → **DNS / Nameservers**
2. Add these records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

3. Wait 5–30 minutes for DNS to propagate
4. Back in Vercel → Domains → linkedwin.io should show ✅

---

## 🖥️ OPTION B — Hostinger VPS

**Full features. You control the server.**

### Requirements
- Hostinger KVM 1 or higher (~$4-8/mo)
- Ubuntu 22.04 LTS

### Step 1 — SSH into your VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2 — Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # should show v20.x
```

### Step 3 — Install PM2 (process manager)

```bash
npm install -g pm2
```

### Step 4 — Upload your project

**On your local machine**, zip the project (exclude node_modules):
```bash
zip -r voiceflow.zip . --exclude "node_modules/*" --exclude ".next/*"
```

Upload via Hostinger File Manager or SCP:
```bash
scp voiceflow.zip root@YOUR_VPS_IP:/var/www/
```

**On the VPS:**
```bash
cd /var/www
unzip voiceflow.zip -d voiceflow
cd voiceflow
npm install
```

### Step 5 — Set environment variables

```bash
nano .env.local
```

Paste:
```
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY
NEXT_PUBLIC_APP_URL=https://linkedwin.io
```

Save: Ctrl+X → Y → Enter

### Step 6 — Build and start

```bash
npm run build
pm2 start npm --name "voiceflow" -- start
pm2 startup   # auto-restart on reboot
pm2 save
```

### Step 7 — Nginx reverse proxy

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/voiceflow
```

Paste:
```nginx
server {
    listen 80;
    server_name linkedwin.io www.linkedwin.io;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/voiceflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8 — SSL Certificate (HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d linkedwin.io -d www.linkedwin.io
```

Follow prompts → your site gets free HTTPS.

### Step 9 — Point domain in Hostinger

Go to Hostinger → Domains → linkedwin.io → DNS:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_VPS_IP |
| A | www | YOUR_VPS_IP |

---

## 📁 OPTION C — Hostinger Shared Hosting (Static)

**No AI enhancement. Voice dictation still works. Just no AI polishing.**

### Step 1 — Build static version

Open PowerShell in your Voice folder:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-static.ps1
```

This creates `hostinger-upload.zip`

### Step 2 — Upload to Hostinger

1. Log in to Hostinger → **Hosting** → your plan → **File Manager**
2. Navigate to **public_html**
3. Select all existing files → Delete
4. Click **Upload** → select `hostinger-upload.zip`
5. Right-click the zip → **Extract** → Extract to current folder
6. Delete the zip file

### Step 3 — Test

Go to linkedwin.io — your site should load.

**What works:**
- Landing page with all animations ✅
- Voice dictation (records + transcribes) ✅
- Basic filler word cleanup ✅
- History, modes, language selector ✅

**What doesn't work (needs server):**
- AI text enhancement (Claude API) ❌

---

## 🌐 Making It Work on Mobile

### For the web app on mobile:
1. Open Chrome on Android / Safari on iOS
2. Go to linkedwin.io/app
3. Allow microphone when prompted
4. Works fully — `SS` shortcut becomes a tap

### For a proper mobile app (future):
- **Android**: Use Capacitor to wrap the Next.js app
  ```bash
  npm install @capacitor/core @capacitor/android
  npx cap init
  npx cap add android
  npx cap open android  # Opens in Android Studio
  ```

- **iOS**: Same with `@capacitor/ios`

---

## 🔑 Getting API Keys

### Anthropic (Claude AI — for text enhancement):
1. Go to **console.anthropic.com**
2. Sign up / Log in
3. API Keys → Create Key
4. Copy the `sk-ant-...` key
5. Add to Vercel env vars or .env.local

### Cost estimate:
- Claude Haiku: ~$0.25 per 1M input tokens
- Average dictation = ~50 tokens
- 1000 dictations ≈ $0.01 — effectively free for most users

---

## 📋 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] ANTHROPIC_API_KEY added in Vercel env vars
- [ ] linkedwin.io DNS pointed to Vercel
- [ ] HTTPS working (Vercel handles this automatically)
- [ ] Test on desktop Chrome: linkedwin.io/app
- [ ] Test on mobile Chrome: linkedwin.io/app
- [ ] Test SS shortcut (double press S)
- [ ] Test voice recording → AI enhancement → clipboard copy

---

## 🆘 Common Issues

**"Microphone not working"**
→ Must use HTTPS (linkedwin.io, not http://)
→ Browser will block mic on HTTP

**"AI enhancement not working"**
→ Check ANTHROPIC_API_KEY is set in Vercel env vars
→ Redeploy after adding env vars

**"Site not loading after DNS change"**
→ DNS takes 5 min – 24 hours to propagate
→ Check with: https://dnschecker.org/#A/linkedwin.io

**"SS shortcut not working"**
→ Click anywhere on the page first (page must have focus)
→ Must not be typing in an input

---

**Recommended: Go with Option A (Vercel) — it's free, takes 10 minutes, and gives full AI features.**
