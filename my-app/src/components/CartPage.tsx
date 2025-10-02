"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
      price: 30000,
      quantity: 1,
      image: "/icons/logo.png",
    },
    {
      id: 3,
      name: "Lorem ipsum dolor sit amet",
      price: 20000,
      quantity: 1,
      image: "/icons/logo.png",
    },
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const totalAmount = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black text-[#000000]">Theo dõi</h1>
          <h2 className="text-4xl font-black text-[#000000] text-right">đơn hàng</h2>
        </div>

        {/* Cart Table */}
        <div className="overflow-hidden rounded-lg border border-[#604B3B]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 bg-[#FBE7BA] border-b border-[#604B3B] px-6 py-4">
            <div className="col-span-1"></div>
            <div className="col-span-4">
              <h3 className="text-xl font-medium text-[#000000] sm:text-2xl">Sản phẩm</h3>
            </div>
            <div className="col-span-2">
              <h3 className="text-xl font-medium text-[#000000] sm:text-2xl">Đơn giá</h3>
            </div>
            <div className="col-span-2">
              <h3 className="text-xl font-medium text-[#000000] sm:text-2xl">Số lượng</h3>
            </div>
            <div className="col-span-3">
              <h3 className="text-xl font-medium text-[#000000] sm:text-2xl">Thành tiền</h3>
            </div>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-[#604B3B]/20">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-6 py-6 hover:bg-gray-50 transition-colors">
                {/* Checkbox */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => toggleSelectItem(item.id)}
                    className={`w-9 h-9 rounded-lg border-2 border-[#604B3B] flex items-center justify-center transition-colors ${
                      selectedItems.includes(item.id) ? 'bg-[#604B3B]' : 'bg-white'
                    }`}
                  >
                    {selectedItems.includes(item.id) && (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-[140px] h-[120px] bg-[#D0BF98] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover" />
                  </div>
                  <h4 className="font-bold text-base uppercase text-[#000000] line-clamp-2">
                    {item.name}
                  </h4>
                </div>

                {/* Unit Price */}
                <div className="col-span-2">
                  <p className="text-base font-normal uppercase text-[#000000]">
                    {item.price.toLocaleString('vi-VN')}Đ
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="col-span-2">
                  <div className="inline-flex items-center border-2 border-[#604B3B] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r-2 border-[#604B3B]"
                    >
                      <span className="text-xl font-bold">−</span>
                    </button>
                    <span className="w-16 h-12 flex items-center justify-center text-xl font-normal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-l-2 border-[#604B3B]"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="col-span-3">
                  <p className="text-base font-normal uppercase text-[#000000]">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}Đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center bg-[#604B3B] text-white rounded-md font-normal text-base">
            1
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors font-normal text-base">
            2
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors font-normal text-base">
            3
          </button>
          
          <div className="flex gap-1 items-center px-2">
            <span className="w-2 h-2 bg-[#FBE7BA] rounded-full"></span>
            <span className="w-2 h-2 bg-[#FBE7BA] rounded-full"></span>
            <span className="w-2 h-2 bg-[#FBE7BA] rounded-full"></span>
          </div>
          
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors font-normal text-base">
            6
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors font-normal text-base">
            7
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors font-normal text-base">
            8
          </button>
          
          <button className="w-12 h-12 flex items-center justify-center bg-[#FBE7BA] rounded-md hover:bg-[#ead8a9] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-[#FBE7BA] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={toggleSelectAll}
                className={`w-9 h-9 rounded-lg border-2 border-[#604B3B] flex items-center justify-center transition-colors ${
                  selectAll ? 'bg-[#604B3B]' : 'bg-white'
                }`}
              >
                {selectAll && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-2xl font-normal text-[#000000]">Chọn tất cả</span>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-normal text-[#000000]">
                  Tổng thanh toán ({selectedItems.length} sản phẩm):
                </span>
                <span className="text-3xl font-normal text-[#000000]">
                  {totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="bg-[#604B3B] text-white px-12 py-4 rounded-lg text-xl font-normal hover:bg-[#4a3a2d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedItems.length === 0}
              >
                Mua Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}