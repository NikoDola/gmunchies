import "./ContactUsPage.css";
import Link from "next/link";
import { MdEmail, MdPhone, MdPlace } from "react-icons/md";
import { getCmsContent } from "@/lib/content";
import Form from "@/components/ui/Form";

export default async function ContactUsPage() {
  const cms = await getCmsContent();
  const email = "hello@example.com";
  const phoneDisplay = "(555) 123-4567";
  const phoneHref = "+15551234567";

  return (
    <main>
      <section className="section-full contactUsSection">
        <div className="section-regular contactUsInner">
          <div className="headingWrapper">
            <h1 className="h1">Contact Us</h1>
            <p className="afterHeading">
              Have a question or interested in any of our vending services? Get in touch by filling out the form below or contacting us directly via email or phone. To request service, simply complete one of our{" "}
              <Link href="/#request-services-form" className="contactUsRequestLink">
                Request Service
              </Link>{" "}
              forms available throughout the site.
            </p>
          </div>

          <div className="contactUsGrid">
            <div className="contactUsFormCard">
              <Form
                services={cms.services}
                locations={cms.locations}
                source="contact-us"
                submitLabel="Send Message"
              />
            </div>

            <div className="contactUsInfoCard">
              <div className="contactUsDetails">
                <div className="contactUsItem">
                  <span className="contactUsIcon" aria-hidden="true">
                    <MdEmail size={20} />
                  </span>
                  <a href={`mailto:${email}`} className="contactUsLink">
                    {email}
                  </a>
                </div>
                <div className="contactUsItem">
                  <span className="contactUsIcon" aria-hidden="true">
                    <MdPhone size={20} />
                  </span>
                  <a href={`tel:${phoneHref}`} className="contactUsLink">
                    {phoneDisplay}
                  </a>
                </div>
                <div className="contactUsItem">
                  <span className="contactUsIcon" aria-hidden="true">
                    <MdPlace size={20} />
                  </span>
                  <p className="contactUsText">United States</p>
                </div>
              </div>

              <div className="contactUsMapFrame">
                <iframe
                  title="Service area map"
                  src="https://maps.google.com/maps?ll=39.8283,-98.5795&z=4&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="contactUsCaption">
                Proudly serving businesses nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

