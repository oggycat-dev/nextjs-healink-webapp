"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmptyOrderState from "./EmptyOrderState";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrdersPage() {
  const router = useRouter();
  // Simulate empty orders state - change to true to see actual orders
  const [orders] = useState<Order[]>([]);
  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-black text-center text-[#000000] mb-12">
          Đơn hàng của tôi
        </h1>

        {!hasOrders ? (
          <EmptyOrderState />
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã đơn hàng: {order.id}</p>
                    <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
                  </div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status === "completed"
                      ? "Hoàn thành"
                      : order.status === "pending"
                      ? "Đang xử lý"
                      : "Đã hủy"}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <span className="text-gray-700">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-[#826B39]">
                    {order.total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
