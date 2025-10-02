import AuthPage from "@/components/AuthPage";
import Layout from "@/components/Layout";

export default function Auth() {
  return (
    <Layout showSearch={false}>
      <AuthPage />
    </Layout>
  );
}
