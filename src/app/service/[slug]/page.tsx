import { notFound } from "next/navigation";
import { getCmsContent } from "@/lib/content";
import SAL from "@/featured/pages/SAL";


export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cms = await getCmsContent();

  const service = cms.services.find((s) => s.slug === slug);
  if (!service) return notFound();

  return (
    <SAL
      kind="service"
      eyebrow="service"
      title={service.title}
      description={service.excerpt}
      heroImageSrc={service.heroImageSrc}
      blocks={service.blocks}
    />
  );
}

