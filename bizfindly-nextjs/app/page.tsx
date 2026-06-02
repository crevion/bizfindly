import type { Metadata } from "next";
import { HeroSection } from "@/components/homepage/HeroSection";
import { CategoryShortcuts } from "@/components/homepage/CategoryShortcuts";
import { HomeFeed } from "@/components/homepage/HomeFeed";
import { HomeCtaStrip } from "@/components/homepage/HomeCtaStrip";

export const metadata: Metadata = {
  title: "BizFindly — Discover the best places around you",
  description:
    "AI-powered local discovery for restaurants, resorts and gyms in Bangladesh. Find places that match your mood, budget and vibe.",
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryShortcuts />
      <HomeFeed />
      <HomeCtaStrip />
    </div>
  );
}
