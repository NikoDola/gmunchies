import "./Locations.css";
import LocationCard from "@/components/ui/LocationCard";
import Link from "next/link";
import { getIconByKey } from "@/lib/iconMap";
//quick test
type Location = {
  slug: string;
  name: string;
  description?: string;
  iconKey?: string;
};

type LocationsProps = {
  intro?: {
    eyebrow?: string;
    heading: string;
    body?: string;
  };
  locations: Location[];
};

export default function Locations({ intro, locations }: LocationsProps) {
  return (
    <section className="section-full locationSection">
      <div className="section-regular locationContainer">
        <div className="headingWrapper">
          {intro?.eyebrow ? <p className="beforeHeading">{intro.eyebrow}</p> : null}
          <h2 className="h2">{intro?.heading ?? "Locations"}</h2>
          {intro?.body ? <p className="afterHeading">{intro.body}</p> : null}
        </div>
        <div className="locationGrid">
          {locations.map((location, index) => (
            <Link
              key={location.slug}
              href={`/location/${location.slug}`}
              className="locationCardLink"
            >
              <LocationCard
                name={location.name}
                Icon={getIconByKey(location.iconKey)}
                description={location.description}
                className={location.slug === "other" ? "centerCard" : ""}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
