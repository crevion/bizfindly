import { Dumbbell, Palmtree, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { AiTrack } from "@/types/ai";

export const TRACKS: {
  key: AiTrack;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  accent: string;
  ring: string;
}[] = [
  {
    key: "restaurant",
    title: "Restaurants",
    subtitle: "Where to eat tonight",
    Icon: UtensilsCrossed,
    accent: "from-orange-500 to-rose-500",
    ring: "ring-orange-500/40",
  },
  {
    key: "resort",
    title: "Resorts",
    subtitle: "Plan a weekend escape",
    Icon: Palmtree,
    accent: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/40",
  },
  {
    key: "gym",
    title: "Gyms",
    subtitle: "Find your training home",
    Icon: Dumbbell,
    accent: "from-indigo-500 to-violet-500",
    ring: "ring-indigo-500/40",
  },
];
