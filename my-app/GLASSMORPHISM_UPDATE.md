# Glassmorphism & Sticky Header Updates

## ✨ Các tính năng đã thêm:

### 1. **Sticky Header với Glassmorphism**
- Header giờ sẽ luôn ở trên đầu khi cuộn trang (`sticky top-0`)
- Hiệu ứng kính mờ (glassmorphism) với `backdrop-blur-xl`
- Nền bán trong suốt `bg-white/80` tạo độ sâu
- Border nhẹ và shadow để tách biệt khỏi nội dung

### 2. **Glassmorphism Cards - iOS Style**

#### **Khoảnh khắc chánh niệm (Podcast Section)**
- Background: `bg-white/30` với `backdrop-blur-xl`
- Border: `border-white/40` tạo viền sáng
- Hover effects: Nâng lên và tăng shadow
- Transition mượt mà như iOS

#### **Pricing Cards (Plans Section)**
- **Trải nghiệm**: Glass effect trắng trong suốt
- **Căn bản**: Nâu đậm với backdrop blur
- **Cao cấp**: Vàng kem với glass effect
- Tất cả đều có hover animation nâng lên

### 3. **Enhanced Visual Effects**
- Smooth scroll behavior
- Backdrop filter với -webkit support
- Enhanced shadows khi hover
- Transitions mượt mà (300ms duration)

## 🎨 **Cách hoạt động:**

### **Sticky Header:**
```tsx
className="sticky top-0 z-50 backdrop-blur-xl bg-white/80"
```

### **Glass Cards:**
```tsx
className="backdrop-blur-xl bg-white/30 border border-white/40"
```

### **Hover Effects:**
```tsx
hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)]
```

## 🔧 **Technical Details:**

- **Backdrop Blur**: 20px cho hiệu ứng glass mạnh
- **Opacity**: 30-95% tùy theo vị trí
- **Z-index**: 50 cho header để luôn ở trên
- **Border**: rgba với alpha thấp cho hiệu ứng nhẹ nhàng

## 📱 **Browser Support:**

Hiệu ứng glassmorphism được hỗ trợ bởi:
- ✅ Safari (iOS & macOS)
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ⚠️ Fallback cho browsers cũ

## 🎯 **User Experience:**

1. **Header luôn hiển thị** khi cuộn trang
2. **Glass effect** tạo cảm giác hiện đại như iOS
3. **Smooth animations** không gây giật lag
4. **Visual depth** với layers và shadows

Refresh trang để xem các hiệu ứng mới! 🚀
