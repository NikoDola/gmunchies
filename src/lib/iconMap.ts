import type { IconType } from "react-icons";
import {
  FaBuilding,
  FaDumbbell,
  FaGraduationCap,
  FaHome,
  FaHospital,
  FaMapMarkerAlt,
  FaWarehouse,
} from "react-icons/fa";

const ICONS: Record<string, IconType> = {
  FaBuilding,
  FaHome,
  FaWarehouse,
  FaDumbbell,
  FaHospital,
  FaGraduationCap,
  FaMapMarkerAlt,
};

export function getIconByKey(iconKey?: string): IconType {
  if (!iconKey) return FaMapMarkerAlt;
  return ICONS[iconKey] ?? FaMapMarkerAlt;
}

