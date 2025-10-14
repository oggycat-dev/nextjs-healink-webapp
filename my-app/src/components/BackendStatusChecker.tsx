"use client";

import { useState, useEffect } from "react";

export default function BackendStatusChecker() {
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010',
          { 
            method: 'HEAD',
            cache: 'no-store',
          }
        );
        setIsBackendOnline(response.ok || response.status !== 0);
      } catch (error) {
        setIsBackendOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isChecking || isBackendOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-lg border border-yellow-400 bg-yellow-50 p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800">
            Backend chưa kết nối
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Không thể kết nối tới server backend. Vui lòng khởi động backend trước khi sử dụng các tính năng yêu cầu đăng nhập.
          </p>
          <div className="mt-2 text-xs text-yellow-600">
            Đang kiểm tra: {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010'}
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded px-2 py-1 text-sm font-medium text-yellow-800 hover:bg-yellow-100"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
