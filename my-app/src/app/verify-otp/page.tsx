import { Suspense } from "react";
import VerifyOtpPage from "@/components/VerifyOtpPage";
import Layout from "@/components/Layout";

function VerifyOtpWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#604B3B] border-t-transparent mx-auto"></div>
          <p className="text-[#604B3B]">Đang tải...</p>
        </div>
      </div>
    }>
      <VerifyOtpPage />
    </Suspense>
  );
}

export default function Page() {
  return (
    <Layout showSearch={false}>
      <VerifyOtpWrapper />
    </Layout>
  );
}
