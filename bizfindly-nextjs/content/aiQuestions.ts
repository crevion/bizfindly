import type { AiStep } from "@/types/ai";

export const restaurantSteps: AiStep[] = [
  {
    key: "occasion",
    question: "What are you looking for today?",
    options: [
      "Family Dinner",
      "Couple Date",
      "Rooftop Dining",
      "Budget Meal",
      "Buffet",
      "Fine Dining",
      "Birthday",
      "Fast Food",
    ],
  },
  {
    key: "matters",
    question: "What matters most?",
    multi: true,
    options: [
      "Taste",
      "Interior",
      "Budget",
      "Quiet Environment",
      "Instagrammable",
      "Live Music",
      "Family Friendly",
      "Kids Friendly",
    ],
  },
  {
    key: "budget",
    question: "What's your budget?",
    options: ["Budget", "Mid-range", "Premium", "Luxury"],
  },
  {
    key: "cuisine",
    question: "Pick a cuisine",
    options: ["Bangla", "Chinese", "Thai", "Italian", "BBQ", "Seafood", "Dessert"],
  },
  {
    key: "area",
    question: "Where to?",
    options: ["Nearby", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara", "Old Dhaka"],
  },
  {
    key: "group",
    question: "Who's coming along?",
    options: ["Solo", "Couple", "Family", "Friends"],
  },
];

export const resortSteps: AiStep[] = [
  { key: "group", question: "Who's traveling?", options: ["Couple", "Family", "Friends", "Solo"] },
  {
    key: "budget",
    question: "What's your budget?",
    options: ["Budget", "Mid-range", "Premium", "Luxury"],
  },
  {
    key: "nights",
    question: "How many nights?",
    options: ["1 night", "2 nights", "3 nights", "4+ nights"],
  },
  {
    key: "vibe",
    question: "What's the vibe?",
    options: ["Beach", "Nature", "Luxury", "Adventure"],
  },
  { key: "pool", question: "Do you need a pool?", options: ["Yes", "No"] },
  { key: "kids", question: "Kids friendly?", options: ["Yes", "No"] },
  { key: "distance", question: "How far from Dhaka?", options: ["Near Dhaka", "Long Trip"] },
  { key: "energy", question: "Quiet or activity-focused?", options: ["Quiet", "Activity-focused"] },
];

export const gymSteps: AiStep[] = [
  { key: "gender", question: "Who's it for?", options: ["Men only", "Women only", "Mixed"] },
  {
    key: "goal",
    question: "What's your main goal?",
    options: ["Weight loss", "Muscle gain", "Endurance", "General fitness"],
  },
  {
    key: "budget",
    question: "Monthly budget?",
    options: ["Budget", "Mid-range", "Premium", "Luxury"],
  },
  {
    key: "facilities",
    question: "Must-have facilities",
    multi: true,
    options: ["AC", "Female Trainer", "Cardio", "Weight Training", "Shower Room", "Parking"],
  },
  {
    key: "area",
    question: "Where to?",
    options: ["Nearby", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara"],
  },
];
