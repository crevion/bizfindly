import type { Metadata } from "next";
import { MyReviews } from "@/components/reviews/MyReviews";

export const metadata: Metadata = {
  title: "My reviews — BizFindly",
};

export default function MyReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <MyReviews />
    </div>
  );
}
