import { Suspense } from "react";
import PaymentReturn from "@/components/PaymentReturn";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F7F2F2] to-[#FBE7BA]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#604B3B] border-t-transparent mx-auto"></div>
          <p className="text-[#604B3B] font-medium">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    }>
      <PaymentReturn />
    </Suspense>
  );
}

