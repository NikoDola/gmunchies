"use client";

import "./SAL.css";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ContentBlock, { type ContentBlockData } from "@/components/ui/ContentBlock";
import TestimonialCard from "@/components/ui/TestimonialCard";

type Testimonial = {
  id: string;
  locationSlug: string;
  quote: string;
  clientName: string;
  locationLabel?: string;
};

type SALProps = {
  kind: "service" | "location";
  eyebrow: string;
  title: string;
  description?: string;
  heroImageSrc?: string;
  blocks: ContentBlockData[];
  testimonials?: Testimonial[];
};

export default function SAL({
  kind,
  eyebrow,
  title,
  description,
  heroImageSrc,
  blocks,
  testimonials = [],
}: SALProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const handleScroll = () => {
      if (!imgRef.current) return;
      const scrollY = window.scrollY;
      imgRef.current.style.transform = `translateY(${scrollY * 0.55}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded]);

  return (
    <main>
      <section className="section-full salHeroWrapper">
        {heroImageSrc ? (
          <div ref={imgRef} className={`salParallaxWrapper ${isLoaded ? "loaded" : ""}`}>
            <Image
              className="salHeroImg"
              src={heroImageSrc}
              alt={title}
              fill
              priority
              quality={65}
              onLoadingComplete={() => setIsLoaded(true)}
            />
          </div>
        ) : null}

        <div className="salCTAWrapper">
          <p className="beforeHeading">{eyebrow}</p>
          <h1 className="salHeroHeading">{title}</h1>
          {description ? <p className="salHeroDescription">{description}</p> : null}
        </div>
      </section>

      <section className="section-regular">
        <div className="salContent">
          {blocks.length > 0 ? (
            <div className="salBlocks">
              {blocks.map((b, idx) => (
                <ContentBlock
                  key={idx}
                  layout={b.layout}
                  eyebrow={b.eyebrow}
                  heading={b.heading}
                  body={b.body}
                  imageSrc={b.imageSrc}
                />
              ))}
            </div>
          ) : null}

          {kind === "location" && testimonials.length > 0 ? (
            <div>
              <div className="headingWrapperLeft">
                <p className="beforeHeading">reviews</p>
                <h2 className="h2Left">What people say</h2>
              </div>

              <div className="salTestimonialsGrid">
                {testimonials.map((t) => (
                  <TestimonialCard
                    key={t.id}
                    locationLabel={t.locationLabel || title}
                    quote={t.quote}
                    clientName={t.clientName}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

