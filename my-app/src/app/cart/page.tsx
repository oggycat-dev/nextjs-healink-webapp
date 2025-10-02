import CartPage from "@/components/CartPage";
import Layout from "@/components/Layout";

export default function Cart() {
  return (
    <Layout showSearch={true}>
      <CartPage />
    </Layout>
  );
}