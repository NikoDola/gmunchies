import { z } from "zod";

export const heroSchema = z.object({
  headline: z.string().min(1),
  body: z.string().min(1),
  image: z.string().startsWith("/uploads/"),
});

export const contentBlockSchema = z.object({
  layout: z.enum(["left", "right", "center"]),
  eyebrow: z.string().optional().default(""),
  heading: z.string().min(1),
  body: z.string().optional().default(""),
  imageSrc: z.string().optional().default(""),
});

export const serviceSchema = z.object({
  slug: z.string().min(1),
  display: z.boolean().default(true),
  iconSrc: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  heroImageSrc: z.string().min(1),
  blocks: z.array(contentBlockSchema).default([]),
});

export const locationSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().default(""),
  iconKey: z.string().min(1).optional().default("FaMapMarkerAlt"),
  heroImageSrc: z.string().optional().default(""),
  blocks: z.array(contentBlockSchema).default([]),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  locationSlug: z.string().min(1),
  quote: z.string().min(1),
  clientName: z.string().min(1),
  locationLabel: z.string().optional().default(""),
});

export const cmsSchema = z.object({
  navbar: z.object({
    logoSrc: z.string().min(1),
    logoHref: z.string().min(1),
    links: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })),
    ctaLabel: z.string().min(1),
  }),
  home: z.object({
    hero: z.object({
      headline: z.string().min(1),
      body: z.string().min(1),
      ctaLabel: z.string().min(1),
      imageSrc: z.string().min(1),
    }),
    servicesIntro: z
      .object({
        eyebrow: z.string().optional().default(""),
        heading: z.string().min(1),
        body: z.string().optional().default(""),
      })
      .optional(),
    locationsIntro: z
      .object({
        eyebrow: z.string().optional().default(""),
        heading: z.string().min(1),
        body: z.string().optional().default(""),
      })
      .optional(),
    testimonialsIntro: z
      .object({
        eyebrow: z.string().optional().default(""),
        heading: z.string().min(1),
        body: z.string().optional().default(""),
      })
      .optional(),
    formIntro: z
      .object({
        eyebrow: z.string().optional().default(""),
        heading: z.string().min(1),
        body: z.string().optional().default(""),
      })
      .optional(),
  }),
  services: z.array(serviceSchema).default([]),
  locations: z.array(locationSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
});
