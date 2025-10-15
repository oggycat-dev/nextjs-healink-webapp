# 🚀 Deployment Guide - Environment Configuration

## 📋 Overview

This guide helps you configure environment variables for different deployment scenarios.

## 🔧 Environment Files

### Local Development (`.env.local`)
Used for local development with localhost backend.

```bash
cp .env.example .env.local
```

### Production (`.env.production.local`)
Used for production deployment on Vercel with AWS backend.

```bash
cp .env.production .env.production.local
```

## 🌍 Quick Deployment Steps

### Step 1: Deploy Backend to AWS

1. Deploy your .NET backend services to AWS
2. Note down your API Gateway URL (e.g., `https://api.healink.com` or AWS API Gateway endpoint)

### Step 2: Update Frontend Environment Variables

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://your-aws-api-gateway-url
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=error
```

**Option B: Using `.env.production.local`**

1. Create `.env.production.local` in your project root:

```bash
# Update this with your AWS API Gateway URL
NEXT_PUBLIC_API_GATEWAY_URL=https://api.healink.com

# Update with your Vercel deployment URL
NEXT_PUBLIC_APP_URL=https://healink.vercel.app
```

2. Push to GitHub and Vercel will automatically deploy

### Step 3: Verify Deployment

Test your deployed app:

```bash
# Check if API is reachable
curl https://your-aws-api-gateway-url/health

# Check if frontend can connect
curl https://your-app.vercel.app
```

## 📝 Environment Variables Reference

### Core Configuration

| Variable | Description | Local | Production |
|----------|-------------|-------|------------|
| `NEXT_PUBLIC_API_GATEWAY_URL` | Main API endpoint | `http://localhost:5010` | `https://api.healink.com` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` | `https://healink.vercel.app` |

### Optional Service Overrides

Only needed if you want to bypass API Gateway for specific services:

```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth.healink.com
NEXT_PUBLIC_USER_SERVICE_URL=https://user.healink.com
NEXT_PUBLIC_CONTENT_SERVICE_URL=https://content.healink.com
NEXT_PUBLIC_SUBSCRIPTION_SERVICE_URL=https://subscription.healink.com
NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://payment.healink.com
```

### Feature Flags

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=false        # Enable Google Analytics
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true        # Show debug logs
NEXT_PUBLIC_ENABLE_MOCK_DATA=false        # Use mock data instead of API
```

### Advanced Configuration

```bash
NEXT_PUBLIC_LOG_LEVEL=debug               # debug | info | warn | error
NEXT_PUBLIC_API_TIMEOUT=30000             # API timeout in milliseconds
NEXT_PUBLIC_AUTH_TOKEN_KEY=healink_auth_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=healink_refresh_token
```

## 🔐 Security Best Practices

1. **Never commit `.env.local` or `.env.production.local`** - These files are in `.gitignore`
2. **Use Vercel Environment Variables** for sensitive data
3. **Rotate tokens regularly** in production
4. **Use HTTPS only** for production API endpoints
5. **Enable CORS properly** on your backend

## 🧪 Testing Different Environments

### Test Local → Local
```bash
# .env.local
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:5010
```

### Test Local → AWS
```bash
# .env.local
NEXT_PUBLIC_API_GATEWAY_URL=https://api.healink.com
```

### Test Production
```bash
npm run build
npm run start
```

## 🛠️ Troubleshooting

### API Connection Issues

**Problem**: Frontend can't connect to backend

**Solution**:
1. Check if API Gateway URL is correct:
   ```bash
   echo $NEXT_PUBLIC_API_GATEWAY_URL
   ```

2. Test API directly:
   ```bash
   curl https://your-api-url/health
   ```

3. Check CORS settings on backend

### Environment Variables Not Updating

**Problem**: Changes to `.env` not reflected

**Solution**:
1. Restart dev server:
   ```bash
   npm run dev
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. For Vercel, redeploy:
   ```bash
   git push origin main
   ```

### CORS Errors

**Problem**: CORS policy blocking requests

**Solution**: Update backend CORS configuration to allow your frontend domain:

```csharp
// In your .NET backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",      // Local dev
                "https://healink.vercel.app"  // Production
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

## 📦 Quick Commands

```bash
# Copy example env for local development
cp .env.example .env.local

# Copy production env
cp .env.production .env.production.local

# Test build locally
npm run build && npm run start

# Deploy to Vercel (if CLI installed)
vercel --prod
```

## 🔄 Migration from Old Config

If you have old environment variables, update them:

**Old:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5010
```

**New:**
```bash
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:5010
```

The old variable is still supported but deprecated.

## 📞 Support

If you encounter issues:

1. Check [Next.js Environment Variables Docs](https://nextjs.org/docs/basic-features/environment-variables)
2. Check [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
3. Review backend logs on AWS CloudWatch
