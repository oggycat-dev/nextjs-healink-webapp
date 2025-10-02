import Layout from "@/components/Layout";
import OrderDetailPage from "@/components/OrderDetailPage";

export default function OrderDetail() {
  return (
    <Layout showSearch={false}>
      <OrderDetailPage orderId="DH001" />
    </Layout>
  );
}
