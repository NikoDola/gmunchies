import "./Services.css";
import ServiceCard from "./ServiceCard";

export default function Services() {
  return (
    <section className="section-regular">
      <h2 className="h2">Services</h2>
      <div className="cardWrapper">
        <ServiceCard
          img="/uploads/icon_snack-vending-machines.svg"
          headline="Snack Vending Machine"
          bodyText="  Modern snack machines with top brands and smart inventory support.
          Clean look, reliable performance, easy access."
        />
        <ServiceCard
          img="/uploads/icon_drink-vending-machines.svg"
          headline="Snack Vending Machine"
          bodyText="  Modern snack machines with top brands and smart inventory support.
          Clean look, reliable performance, easy access."
        />
        <ServiceCard
          img="/uploads/icon_combo-vending-machines.svg"
          headline="Snack Vending Machine"
          bodyText="  Modern snack machines with top brands and smart inventory support.
          Clean look, reliable performance, easy access."
        />
        <ServiceCard
          img="/uploads/icon_cashless-payments.svg"
          headline="Snack Vending Machine"
          bodyText="  Modern snack machines with top brands and smart inventory support.
          Clean look, reliable performance, easy access."
        />
        <ServiceCard
          img="/uploads/icon_instalation.svg"
          headline="Snack Vending Machine"
          bodyText="  Modern snack machines with top brands and smart inventory support.
          Clean look, reliable performance, easy access."
        />
        <ServiceCard
          img="/uploads/icon_maintenance.svg"
          headline="Snack Vending Machine"
          bodyText="  Modern snack machines with top brands and smart inventory support.
          Clean look, reliable performance, easy access."
        />
      </div>
    </section>
  );
}
