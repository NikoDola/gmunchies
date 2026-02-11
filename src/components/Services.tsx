import "./Services.css";
import ServiceCard from "./ui/ServiceCard";

export default function Services() {
  return (
    <section className="section-regular">
      <h2 className="h2">Services</h2>
      <div className="cardWrapper">
        <ServiceCard
          img="/uploads/icon_snack-vending-machines.svg"
          headline="Snack Vending Machine"
          bodyText="Modern snack machines with top brands and smart inventory support. Clean look, reliable performance, easy"
        />
        <ServiceCard
          img="/uploads/icon_drink-vending-machines.svg"
          headline="Drinks Vending Machine"
          bodyText="Cold beverages, energy drinks, and bottled water with fast cooling and smooth dispensing."
        />
        <ServiceCard
          img="/uploads/icon_combo-vending-machines.svg"
          headline="Combo Vending Machine"
          bodyText="Snacks + drinks in one machine. Perfect for smaller spaces that still need variety."
        />
        <ServiceCard
          img="/uploads/icon_cashless-payments.svg"
          headline="Cachless Payment"
          bodyText="Apple Pay, Google Pay, tap-to-pay cards, and mobile wallets. Fast and simple."
        />
        <ServiceCard
          img="/uploads/icon_instalation.svg"
          headline="Machine Installation & Setup"
          bodyText="Delivery, placement, and setup handled from start to finish."
        />
        <ServiceCard
          img="/uploads/icon_maintenance.svg"
          headline="Snack Vending Machine"
          bodyText="Regular service, refills, and technical support so machines always stay ready."
        />
      </div>
    </section>
  );
}
