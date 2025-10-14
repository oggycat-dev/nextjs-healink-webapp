import HomepageContent from "./HomepageContent";
import Layout from "./Layout";

export default function Homepage() {
  return (
    <Layout showSearch={true}>
      <HomepageContent />
    </Layout>
  );
}
