"use client";

import "./Results.css";
import { GiVendingMachine } from "react-icons/gi";
import ResultCard from "@/components/ui/ResultCard"
import { GoLocation } from "react-icons/go";
import { BiUser } from "react-icons/bi";
import { GrHostMaintenance } from "react-icons/gr";

export default function Counter() {
  return (
    <section className="section-full rsfWrapper">
      <h2 className="rsHeadline">Results</h2>

      <div className="rsCardsWrapper">
        <ResultCard headline="Machine Sold" target={150} Icon={GiVendingMachine}/>
        <ResultCard headline="Happy Clients" target={45} Icon={BiUser}/>
        <ResultCard headline="Locations" target={150} Icon={GoLocation}/>
        <ResultCard headline="Maintenance" target={14000} Icon={GrHostMaintenance}/>
      
      </div>
    </section>
  );
}
