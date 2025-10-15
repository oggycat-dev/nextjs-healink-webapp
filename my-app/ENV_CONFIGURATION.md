# 🔐 Environment Variables Configuration

## 📁 Files Overview

```
my-app/
├── .env.example              # Template with all variables
├── .env.local               # Local development (ignored by git)
├── .env.production          # Production template
├── .env.production.local    # Production secrets (ignored by git)
└── DEPLOYMENT_GUIDE.md      # Detailed deployment instructions
```

## 🚀 Quick Start

### For Local Development

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Update if needed (default values work for local)
# .env.local already has localhost:5010

# 3. Start dev server
npm run dev
```

### For Production Deployment

```bash
# 1. Deploy backend to AWS
# 2. Get your API Gateway URL

# 3. Set environment variables in Vercel Dashboard:
# Go to: Project Settings > Environment Variables
# Add: NEXT_PUBLIC_API_GATEWAY_URL = https://your-aws-url

# 4. Redeploy
git push origin main
```

## 🔑 Key Variables

### Must Change for Production

| Variable | Local | Production |
|----------|-------|------------|
| `NEXT_PUBLIC_API_GATEWAY_URL` | `http://localhost:5010` | `https://api.healink.com` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://healink.vercel.app` |
| `NEXT_PUBLIC_ENABLE_DEBUG_MODE` | `true` | `false` |
| `NEXT_PUBLIC_LOG_LEVEL` | `debug` | `error` |

### Auto-configured

These variables are auto-configured with sensible defaults:

- `NEXT_PUBLIC_AUTH_TOKEN_KEY`
- `NEXT_PUBLIC_REFRESH_TOKEN_KEY`
- `NEXT_PUBLIC_API_TIMEOUT`
- All other services default to `API_GATEWAY_URL`

## 🎯 Single Point of Configuration

**The magic:** You only need to change ONE variable for deployment!

```bash
# Change this:
NEXT_PUBLIC_API_GATEWAY_URL=https://your-aws-api-gateway

# Everything else automatically works:
# ✅ Auth Service
# ✅ User Service
# ✅ Content Service
# ✅ Subscription Service
# ✅ Payment Service
```

## 🔧 Advanced: Service-Specific URLs

If you need different URLs for specific services:

```bash
# Default: All use API Gateway
NEXT_PUBLIC_API_GATEWAY_URL=https://api.healink.com

# Override specific services (optional)
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.healink.com
NEXT_PUBLIC_CONTENT_SERVICE_URL=https://content.healink.com
```

## 📝 Vercel Setup

### Using Vercel Dashboard (Easiest)

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_API_GATEWAY_URL = https://your-aws-url
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

4. Click **Save** and redeploy

### Using Vercel CLI

```bash
vercel env add NEXT_PUBLIC_API_GATEWAY_URL production
# Enter: https://your-aws-url

vercel env add NEXT_PUBLIC_APP_URL production  
# Enter: https://your-app.vercel.app

# Redeploy
vercel --prod
```

## 🧪 Testing

### Test Local Backend
```bash
curl http://localhost:5010/health
```

### Test AWS Backend
```bash
curl https://your-aws-url/health
```

### Test Frontend API Connection
```bash
# In browser console
console.log(process.env.NEXT_PUBLIC_API_GATEWAY_URL)
```

## 📚 More Info

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## ⚠️ Important Notes

1. **Never commit `.env.local` or `.env.production.local`**
2. **Use Vercel Dashboard** for production secrets
3. **Test locally first** before deploying
4. **Check CORS** on your backend allows your frontend domain

## 🆘 Quick Troubleshooting

**Can't connect to API?**
```bash
# Check env variable
echo $NEXT_PUBLIC_API_GATEWAY_URL

# Restart dev server
npm run dev
```

**Changes not applying?**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Vercel deployment issues?**
- Check Environment Variables in Vercel Dashboard
- Redeploy from Vercel Dashboard
- Check deployment logs
