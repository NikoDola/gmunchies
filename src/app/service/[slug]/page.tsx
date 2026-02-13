import Image from "next/image";
import { notFound } from "next/navigation";
import { getCmsContent } from "@/lib/content";
import ContentBlock from "@/components/ui/ContentBlock";

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
    <main>
      <section className="section-regular">
        <div className="headingWrapperLeft">
          <p className="beforeHeading">service</p>
          <h1>{service.title}</h1>
          <p className="afterHeading">{service.excerpt}</p>
        </div>

        <Image
          src={service.heroImageSrc}
          alt={service.title}
          width={1200}
          height={700}
          style={{ width: "100%", height: "auto", borderRadius: "1.25rem" }}
          priority
        />
      </section>

      <section className="section-regular">
        {service.blocks.map((b, idx) => (
          <div key={idx} style={{ marginTop: "var(--space-16)" }}>
            <ContentBlock
              layout={b.layout}
              eyebrow={b.eyebrow}
              heading={b.heading}
              body={b.body}
              imageSrc={b.imageSrc}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

