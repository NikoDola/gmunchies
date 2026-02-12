import "./Form.css";
export default function Form() {
  return (
    <div id="request-services-form" className="section-full formSection">
      <div className="section-regular">
        <div className="headingWrapper">
          <p className="beforeHeading">get startet</p>
          <h2 className="h2">Request Service Today</h2>
          <p className="afterHeading">Fill out the form below and we'll get back to you within 24 hours.</p>
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
              <option>Vending machines</option>
              <option>Micro Market</option>
              <option>Vending machines</option>
              <option>Vending machines</option>
            </select>
          </div>
          <div className="oneInputWrapper">
            <label>Location type</label>
            <select>
              <option>Select location</option>
              <option>Office Building</option>
              <option>Appartment Complex</option>
              <option>Ware House/Industrial</option>
              <option>Gym/Fitness-center</option>
              <option>Hospital / Healtcare</option>
              <option>School University</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <label>Tell us about your needs</label>
        <textarea name="description" placeholder="How many eomplyees or residents? Any specific requirements?"/>
          <button className="formButton">Request a Quote</button>
          <label className="text-center text-gray-500">No obligation. We'll reach out to discuss your needs.</label>
        </form>
      </div>
    </div>
  );
}
