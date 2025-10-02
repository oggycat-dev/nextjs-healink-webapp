"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  const [couponCode, setCouponCode] = useState("");

  const cartItems: CartItem[] = [
    {
      id: 1,
      name: "Lorem ipsum dolor sit amet",
      price: 100000,
      quantity: 1,
      image: "/icons/logo.png",
    },
    {
      id: 2,
      name: "Lorem ipsum dolor sit amet",
      price: 40000,
      quantity: 2,
      image: "/icons/logo.png",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 15000;
  const discount = 50000;
  const vat = 0; // Đã bao gồm VAT
  const total = subtotal + shippingFee - discount + vat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    console.log("Checkout:", formData);
    router.push("/orders/DH001");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Shipping Form */}
          <div className="max-w-[561px]">
            <h1 className="text-[40px] font-black leading-[51px] text-black mb-12">
              Giao hàng tận nơi
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Full Name */}
              <div>
                <label className="block text-2xl font-medium text-black mb-3">
                  Họ và tên:
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full h-[47px] px-6 border border-black rounded-full text-lg focus:outline-none focus:border-[#604B3B] transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-2xl font-medium text-black mb-3">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-[47px] px-6 border border-black rounded-full text-lg focus:outline-none focus:border-[#604B3B] transition-colors"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-2xl font-medium text-black mb-3">
                  Số Điện thoại:
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại của bạn"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full h-[47px] px-6 border border-black rounded-full text-lg focus:outline-none focus:border-[#604B3B] transition-colors"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-2xl font-medium text-black mb-3">
                  Địa chỉ nhà
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Nhập địa chỉ nhà"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full h-[47px] px-6 border border-black rounded-full text-lg focus:outline-none focus:border-[#604B3B] transition-colors"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-2xl font-medium text-black mb-3">
                  Lưu ý cho shop
                </label>
                <input
                  type="text"
                  name="note"
                  placeholder="Yêu cầu đặc biệt"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full h-[47px] px-6 border border-black rounded-full text-lg focus:outline-none focus:border-[#604B3B] transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 w-px h-full bg-[#919191] opacity-60"></div>

          {/* Right Side - Order Summary */}
          <div className="max-w-[526px]">
            <h2 className="text-[40px] font-black leading-[51px] text-black mb-12">
              Giỏ hàng của bạn
            </h2>

            {/* Progress Bar */}
            <div className="relative w-1 h-[361px] bg-[#D0BF98] rounded-full mx-auto mb-8">
              <div className="absolute top-0 left-0 w-full h-[73px] bg-[#604B3B] rounded-full"></div>
            </div>

            {/* Cart Items */}
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-[178px] h-[149px] bg-[#D0BF98] rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={178}
                      height={149}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold uppercase text-black mb-2 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-base text-black mb-1">
                      x {item.quantity}
                    </p>
                    <p className="text-lg font-black uppercase text-black">
                      {item.price.toLocaleString("vi-VN")}Đ
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="border-2 border-[#604B3B] rounded-lg p-4 mb-6 flex items-center justify-between">
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 text-lg font-medium text-[#D0BF98] focus:outline-none placeholder:text-[#D0BF98]"
              />
              <button className="text-lg font-black text-[#604B3B] hover:underline">
                Áp dụng
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-black">Tạm tính</span>
                <span className="text-lg font-medium text-black text-right">
                  {subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-black">Phí vận chuyển</span>
                <span className="text-lg font-medium text-black text-right">
                  {shippingFee.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-black">Giảm giá</span>
                <span className="text-lg font-medium text-black text-right">
                  -{discount.toLocaleString("vi-VN")}đ
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-black">Thuế ( VAT 10%)</span>
                <span className="text-lg font-medium text-black text-right">
                  Đã bao gồm VAT
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-2xl font-black italic text-[#6D3002]">
                  Tổng cộng
                </span>
                <span className="text-2xl font-black italic text-[#6D3002] text-right">
                  {total.toLocaleString("vi-VN")}Đ
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleSubmit}
              className="w-full h-[47px] bg-[#604B3B] rounded-lg text-white text-2xl font-black hover:bg-[#4a3b2d] transition-colors mb-6"
            >
              Thanh toán
            </button>

            {/* Privacy Notice */}
            <p className="text-center text-sm font-light italic text-black leading-relaxed">
              Chúng tôi cam kết giữ kín thông tin khách hàng, chỉ dùng để xử lý đơn hàng, không chia sẻ cho bên thứ ba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
