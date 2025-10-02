import Layout from "@/components/Layout";
import OrdersPage from "@/components/OrdersPage";

export default function Orders() {
  return (
    <Layout showSearch={false}>
      <OrdersPage />
    </Layout>
  );
}
