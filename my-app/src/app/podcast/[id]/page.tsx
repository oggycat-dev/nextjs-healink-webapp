import PodcastDetailPage from "@/components/PodcastDetailPage";
import Layout from "@/components/Layout";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Layout>
      <PodcastDetailPage podcastId={id} />
    </Layout>
  );
}
