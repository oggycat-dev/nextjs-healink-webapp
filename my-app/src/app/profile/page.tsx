import Layout from "@/components/Layout";
import UserProfilePage from "@/components/UserProfilePage";

export default function ProfilePage() {
  return (
    <Layout showSearch={false}>
      <UserProfilePage />
    </Layout>
  );
}
