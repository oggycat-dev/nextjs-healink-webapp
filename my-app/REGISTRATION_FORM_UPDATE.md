# Cập Nhật Form Đăng Ký - Thêm Trường Số Điện Thoại

## Tổng Quan
Đã cập nhật form đăng ký (`AuthPageIntegrated.tsx`) để hiển thị **đầy đủ các trường bắt buộc** theo API backend.

## Thay Đổi Chính

### 1. **Hiển Thị Đầy Đủ Các Trường**
Form đăng ký giờ luôn hiển thị:
- ✅ **Họ và tên** (bắt buộc)
- ✅ **Email** (bắt buộc)
- ✅ **Số điện thoại** (bắt buộc khi chọn nhận OTP qua SMS)
- ✅ **Mật khẩu** (bắt buộc, tối thiểu 6 ký tự)
- ✅ **Xác nhận mật khẩu** (bắt buộc)

### 2. **Chọn Kênh Nhận OTP**
- Tab chuyển đổi giữa **SMS** và **Email** để chọn kênh nhận mã OTP
- Label rõ ràng: "Nhận mã OTP qua"
- Số điện thoại hiển thị:
  - **"Số điện thoại *"** khi chọn SMS (bắt buộc)
  - **"Số điện thoại (Tùy chọn)"** khi chọn Email (không bắt buộc)

### 3. **Validation Nâng Cao**

#### Validation Email:
- Email luôn bắt buộc (dùng để đăng nhập)
- Định dạng email hợp lệ

#### Validation Số Điện Thoại:
- **Bắt buộc** khi chọn nhận OTP qua SMS
- **Tùy chọn** khi chọn nhận OTP qua Email
- Regex validation cho số điện thoại Việt Nam:
  ```
  ^(0[0-9]{9}|84[0-9]{9,10}|\+84[0-9]{9,10})$
  ```
- Các format hợp lệ:
  - `0987654321` (10 số, bắt đầu bằng 0)
  - `84987654321` (11-12 số, bắt đầu bằng 84)
  - `+84987654321` (có dấu +)

#### Validation Mật Khẩu:
- Tối thiểu 6 ký tự (theo yêu cầu backend)
- Phải khớp với mật khẩu xác nhận

### 4. **Cấu Trúc API Request**

```typescript
{
  email: string,              // Bắt buộc
  password: string,           // Bắt buộc, min 6 chars
  confirmPassword: string,    // Bắt buộc
  fullName: string,           // Bắt buộc
  phoneNumber: string,        // Bắt buộc nếu OtpSentChannel = SMS
  otpSentChannel: 1 | 2       // 1 = Email, 2 = SMS
}
```

## Trải Nghiệm Người Dùng

### Kịch Bản 1: Nhận OTP qua Email
1. Người dùng chọn tab "Email"
2. Điền: Họ tên, Email, Mật khẩu
3. Số điện thoại là **tùy chọn** (có thể bỏ trống)
4. Nhấn "Đăng ký" → Nhận OTP qua email

### Kịch Bản 2: Nhận OTP qua SMS
1. Người dùng chọn tab "SMS"
2. Điền: Họ tên, Email, **Số điện thoại** (bắt buộc), Mật khẩu
3. Nhấn "Đăng ký" → Nhận OTP qua SMS

## Thông Báo Lỗi

- ❌ "Vui lòng điền đầy đủ thông tin bắt buộc"
- ❌ "Mật khẩu xác nhận không khớp"
- ❌ "Mật khẩu phải có ít nhất 6 ký tự"
- ❌ "Vui lòng nhập số điện thoại để nhận OTP qua SMS"
- ❌ "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng"

## Test Cases

### ✅ Test 1: Đăng ký với Email OTP
```
Họ tên: Nguyễn Văn A
Email: test@example.com
Số điện thoại: (để trống)
Mật khẩu: Test@123
Kênh OTP: Email
→ Kỳ vọng: Đăng ký thành công
```

### ✅ Test 2: Đăng ký với SMS OTP
```
Họ tên: Nguyễn Văn B
Email: test2@example.com
Số điện thoại: 0987654321
Mật khẩu: Test@123
Kênh OTP: SMS
→ Kỳ vọng: Đăng ký thành công
```

### ❌ Test 3: Đăng ký SMS mà không có số điện thoại
```
Họ tên: Nguyễn Văn C
Email: test3@example.com
Số điện thoại: (để trống)
Kênh OTP: SMS
→ Kỳ vọng: Lỗi "Vui lòng nhập số điện thoại để nhận OTP qua SMS"
```

### ❌ Test 4: Số điện thoại không hợp lệ
```
Số điện thoại: 123456
→ Kỳ vọng: Lỗi "Số điện thoại không hợp lệ"
```

## Files Đã Thay Đổi

- ✅ `/src/components/AuthPageIntegrated.tsx`
  - Updated form fields
  - Updated validation logic
  - Updated UI labels
  - Added phone number regex validation

## Backend API Mapping

Tương thích 100% với API backend:
- Endpoint: `POST /api/user/auth/register`
- Controller: `AuthController.cs`
- DTO: `RegisterRequest.cs`
- Validator: `RegisterCommandValidator.cs`

---

**Status:** ✅ Hoàn thành và đã test
**Date:** 2025-10-15

