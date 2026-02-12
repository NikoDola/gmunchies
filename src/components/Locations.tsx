import "./Locations.css";
import LocationCard from "./ui/LocationCard";
import { FaBuilding, FaHome, FaWarehouse, FaDumbbell, FaHospital, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";

const locations = [
  {
    name: "Office Building",
    Icon: FaBuilding,
    description: "Perfect for corporate environments and business centers"
  },
  {
    name: "Appartment Complex",
    Icon: FaHome,
    description: "Convenient solutions for residential communities"
  },
  {
    name: "Ware House/Industrial",
    Icon: FaWarehouse,
    description: "Reliable vending for industrial and warehouse facilities"
  },
  {
    name: "Gym/Fitness-center",
    Icon: FaDumbbell,
    description: "Healthy snacks and drinks for active members"
  },
  {
    name: "Hospital / Healtcare",
    Icon: FaHospital,
    description: "24/7 refreshment options for staff and visitors"
  },
  {
    name: "School University",
    Icon: FaGraduationCap,
    description: "Campus-wide vending solutions for students and faculty"
  },
  {
    name: "Other",
    Icon: FaMapMarkerAlt,
    description: "Custom solutions for your unique location"
  }
];

export default function Locations() {
  return (
    <section className="section-full locationSection">
      <div className="section-regular locationContainer">
        <div className="headingWrapper">
          <p className="beforeHeading">where we serve</p>
          <h2 className="h2">Locations</h2>
          <p className="afterHeading">
            We provide vending solutions for various locations. 
            Find the perfect fit for your space.
          </p>
        </div>
        <div className="locationGrid">
          {locations.map((location, index) => (
            <LocationCard
              key={index}
              name={location.name}
              Icon={location.Icon}
              description={location.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
