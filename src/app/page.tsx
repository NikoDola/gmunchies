import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Results from "@/components/Results";
import Form from "@/components/ui/Form";
import Testomonials from "@/components/Testemonials";
import Locations from "@/components/Locations";
import { getCmsContent } from "@/lib/content";

export default async function Home() {
  const cms = await getCmsContent();
  return (
    <main>
      <Hero
        headline={cms.home.hero.headline}
        body={cms.home.hero.body}
        ctaLabel={cms.home.hero.ctaLabel}
        imageSrc={cms.home.hero.imageSrc}
      />
      <Services intro={cms.home.servicesIntro} services={cms.services} />
      <Locations intro={cms.home.locationsIntro} locations={cms.locations} />
      <Results />
      <Testomonials intro={cms.home.testimonialsIntro} testimonials={cms.testimonials} />
      <Form intro={cms.home.formIntro} services={cms.services} locations={cms.locations} />
    </main>
  );
}
