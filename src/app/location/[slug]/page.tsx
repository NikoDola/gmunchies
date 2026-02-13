import Image from "next/image";
import { notFound } from "next/navigation";
import { getCmsContent } from "@/lib/content";
import ContentBlock from "@/components/ui/ContentBlock";
import TestimonialCard from "@/components/ui/TestimonialCard";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cms = await getCmsContent();

  const location = cms.locations.find((l) => l.slug === slug);
  if (!location) return notFound();

  const testimonials = cms.testimonials.filter((t) => t.locationSlug === slug);

  return (
    <main>
      <section className="section-regular">
        <div className="headingWrapperLeft">
          <p className="beforeHeading">location</p>
          <h1>{location.name}</h1>
          {location.description ? <p className="afterHeading">{location.description}</p> : null}
        </div>

        {location.heroImageSrc ? (
          <Image
            src={location.heroImageSrc}
            alt={location.name}
            width={1200}
            height={700}
            style={{ width: "100%", height: "auto", borderRadius: "1.25rem" }}
            priority
          />
        ) : null}
      </section>

      <section className="section-regular">
        {location.blocks.map((b, idx) => (
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

      {testimonials.length > 0 ? (
        <section className="section-regular" style={{ marginTop: "var(--space-16)" }}>
          <div className="headingWrapperLeft">
            <p className="beforeHeading">reviews</p>
            <h2 className="h2Left">What people say</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-12)",
            }}
          >
            {testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                locationLabel={t.locationLabel || location.name}
                quote={t.quote}
                clientName={t.clientName}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

