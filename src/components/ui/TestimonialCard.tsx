import "./TestimonialCard.css";

export default function TestimonialCard({
  locationLabel,
  quote,
  clientName,
}: {
  locationLabel: string;
  quote: string;
  clientName: string;
}) {
  return (
    <div className="TestimonialCardWrapper">
      <div className="headingWrapper">
        <p className="industrial">{locationLabel}</p>
        <p className="testimonialDescription">{quote}</p>
      </div>
      <div className="hrLine"></div>
      <h4 className="clientName">{clientName}</h4>
    </div>
  );
}
