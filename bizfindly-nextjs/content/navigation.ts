import { Compass, Heart, Home, Sparkles, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const HEADER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/discover?cat=restaurant", label: "Restaurants" },
  { to: "/discover?cat=resort", label: "Resorts" },
  { to: "/discover?cat=gym", label: "Gyms" },
] as const;

export const MOBILE_NAV_ITEMS: {
  to: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
];
