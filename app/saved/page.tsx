import type { Metadata } from "next";
import { SavedFeed } from "@/components/saved/SavedFeed";

export const metadata: Metadata = {
  title: "Saved — BizFindly",
};

export default function SavedPage() {
  return <SavedFeed />;
}
