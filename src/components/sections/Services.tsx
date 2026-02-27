import "./Services.css";
import ServiceCard from "@/components/ui/ServiceCard";

type Service = {
  slug: string;
  display: boolean;
  iconSrc: string;
  title: string;
  excerpt: string;
};

type ServicesProps = {
  intro?: {
    eyebrow?: string;
    heading: string;
    body?: string;
  };
  services: Service[];
  enableLinks?: boolean;
};

export default function Services({ intro, services, enableLinks = true }: ServicesProps) {
  const visible = services.filter((s) => s.display);
  return (
    <section className="section-regular">
      <div className="headingWrapper">
        {intro?.eyebrow ? <p className="beforeHeading">{intro.eyebrow}</p> : null}
        <h2 className="h2">{intro?.heading ?? "Services"}</h2>
        {intro?.body ? <p className="afterHeading">{intro.body}</p> : null}
      </div>
      <div className="cardWrapper">
        {visible.map((service) => (
          <ServiceCard
            key={service.slug}
            img={service.iconSrc}
            headline={service.title}
            bodyText={service.excerpt}
            href={enableLinks ? `/service/${service.slug}` : undefined}
          />
        ))}
      </div>
    </section>
  );
}
