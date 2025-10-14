# Subscription & Payment Flow - Complete Integration

## 📋 Tổng quan

Flow đăng ký gói subscription mới đã được tích hợp hoàn chỉnh với Payment Service, sử dụng pattern Request-Response để lấy Payment URL ngay lập tức cho user.

## 🔄 Flow hoàn chỉnh

### 1. Frontend - User chọn gói và thanh toán

```
User clicks "Đăng ký" 
  → CheckoutPage.handleCheckout()
  → subscriptionService.getPaymentMethods() // Lấy danh sách phương thức thanh toán
  → subscriptionService.registerSubscription({
      subscriptionPlanId: "xxx",
      paymentMethodId: "yyy" // MoMo, VNPay, etc.
    })
```

### 2. Backend - SubscriptionService xử lý

**File:** `RegisterSubscriptionCommandHandler.cs`

```csharp
// Step 1: Authentication
var authUserId = JWT.UserId // Từ token

// Step 2: Get Business UserProfileId từ Redis Cache
var userState = await _userStateCache.GetUserStateAsync(authUserId);
var userProfileId = userState.UserProfileId; // ✅ Dùng cho business logic

// Step 3: Validate subscription plan
var plan = await GetSubscriptionPlan(subscriptionPlanId);

// Step 4: Check existing active subscription
var existingSubscription = await GetActiveSubscription(userProfileId);
if (existingSubscription != null) return Conflict;

// Step 5: Create subscription entity
var subscription = new Subscription {
    UserProfileId = userProfileId, // ✅ Business logic
    SubscriptionStatus = Pending,
    ...
};
await SaveSubscription(subscription);

// Step 6: Request Payment via RPC (synchronous)
var paymentRequest = new CreatePaymentIntentRequest {
    SubscriptionId = subscription.Id,
    UserProfileId = userProfileId,
    PaymentMethodId = paymentMethodId,
    Amount = plan.Amount,
    Currency = plan.Currency
};

// ✅ Wait for payment response (timeout 30s)
var paymentResponse = await _paymentClient.GetResponse<PaymentIntentCreated>(
    paymentRequest,
    timeout: 30s
);

// Step 7: Return Payment URL to frontend
return {
    SubscriptionId = subscription.Id,
    PaymentUrl = paymentResponse.PaymentUrl,
    QrCodeBase64 = GenerateQrCode(paymentResponse.QrCodeUrl),
    PaymentTransactionId = paymentResponse.PaymentTransactionId
};
```

### 3. PaymentService - Tạo Payment Intent

**Consumer:** `CreatePaymentIntentConsumer.cs`

```csharp
// Receive request from SubscriptionService
var request = context.Message;

// Create payment transaction
var transaction = new PaymentTransaction {
    SubscriptionId = request.SubscriptionId,
    UserProfileId = request.UserProfileId,
    Amount = request.Amount,
    TransactionType = Payment,
    TransactionStatus = Pending
};

// Call payment gateway (MoMo, VNPay, etc.)
var paymentGateway = _paymentGatewayFactory.Create(paymentMethodType);
var gatewayResponse = await paymentGateway.CreatePaymentIntent(
    amount: request.Amount,
    orderId: transaction.Id,
    returnUrl: "https://healink.com/payment-callback",
    metadata: request.Metadata
);

// Save transaction
transaction.TransactionReference = gatewayResponse.TransactionId;
await SaveTransaction(transaction);

// ✅ Respond immediately to SubscriptionService
await context.RespondAsync(new PaymentIntentCreated {
    Success = true,
    PaymentUrl = gatewayResponse.PaymentUrl,
    QrCodeUrl = gatewayResponse.QrCodeUrl,
    PaymentTransactionId = transaction.Id
});
```

### 4. Frontend - Redirect to Payment

```typescript
const paymentResult = await subscriptionService.registerSubscription({
  subscriptionPlanId: plan.id,
  paymentMethodId: defaultPaymentMethod.id,
});

// ✅ Redirect to payment gateway
if (paymentResult.paymentUrl) {
  window.location.href = paymentResult.paymentUrl; // → MoMo/VNPay page
}
```

### 5. Payment Callback - Activate Subscription

```
User completes payment on MoMo/VNPay
  → Payment gateway calls: POST /api/payment/callback
  → PaymentCallbackController processes
  → Publish: PaymentCompletedEvent
  → SubscriptionSaga receives event
  → Update subscription status to Active
  → Send confirmation email
```

## 🔑 Key Points

### 1. **UserProfileId vs UserId**

- **UserId (JWT)**: Chỉ dùng cho authentication
- **UserProfileId (Redis Cache)**: Dùng cho business logic
- **CreatedBy (audit)**: Dùng authUserId

```csharp
// ❌ WRONG
var subscription = new Subscription {
    UserProfileId = authUserId // JWT UserId
};

// ✅ CORRECT
var userState = await _userStateCache.GetUserStateAsync(authUserId);
var subscription = new Subscription {
    UserProfileId = userState.UserProfileId // Business UserProfileId
};
```

### 2. **Request-Response Pattern**

SubscriptionService dùng **Request-Response** để nhận payment URL ngay lập tức:

```csharp
// ✅ Synchronous - wait for response
var response = await _paymentClient.GetResponse<PaymentIntentCreated>(
    request,
    timeout: 30s
);
return response.Message.PaymentUrl; // Return to frontend
```

**KHÔNG dùng** Publish/Subscribe vì frontend cần payment URL ngay:

```csharp
// ❌ WRONG - frontend không biết khi nào có response
await _publishEndpoint.Publish(new CreatePaymentIntentRequest(...));
```

### 3. **Saga for Long-Running Process**

Sau khi frontend redirect user, **Saga** theo dõi payment status:

```
SubscriptionSaga (state machine):
  1. SubscriptionRegistrationStarted → Waiting for payment
  2. PaymentCompletedEvent → Activate subscription
  3. PaymentFailedEvent → Cancel subscription
  4. Timeout (30 mins) → Expire subscription
```

## 📡 API Endpoints

### Frontend calls Gateway

```
POST /api/user/subscriptions/register
{
  "subscriptionPlanId": "guid",
  "paymentMethodId": "guid"
}

Response:
{
  "isSuccess": true,
  "data": {
    "subscriptionId": "guid",
    "subscriptionPlanName": "Premium",
    "amount": 59000,
    "currency": "VND",
    "paymentUrl": "https://test-payment.momo.vn/...",
    "qrCodeBase64": "iVBORw0KGgo...",
    "paymentTransactionId": "guid"
  }
}
```

### Gateway routes to SubscriptionService

```
Gateway (port 5010) → SubscriptionService (port 5007)
  POST /api/user/subscriptions/register
```

### SubscriptionService requests PaymentService

```
Via MassTransit RabbitMQ (RPC):
  Request: CreatePaymentIntentRequest
  Response: PaymentIntentCreated
```

## 🧪 Testing Flow

### 1. Test với API client (Postman/curl)

```bash
# 1. Login to get token
curl -X POST http://localhost:5010/api/user/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Get payment methods
curl -X GET http://localhost:5010/api/user/payment-methods \
  -H "Authorization: Bearer <token>"

# 3. Register subscription
curl -X POST http://localhost:5010/api/user/subscriptions/register \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriptionPlanId": "guid-here",
    "paymentMethodId": "guid-here"
  }'

# Response should contain paymentUrl
{
  "isSuccess": true,
  "data": {
    "paymentUrl": "https://test-payment.momo.vn/...",
    "qrCodeBase64": "..."
  }
}
```

### 2. Test flow trên frontend

```
1. Login → http://localhost:3000/auth
2. Chọn gói → http://localhost:3000/subscription
3. Checkout → http://localhost:3000/checkout?planId=xxx
4. Click "Thanh toán"
5. Redirect to MoMo/VNPay payment page
6. Complete payment
7. Callback redirects to success page
```

## 🐛 Troubleshooting

### Error: 404 Not Found

**Nguyên nhân:** Endpoint không đúng

**Fix:** Đã cập nhật:
- ❌ OLD: `/api/user/subscriptions/subscribe`
- ✅ NEW: `/api/user/subscriptions/register`

### Error: UserProfileId not found

**Nguyên nhân:** User chưa có trong Redis cache

**Fix:** Ensure user logged in và cache được populate

### Error: Payment timeout

**Nguyên nhân:** PaymentService không respond trong 30s

**Fix:**
- Check PaymentService đang chạy
- Check RabbitMQ connection
- Check payment gateway API

## 📝 Files Changed

### Frontend
1. `/my-app/src/lib/api-config.ts`
   - ✅ Updated endpoint: `REGISTER: '/api/user/subscriptions/register'`
   - ✅ Updated MY_SUBSCRIPTION: `'/api/user/subscriptions/me'`

2. `/my-app/src/types/subscription.types.ts`
   - ✅ Added `RegisterSubscriptionResponse` type
   - ✅ Updated `CreateSubscriptionRequest` (paymentMethodId required)

3. `/my-app/src/services/subscription.service.ts`
   - ✅ Added `registerSubscription()` method
   - ✅ Added `getPaymentMethods()` method
   - ✅ Deprecated old `createSubscription()` method

4. `/my-app/src/components/CheckoutPage.tsx`
   - ✅ Updated `handleCheckout()` to use new flow
   - ✅ Redirect to paymentUrl after registration

### Backend
- ✅ No changes needed (already implemented correctly)
- ✅ Gateway routes already configured
- ✅ Payment RPC already working

## ✅ Kết luận

Flow mới đã hoàn chỉnh:
1. ✅ Frontend gọi đúng endpoint `/register`
2. ✅ Backend trả về payment URL ngay lập tức
3. ✅ Frontend redirect user to payment gateway
4. ✅ Saga theo dõi payment status via callback
5. ✅ Subscription được activate sau khi payment thành công

**Ready for testing!** 🚀
