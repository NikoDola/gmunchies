import "./Form.css";

type FormProps = {
  intro?: {
    eyebrow?: string;
    heading: string;
    body?: string;
  };
  services: { slug: string; title: string; display: boolean }[];
  locations: { slug: string; name: string }[];
};

export default function Form({ intro, services, locations }: FormProps) {
  const visibleServices = services.filter((s) => s.display);
  return (
    <div id="request-services-form" className="section-full formSection">
      <div className="section-regular">
        <div className="headingWrapper">
          {intro?.eyebrow ? <p className="beforeHeading">{intro.eyebrow}</p> : null}
          <h2 className="h2">{intro?.heading ?? "Request Service Today"}</h2>
          {intro?.body ? <p className="afterHeading">{intro.body}</p> : null}
        </div>
        <form className="formWrapper"> 
        <div className="twoInputsWrapper">
          <div className="oneInputWrapper">
            <label htmlFor="request-name">Your Name</label>
            <input id="request-name" type="text" name="name" placeholder="John Smith" />
          </div>
          <div className="oneInputWrapper">
            <label htmlFor="request-company">Company Name</label>
            <input id="request-company" type="text" name="company-name" placeholder="Skynet"/>
          </div>
        </div>

        <div className="twoInputsWrapper">
          <div className="oneInputWrapper">
            <label htmlFor="request-email">Email</label>
            <input id="request-email" type="email" name="email" placeholder="john@skynet" />
          </div>
          <div className="oneInputWrapper">
            <label htmlFor="request-phone">Phone</label>
            <input id="request-phone" type="tel" name="phone" placeholder="(555) 123- 7654"/>
          </div>
        </div>

        <div className="twoInputsWrapper">
          <div className="oneInputWrapper">
            <label htmlFor="request-service">Service interested in</label>
            <select id="request-service" name="service">
              <option>Select service</option>
              {visibleServices.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="oneInputWrapper">
            <label htmlFor="request-location">Location type</label>
            <select id="request-location" name="location">
              <option>Select location</option>
              {locations.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label htmlFor="request-description">Tell us about your needs</label>
        <textarea id="request-description" name="description" placeholder="How many employees or residents? Any specific requirements?"/>
          <button className="formButton">Request Service</button>
          <p className="text-center text-gray-500">No obligation. We'll reach out to discuss your needs.</p>
        </form>
      </div>
    </div>
  );
}
