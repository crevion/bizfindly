import type { PlaceReview } from "@/types/place";

export const sampleReviews: PlaceReview[] = [
  {
    user: "Tahmid R.",
    rating: 5,
    date: "2 days ago",
    text: "Stunning rooftop and the lamb shank biryani was unreal. Service was attentive without being intrusive.",
    avatar: "TR",
  },
  {
    user: "Nazia A.",
    rating: 4,
    date: "1 week ago",
    text: "Loved the live music on Friday night. Bit pricey but the vibe makes up for it.",
    avatar: "NA",
  },
  {
    user: "Rafi K.",
    rating: 5,
    date: "3 weeks ago",
    text: "Took my parents for their anniversary — they loved it. Quiet corner table on request.",
    avatar: "RK",
  },
];

export const dashboardReviews = [
  { name: "Rumi A.", text: "Loved the rooftop vibe and the food. Will be back!", rating: 5 },
  { name: "Tasnim K.", text: "Great service. Pricing is fair for the quality.", rating: 4 },
];
