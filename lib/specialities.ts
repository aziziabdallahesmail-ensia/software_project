import {
  HeartPulse,
  Stethoscope,
  Eye,
  Brain,
  Microscope,
  CircleDot,
  LucideIcon,
} from "lucide-react";

export const SPECIALTIES: { name: string; icon: LucideIcon }[] = [
  {
    name: "Médecine Générale",
    icon: Stethoscope,
  },
  {
    name: "Cardiologie",
    icon: HeartPulse,
  },
  {
    name: "Dermatologie",
    icon: CircleDot,
  },
  {
    name: "Neurologie",
    icon: Brain,
  },
  {
    name: "Ophtalmologie",
    icon: Eye,
  },
  {
    name: "Autre",
    icon: Microscope,
  },
];