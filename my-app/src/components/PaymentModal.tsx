"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentUrl?: string;
  qrCodeBase64?: string;
  amount: number;
  currency: string;
  planName: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  paymentUrl,
  qrCodeBase64,
  amount,
  currency,
  planName,
}: PaymentModalProps) {
  const [countdown, setCountdown] = useState(600); // 10 minutes

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center">
            <svg className="h-12 w-12 text-[#604B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#604B3B]">Thanh toán</h2>
          <p className="mt-2 text-sm text-gray-600">{planName}</p>
          <p className="text-3xl font-bold text-[#604B3B]">{formatAmount(amount, currency)}</p>
        </div>

        {/* Countdown */}
        <div className="mb-6 rounded-xl bg-yellow-50 p-4 text-center">
          <p className="text-sm text-gray-600">Thời gian còn lại</p>
          <p className="text-2xl font-bold text-[#604B3B]">{formatTime(countdown)}</p>
        </div>

        {/* QR Code */}
        {qrCodeBase64 && (
          <div className="mb-6">
            <div className="rounded-xl border-4 border-[#604B3B] bg-white p-4">
              <div className="relative mx-auto h-64 w-64">
                <Image
                  src={`data:image/png;base64,${qrCodeBase64}`}
                  alt="QR Code thanh toán"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Quét mã QR bằng ứng dụng MoMo hoặc VNPay để thanh toán
            </p>
          </div>
        )}

        {/* Payment URL Button */}
        {paymentUrl && (
          <div className="space-y-3">
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#604B3B] px-6 py-3 text-white transition-colors hover:bg-[#4d3c2f]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Mở trang thanh toán
            </a>
            <p className="text-center text-xs text-gray-500">
              Hoặc click vào đây nếu không quét được QR code
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-700">Hướng dẫn:</h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
            <li>Mở ứng dụng MoMo hoặc VNPay</li>
            <li>Chọn "Quét mã QR"</li>
            <li>Quét mã QR trên màn hình</li>
            <li>Xác nhận thanh toán</li>
          </ol>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Sau khi thanh toán thành công, bạn sẽ được chuyển về trang xác nhận
        </p>
      </div>
    </div>
  );
}
