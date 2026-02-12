"use client";

import "./Testimonials.css";
import TestimonialCard from "./ui/TestimonialCard";

export default function Testimonials() {
  const cards = [1, 2, 3, 4, 5, 6, 7];

  return (
    <section className="section-full testimonialSection">
      <div className="testomonialWrapper">
        <div className="headingWrapper">
          <p className="beforeHeading">Our Happy clients</p>
          <h2 className="h2">Testimonials</h2>
          <p className="afterHeading">
            See what businesses say about working with us and how our vending
            solutions make a difference in their locations.
          </p>
        </div>

        <div className="testimonialSlider">
          <div className="testimonialTrack">
            {[...cards, ...cards].map((item, index) => (
              <div className="testimonialItem" key={index}>
                <TestimonialCard />
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
