import "./LocationCard.css";
import type { IconType } from "react-icons";

type LocationCardProps = {
  name: string;
  Icon: IconType;
  description?: string;
  className?: string;
};

export default function LocationCard({ name, Icon, description, className }: LocationCardProps) {
  return (
    <div className={`locationCard ${className || ""}`}>
      <div className="locationCardIcon">
        <Icon className="locationIcon" />
      </div>
      <h4 className="locationCardTitle">{name}</h4>
      {description && <p className="locationCardDescription">{description}</p>}
    </div>
  );
}
