import AuthPageIntegrated from "@/components/AuthPageIntegrated";
import Layout from "@/components/Layout";

export default function Auth() {
  return (
    <Layout showSearch={false}>
      <AuthPageIntegrated />
    </Layout>
  );
}
