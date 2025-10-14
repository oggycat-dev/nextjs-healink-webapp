import EditPodcastForm from "@/components/EditPodcastForm";
import Layout from "@/components/Layout";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPodcastPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Layout>
      <EditPodcastForm podcastId={id} />
    </Layout>
  );
}
