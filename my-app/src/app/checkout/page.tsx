import { Suspense } from "react";
import Layout from "@/components/Layout";
import CheckoutPage from "@/components/CheckoutPage";

function CheckoutPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#604B3B] border-t-transparent mx-auto"></div>
          <p className="text-[#604B3B]">Đang tải...</p>
        </div>
      </div>
    }>
      <CheckoutPage />
    </Suspense>
  );
}

export default function Checkout() {
  return (
    <Layout showSearch={false}>
      <CheckoutPageWrapper />
    </Layout>
  );
}
