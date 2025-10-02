"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderDetailProps {
  orderId?: string;
}

interface OrderStatus {
  icon: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function OrderDetailPage({ orderId = "DH001" }: OrderDetailProps) {
  const router = useRouter();

  const orderStatuses: OrderStatus[] = [
    {
      icon: "📝",
      title: "Đơn hàng được tạo",
      description: "Đơn hàng của bạn đã được tạo thành công",
      time: "15/12/2025 - 14:30",
      completed: true,
    },
    {
      icon: "✅",
      title: "Đã xác nhận đơn hàng",
      description: "Chúng tôi đã xác nhận và bắt đầu xử lý đơn hàng",
      time: "15/12/2025 - 15:45",
      completed: true,
    },
    {
      icon: "📦",
      title: "Đang chuẩn bị hàng",
      description: "Đơn hàng đang được đóng gói cẩn thận",
      time: "16/12/2025 - 09:00",
      completed: true,
    },
    {
      icon: "🚚",
      title: "Đang giao hàng",
      description: "Đơn hàng đang trên đường giao đến bạn",
      time: "Dự kiến: 18/12/2025",
      completed: false,
    },
    {
      icon: "✓",
      title: "Đã giao thành công",
      description: "Đơn hàng đã được giao thành công",
      time: "Dự kiến: 18/12/2025",
      completed: false,
    },
  ];

  const orderItems: OrderItem[] = [
    {
      id: 1,
      name: "Sản phẩm A - Healink Essential",
      price: 60000,
      quantity: 2,
      image: "/icons/logo.png",
    },
    {
      id: 2,
      name: "Sản phẩm B - Healink Premium",
      price: 145000,
      quantity: 1,
      image: "/icons/logo.png",
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-white py-8 px-6">
      <div className="max-w-[1272px] mx-auto">
        {/* Order Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
          <button className="pb-2 px-1 font-black text-base border-b-2 border-black">
            Chi tiết đơn hàng #{orderId}
          </button>
          <button className="pb-2 px-1 font-medium text-base text-gray-600 hover:text-black">
            Chi tiết đơn hàng #DH002
          </button>
          <button className="pb-2 px-1 font-medium text-base text-gray-600 hover:text-black">
            Chi tiết đơn hàng #DH003
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-[40px] font-black leading-[60px] text-black mb-4">
              Đơn hàng #{orderId}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#2196F3] rounded-full"></div>
              <span className="text-xl font-medium">Đã xác nhận</span>
            </div>
          </div>
          <button className="px-6 py-3 bg-[#604B3B] text-white font-medium rounded-lg hover:bg-[#4a3b2d] transition-colors">
            Liên hệ hỗ trợ
          </button>
        </div>

        {/* Order Status Timeline */}
        <div className="border-2 border-[#604B3B] rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-8">Trạng thái đơn hàng</h2>
          
          <div className="space-y-0">
            {orderStatuses.map((status, index) => (
              <div key={index} className="relative">
                {/* Status Item */}
                <div className="flex items-start gap-6">
                  {/* Icon Circle */}
                  <div
                    className={`flex-shrink-0 w-[50px] h-[50px] rounded-full flex items-center justify-center text-xl ${
                      status.completed
                        ? "bg-[#604B3B] border-2 border-[#604B3B]"
                        : "bg-white border-2 border-[#E0E0E0]"
                    }`}
                  >
                    <span className={status.completed ? "text-white" : "text-gray-400"}>
                      {status.completed ? status.icon : index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-black mb-2">{status.title}</h3>
                        <p className="text-base text-[#666666]">{status.description}</p>
                      </div>
                      <span className="text-sm text-[#666666] whitespace-nowrap ml-4">
                        {status.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < orderStatuses.length - 1 && (
                  <div
                    className={`absolute left-6 top-[50px] w-0.5 h-10 ${
                      status.completed ? "bg-[#604B3B]" : "bg-[#E0E0E0]"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Shipping Info */}
          <div className="border-2 border-[#604B3B] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-8">Thông tin giao hàng</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-base font-medium text-black mb-1">Họ và tên:</p>
                <p className="text-lg text-black">Trần Ngọc M</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Email:</p>
                <p className="text-lg text-black">aaaaaaaa@gmail.com</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Số điện thoại:</p>
                <p className="text-lg text-black">0866 866 866</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Địa chỉ nhà:</p>
                <p className="text-lg text-black">123 đường, quận, TP HCM</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Lưu ý cho shop:</p>
                <p className="text-lg text-black">Đóng gói cẩn thận!</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-2 border-[#604B3B] rounded-lg p-8">
            <h2 className="text-2xl font-bold text-black mb-8">Thông tin thanh toán</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-base font-medium text-black mb-1">Phương thức thanh toán:</p>
                <p className="text-lg text-black">Thanh toán khi nhận hàng</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Trạng thái thanh toán:</p>
                <p className="text-lg text-[#FF9800]">Chưa thanh toán</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Phương thức giao hàng:</p>
                <p className="text-lg text-black">Giao hàng tận nơi</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Phí giao hàng:</p>
                <p className="text-lg text-black">0 VNĐ</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-black mb-1">Ngày giao dự kiến:</p>
                <p className="text-lg text-black">18/12/2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-2 border-[#604B3B] rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-8">Sản phẩm đặt hàng</h2>
          
          <div className="space-y-4 mb-8">
            {orderItems.map((item) => (
              <div key={item.id} className="border border-[#E0E0E0] rounded-lg p-6 flex items-center gap-6">
                <div className="w-20 h-20 bg-[#D0BF98] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black mb-2">{item.name}</h3>
                  <p className="text-base text-[#666666]">
                    Đơn giá: {item.price.toLocaleString("vi-VN")} VNĐ
                  </p>
                  <p className="text-base text-[#666666]">Số lượng: {item.quantity}</p>
                </div>
                
                <div className="text-xl font-bold text-black text-right">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-[#E0E0E0] pt-6 space-y-4">
            <div className="flex justify-end items-center gap-20">
              <span className="text-lg text-black">Tạm tính:</span>
              <span className="text-lg text-black">{subtotal.toLocaleString("vi-VN")} VNĐ</span>
            </div>
            
            <div className="flex justify-end items-center gap-20">
              <span className="text-lg text-black">Phí giao hàng:</span>
              <span className="text-lg text-black">{shippingFee.toLocaleString("vi-VN")} VNĐ</span>
            </div>
            
            <div className="flex justify-end items-center gap-20 pt-4 border-t border-[#E0E0E0]">
              <span className="text-xl font-bold text-black">Tổng tiền thanh toán:</span>
              <span className="text-xl font-bold text-black">{total.toLocaleString("vi-VN")} VNĐ</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => router.push("/orders")}
            className="px-12 py-4 border-2 border-[#604B3B] text-[#604B3B] font-medium text-lg rounded-lg hover:bg-gray-50 transition-colors"
          >
            Quay lại danh sách
          </button>
          <button className="px-12 py-4 bg-[#604B3B] text-white font-medium text-lg rounded-lg hover:bg-[#4a3b2d] transition-colors">
            Mua lại
          </button>
        </div>

        {/* Privacy Notice */}
        <p className="text-center text-sm text-black leading-relaxed max-w-[470px] mx-auto">
          Chúng tôi cam kết giữ kín thông tin khách hàng, chỉ dùng để xử lý đơn hàng, không chia sẻ cho bên thứ ba.
        </p>
      </div>
    </div>
  );
}
