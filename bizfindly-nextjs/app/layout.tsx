import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/common/AppShell";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BizFindly — AI-powered local discovery",
  description:
    "Discover the best restaurants, cafes and resorts in Bangladesh with AI-powered, mood-based recommendations.",
  openGraph: {
    title: "BizFindly — AI-powered local discovery",
    description:
      "Discover the best restaurants, cafes and resorts in Bangladesh with AI-powered, mood-based recommendations.",
    type: "website",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eb85f18b-a317-4a40-bce4-b6fa3e95e033/id-preview-0000c2b0--e7246adb-2971-43fe-8346-688bc712957e.lovable.app-1778375136306.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizFindly — AI-powered local discovery",
    description:
      "Vibe Finder is an AI-powered app for discovering local restaurants, cafes, and resorts in Bangladesh.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/eb85f18b-a317-4a40-bce4-b6fa3e95e033/id-preview-0000c2b0--e7246adb-2971-43fe-8346-688bc712957e.lovable.app-1778375136306.png",
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
