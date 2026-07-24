const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gmunchiesvending.com";

export default function SiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "GMunchies Vending",
        "description":
          "Smart, reliable vending solutions for offices and businesses across the United States.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/?s={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        "name": "GMunchies Vending",
        "url": siteUrl,
        "logo": `${siteUrl}/branding/logo.svg`,
        "telephone": "+15551234567",
        "email": "hello@example.com",
        "areaServed": {
          "@type": "Place",
          "name": "United States",
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "US",
        },
      },
      // SiteNavigationElement hints Google toward showing these as Sitelinks
      {
        "@type": "SiteNavigationElement",
        "name": "Services",
        "url": `${siteUrl}/services`,
      },
      {
        "@type": "SiteNavigationElement",
        "name": "About Us",
        "url": `${siteUrl}/about`,
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Request Service",
        "url": `${siteUrl}/#request-services-form`,
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Contact Us",
        "url": `${siteUrl}/contact-us`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
