import type { Metadata } from "next";
import { HeroSection } from "@/components/homepage/HeroSection";
import { HomeFeed } from "@/components/homepage/HomeFeed";
import { Collections } from "@/components/homepage/Collections";
import { WhyBizFindly } from "@/components/homepage/WhyBizFindly";
import { HomeCtaStrip } from "@/components/homepage/HomeCtaStrip";

export const metadata: Metadata = {
  title: "BizFindly — AI-powered local discovery for Bangladesh",
  description:
    "Discover restaurants, resorts and gyms across Bangladesh with AI-powered search, verified listings, and curated collections.",
  openGraph: {
    title: "BizFindly — AI-powered local discovery",
    description: "Find restaurants, resorts and gyms that match your mood, budget and vibe.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BizFindly — AI-powered Local discovery",
    description: "Vibe Finder is an AI-powered app for discovering local restaurants, cafes, and resorts in Bangladesh.",
  },
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <HomeFeed />
      <Collections />
      <WhyBizFindly />
      <HomeCtaStrip />
    </div>
  );
}
