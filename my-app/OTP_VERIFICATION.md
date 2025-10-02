# OTP Verification Implementation

## 🎯 Tổng quan

Đã triển khai thành công tính năng xác thực OTP khi đăng ký tài khoản. Khi người dùng đăng ký thành công, hệ thống sẽ tự động chuyển đến trang nhập mã OTP thay vì hiển thị thông báo lỗi.

## 📁 Files đã tạo/sửa

### 1. **Trang OTP Verification** (`/src/components/VerifyOtpPage.tsx`)
Component UI cho trang nhập mã OTP với các tính năng:
- 6 ô input riêng biệt cho từng chữ số OTP
- Tự động focus sang ô tiếp theo khi nhập
- Hỗ trợ paste mã OTP (tự động phân tách vào các ô)
- Xử lý phím Backspace, ArrowLeft, ArrowRight
- Nút "Gửi lại mã OTP"
- Nút "Quay lại đăng nhập"
- Hiển thị thông báo lỗi/thành công
- Loading state với spinner

### 2. **Route Page** (`/src/app/verify-otp/page.tsx`)
Next.js page wrapper cho component VerifyOtpPage

### 3. **Auth Context** (Đã cập nhật - `/src/contexts/AuthContext.tsx`)
Thay đổi logic trong hàm `register()`:
```typescript
// TRƯỚC
if (response.success) {
  router.push('/auth?tab=login&message=registration_success');
}

// SAU
if (response.success) {
  router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
}
```

Thêm xử lý đặc biệt cho thông báo OTP:
```typescript
catch (err) {
  const error = err as ApiError;
  // Không hiển thị lỗi nếu là thông báo OTP
  if (!error.message?.includes('OTP') && !error.message?.includes('registration started')) {
    setError(error.message || 'Đã xảy ra lỗi khi đăng ký');
  } else {
    // Vẫn chuyển đến trang OTP
    router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
  }
}
```

## 🔄 Luồng hoạt động

### Đăng ký → OTP → Đăng nhập

```
1. User điền form đăng ký
   ↓
2. Click "Đăng ký"
   ↓
3. API tạo tài khoản và gửi OTP
   ↓
4. Chuyển đến /verify-otp?email=xxx
   ↓
5. User nhập mã OTP 6 chữ số
   ↓
6. Click "Xác thực"
   ↓
7. API xác thực OTP
   ↓
8. Hiển thị thông báo thành công
   ↓
9. Chuyển đến /auth?tab=login&message=verification_success
   ↓
10. User đăng nhập với tài khoản đã xác thực
```

## 🎨 Giao diện OTP Page

### Header
- Logo Healink
- Tiêu đề: "Xác thực OTP"
- Hiển thị email nhận OTP

### OTP Input
- 6 ô input riêng biệt
- Font size lớn, dễ nhìn (text-2xl)
- Border màu vàng khi focus
- Auto-focus tự động

### Buttons
1. **Xác thực** - Submit OTP
   - Disabled khi chưa nhập đủ 6 số
   - Hiển thị loading spinner khi processing

2. **Gửi lại mã OTP** - Resend OTP
   - Gọi API để gửi lại
   - Hiển thị thông báo "Đã gửi lại"

3. **Quay lại đăng nhập** - Back to login

### Thông báo
- **Success**: Màu xanh lá với icon ✓
- **Error**: Màu đỏ
- **Info**: Hiển thị "Mã OTP có hiệu lực trong 5 phút"

## 🧪 Testing

### Test Case 1: Đăng ký thành công
```
1. Vào /auth
2. Click "Đăng ký"
3. Điền thông tin hợp lệ
4. Click "Đăng ký"
5. Verify: Tự động chuyển đến /verify-otp?email=xxx
6. Verify: Hiển thị email trong trang OTP
```

### Test Case 2: Nhập OTP
```
1. Ở trang /verify-otp
2. Nhập 6 chữ số OTP từ email
3. Verify: Auto-focus sang ô tiếp theo
4. Verify: Nút "Xác thực" enabled khi đủ 6 số
5. Click "Xác thực"
6. Verify: Hiển thị loading
7. Verify: Chuyển đến trang login sau khi thành công
```

### Test Case 3: OTP không đúng
```
1. Nhập OTP sai
2. Click "Xác thực"
3. Verify: Hiển thị thông báo lỗi từ API
4. Verify: Không chuyển trang
5. Sửa OTP và thử lại
```

### Test Case 4: Paste OTP
```
1. Copy mã OTP: "123456"
2. Click vào ô input đầu tiên
3. Paste (Cmd+V / Ctrl+V)
4. Verify: Tất cả 6 ô được điền tự động
5. Verify: Focus ở ô cuối cùng
```

### Test Case 5: Keyboard Navigation
```
1. Nhập số vào ô đầu tiên
2. Verify: Auto-focus ô thứ 2
3. Nhấn Backspace
4. Verify: Xóa số và quay lại ô đầu
5. Nhấn ArrowRight/ArrowLeft
6. Verify: Di chuyển giữa các ô
```

### Test Case 6: Gửi lại OTP
```
1. Click "Gửi lại mã OTP"
2. Verify: Hiển thị loading
3. Verify: Hiển thị thông báo "Đã gửi lại"
4. Verify: Thông báo tự động ẩn sau 3 giây
```

### Test Case 7: Quay lại login
```
1. Click "Quay lại đăng nhập"
2. Verify: Chuyển về /auth
3. Verify: Tab "Đăng nhập" được active
```

## 🔧 Customization

### Thay đổi thời gian hiệu lực OTP
```typescript
// Trong VerifyOtpPage.tsx
<p className="text-xs text-[#8B7355] text-center leading-relaxed">
  💡 Mã OTP có hiệu lực trong 10 phút. {/* Thay 5 → 10 */}
</p>
```

### Thêm countdown timer
```typescript
const [countdown, setCountdown] = useState(300); // 5 phút = 300 giây

useEffect(() => {
  const timer = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(timer);
}, []);

// Hiển thị
<p>Thời gian còn lại: {Math.floor(countdown / 60)}:{countdown % 60}</p>
```

### Thay đổi số lượng chữ số OTP
```typescript
// Từ 6 chữ số → 4 chữ số
const [otp, setOtp] = useState(["", "", "", ""]); // 4 ô thay vì 6

// Cập nhật validation
if (otpCode.length !== 4) {
  setError("Vui lòng nhập đầy đủ mã OTP 4 chữ số");
  return;
}
```

### Styling colors
```typescript
// Primary button color
className="bg-gradient-to-r from-[#D0BF98] to-[#C4B086]"

// Input focus color
className="focus:ring-[#D0BF98]"

// Border color
className="border-[#E5D9C5]"
```

## 🔐 Security Notes

1. **Email trong URL**: Email được truyền qua query parameter, cần encode:
   ```typescript
   router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
   ```

2. **OTP không được lưu trữ**: Chỉ gửi lên server khi verify

3. **Rate limiting**: Backend cần implement giới hạn số lần gửi lại OTP

4. **Expiration**: OTP nên có thời gian hết hạn (5-10 phút)

5. **One-time use**: OTP chỉ sử dụng được 1 lần

## 🐛 Troubleshooting

### Lỗi: "Không tìm thấy email"
**Nguyên nhân**: URL không có query parameter `email`
**Giải pháp**: Đảm bảo redirect có format: `/verify-otp?email=xxx`

### Lỗi: Input không focus tự động
**Nguyên nhân**: DOM chưa render xong
**Giải pháp**: Thêm small delay:
```typescript
setTimeout(() => {
  document.getElementById(`otp-${index + 1}`)?.focus();
}, 10);
```

### Lỗi: "Expected 2-3 arguments"
**Nguyên nhân**: Gọi sai signature của `verifyOtp()`
**Giải pháp**: Đúng syntax:
```typescript
authService.verifyOtp(email, otpCode, otpType)
```

### Lỗi: Paste không hoạt động
**Nguyên nhân**: Browser block paste event
**Giải pháp**: Đã handle trong `onChange` với check `value.length > 1`

## 📱 Responsive Design

Trang OTP đã responsive:
- Mobile: 1 cột, input size vừa phải
- Tablet: 1 cột, input lớn hơn
- Desktop: 1 cột giữa màn hình, max-width 448px

## 🚀 Future Enhancements

### 1. Countdown Timer
Thêm đếm ngược thời gian hết hạn OTP:
```typescript
const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
// Display: "Còn lại: 4:59"
```

### 2. Auto-submit
Tự động submit khi nhập đủ 6 số:
```typescript
useEffect(() => {
  if (otp.join("").length === 6) {
    handleSubmit();
  }
}, [otp]);
```

### 3. SMS/Email Toggle
Cho phép user chọn nhận OTP qua SMS hoặc Email:
```typescript
const [otpChannel, setOtpChannel] = useState<1 | 2>(1); // 1=Email, 2=SMS
```

### 4. Rate Limit Display
Hiển thị số lần gửi lại còn lại:
```typescript
<p>Bạn còn {remainingAttempts} lần gửi lại</p>
```

### 5. Resend Cooldown
Disable nút "Gửi lại" trong 60 giây:
```typescript
const [canResend, setCanResend] = useState(true);
const [resendCountdown, setResendCountdown] = useState(0);
```

## ✅ Checklist

- [x] Tạo component VerifyOtpPage
- [x] Tạo route /verify-otp
- [x] Sửa AuthContext để redirect đến OTP page
- [x] Xử lý thông báo "OTP verification" không hiển thị lỗi
- [x] 6 ô input OTP riêng biệt
- [x] Auto-focus khi nhập
- [x] Hỗ trợ paste OTP
- [x] Keyboard navigation (Backspace, Arrow keys)
- [x] Nút gửi lại OTP
- [x] Nút quay lại login
- [x] Error/Success messages
- [x] Loading states
- [x] Responsive design
- [ ] Backend API test
- [ ] Countdown timer (optional)
- [ ] Auto-submit (optional)

---

**Updated:** December 2024  
**Status:** ✅ Ready for testing  
**Next Step:** Test với backend API thật
