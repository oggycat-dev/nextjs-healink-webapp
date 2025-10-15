# ✅ Environment Configuration - Complete Setup

## 📦 What Was Created

### 1. Environment Files
- ✅ `.env.example` - Template với tất cả biến
- ✅ `.env.local` - Development đã cấu hình
- ✅ `.env.production` - Production template
- ✅ `.gitignore` - Đã có sẵn (đúng cấu hình)

### 2. Configuration Files  
- ✅ `src/lib/api-config.ts` - Cập nhật để dùng `API_GATEWAY_URL`
- ✅ `src/lib/env-helper.ts` - Helper functions để validate và debug
- ✅ `src/components/EnvStatus.tsx` - UI component hiển thị env status
- ✅ `src/components/Layout.tsx` - Thêm EnvStatus component

### 3. Documentation
- ✅ `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy chi tiết
- ✅ `ENV_CONFIGURATION.md` - Quick reference
- ✅ `ENV_SETUP_COMPLETE.md` - File này

## 🚀 How to Deploy

### Step 1: Deploy Backend to AWS
```bash
# Deploy backend của bạn lên AWS
# Lấy API Gateway URL
```

### Step 2: Update Frontend Environment

**Cách 1: Vercel Dashboard (Khuyến nghị)**
1. Vào Vercel project → Settings → Environment Variables
2. Thêm biến:
```
NEXT_PUBLIC_API_GATEWAY_URL = https://your-aws-api-gateway-url
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
NEXT_PUBLIC_ENABLE_DEBUG_MODE = false
NEXT_PUBLIC_LOG_LEVEL = error
```

**Cách 2: File `.env.production.local`**
```bash
# Tạo file
cp .env.production .env.production.local

# Sửa trong .env.production.local
NEXT_PUBLIC_API_GATEWAY_URL=https://your-aws-url

# Push lên GitHub
git add .
git commit -m "Update production config"
git push origin main
```

### Step 3: Test
```bash
# Test build local
npm run build
npm run start

# Kiểm tra API connection
curl https://your-aws-url/health
```

## 🔑 Key Features

### 1. Single Point of Configuration
Chỉ cần đổi **MỘT** biến để deploy:
```bash
NEXT_PUBLIC_API_GATEWAY_URL=https://your-aws-url
```

Tất cả services tự động dùng gateway này:
- ✅ Auth Service
- ✅ User Service  
- ✅ Content Service
- ✅ Subscription Service
- ✅ Payment Service

### 2. Environment Validation
Tự động kiểm tra config khi dev:
```typescript
import { validateEnvConfig } from '@/lib/env-helper';
const validation = validateEnvConfig();
```

### 3. Visual Debug Tool
Trong development mode, click nút ⚙️ ở góc phải dưới để xem:
- API Health Status
- Environment Variables
- Validation Errors
- All Service URLs

### 4. Auto-fallback
Nếu không có biến specific service, tự động dùng gateway:
```typescript
// Không cần set:
NEXT_PUBLIC_AUTH_SERVICE_URL

// Tự động dùng:
NEXT_PUBLIC_API_GATEWAY_URL
```

## 📋 Environment Variables Reference

### Required (Must Set)
| Variable | Local | Production |
|----------|-------|------------|
| `NEXT_PUBLIC_API_GATEWAY_URL` | `http://localhost:5010` | `https://api.healink.com` |

### Auto-configured (Có default)
| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_APP_NAME` | `Healink` |
| `NEXT_PUBLIC_API_TIMEOUT` | `30000` |
| `NEXT_PUBLIC_AUTH_TOKEN_KEY` | `healink_auth_token` |

### Optional (Có thể bỏ qua)
- `NEXT_PUBLIC_AUTH_SERVICE_URL` - Override auth service
- `NEXT_PUBLIC_USER_SERVICE_URL` - Override user service
- `NEXT_PUBLIC_CONTENT_SERVICE_URL` - Override content service
- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking

## 🧪 Testing

### Test Local Development
```bash
npm run dev
# Click nút ⚙️ ở góc phải dưới
# Xem API Status = Connected
```

### Test Production Build
```bash
npm run build
npm run start
# Truy cập http://localhost:3000
```

### Test API Connection
```bash
# Test gateway
curl http://localhost:5010/health

# Test production
curl https://your-aws-url/health
```

## 🔧 Advanced Usage

### Override Specific Service
```bash
# Trong .env.local
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:5010
NEXT_PUBLIC_CONTENT_SERVICE_URL=http://localhost:5004
```

### Enable Mock Data
```bash
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
```

### Change Log Level
```bash
# Development
NEXT_PUBLIC_LOG_LEVEL=debug

# Production  
NEXT_PUBLIC_LOG_LEVEL=error
```

## 🛠️ Troubleshooting

### API không kết nối được
```bash
# 1. Kiểm tra env variable
echo $NEXT_PUBLIC_API_GATEWAY_URL

# 2. Test API trực tiếp
curl http://localhost:5010/health

# 3. Clear cache và restart
rm -rf .next
npm run dev
```

### Changes không apply
```bash
# Restart dev server
npm run dev

# Hoặc clear cache
rm -rf .next && npm run dev
```

### Vercel deployment failed
1. Kiểm tra Environment Variables trong Vercel Dashboard
2. Xem deployment logs
3. Test build local: `npm run build`

## 📝 Quick Commands

```bash
# Setup local
cp .env.example .env.local
npm run dev

# Test build
npm run build
npm run start

# Deploy
git push origin main

# Check env in browser console
console.log(process.env.NEXT_PUBLIC_API_GATEWAY_URL)
```

## ✨ What You Get

1. **Easy Deployment** - Chỉ đổi 1 biến
2. **Auto Validation** - Tự động kiểm tra config
3. **Visual Debug** - UI để xem status
4. **Flexible Config** - Override từng service nếu cần
5. **Production Ready** - Đã có template production

## 📚 Documentation Files

1. `ENV_CONFIGURATION.md` - Quick reference
2. `DEPLOYMENT_GUIDE.md` - Chi tiết từng bước
3. `.env.example` - Template đầy đủ
4. `.env.production` - Production template

## 🎯 Next Steps

1. ✅ Đã setup xong environment config
2. 📱 Deploy backend lên AWS
3. 🌐 Update `NEXT_PUBLIC_API_GATEWAY_URL` trong Vercel
4. 🚀 Deploy!

---

**Giờ bạn chỉ cần đổi 1 biến `NEXT_PUBLIC_API_GATEWAY_URL` là có thể deploy production!** 🎉
