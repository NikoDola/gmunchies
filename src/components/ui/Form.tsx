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
            <label>Your Name</label>
            <input type="text" name="name" placeholder="John Smith" />
          </div>
          <div className="oneInputWrapper">
            <label>Company Name</label>
            <input type="text" name="company-name" placeholder="Skynet"/>
          </div>
        </div>

        <div className="twoInputsWrapper">
          <div className="oneInputWrapper">
            <label>Email</label>
            <input type="email" name="email" placeholder="john@skynet" />
          </div>
          <div className="oneInputWrapper">
            <label>Phone</label>
            <input type="number" placeholder="(555) 123- 7654"/>
          </div>
        </div>

        <div className="twoInputsWrapper">
          <div className="oneInputWrapper">
            <label>Service intersted in</label>
            <select>
              <option>Select service</option>
              {visibleServices.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div className="oneInputWrapper">
            <label>Location type</label>
            <select>
              <option>Select location</option>
              {locations.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Tell us about your needs</label>
        <textarea name="description" placeholder="How many eomplyees or residents? Any specific requirements?"/>
          <button className="formButton">Request Service</button>
          <label className="text-center text-gray-500">No obligation. We'll reach out to discuss your needs.</label>
        </form>
      </div>
    </div>
  );
}
