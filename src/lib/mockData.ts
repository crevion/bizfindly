export type Category = "restaurant" | "cafe" | "resort" | "gym";

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: Category;
  cuisine?: string;
  location: string;
  area: string;
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  priceLevel: 1 | 2 | 3 | 4; // budget → luxury
  priceRange: string;
  tags: string[];
  facilities: string[];
  hours: string;
  phone: string;
  website?: string;
  description: string;
  aiSummary: string;
  matchScore?: number;
  trending?: boolean;
  hiddenGem?: boolean;
  verified?: boolean;
  coords?: { lat: number; lng: number };
  menu?: { category: string; items: { name: string; price: string }[] }[];
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const places: Place[] = [
  {
    id: "1",
    slug: "noor-rooftop",
    name: "Noor Rooftop",
    category: "restaurant",
    cuisine: "Bangla • Continental",
    location: "Gulshan 2, Dhaka",
    area: "Gulshan",
    image: img("photo-1517248135467-4c7edcad34c4"),
    gallery: [
      img("photo-1517248135467-4c7edcad34c4"),
      img("photo-1551218808-94e220e084d2"),
      img("photo-1414235077428-338989a2e8c0"),
      img("photo-1559339352-11d035aa65de"),
    ],
    rating: 4.8,
    reviews: 1284,
    priceLevel: 3,
    priceRange: "৳৳৳ • 1500–2500 per person",
    tags: ["Best Rooftop", "Couple Spot", "Trending"],
    facilities: ["Rooftop", "Live Music", "Parking", "Card Accepted", "AC"],
    hours: "12:00 PM – 11:30 PM",
    phone: "+880 1700 000001",
    website: "noorrooftop.com",
    description:
      "Skyline-facing rooftop with warm lantern lighting, fusion menu and acoustic live music on weekends.",
    aiSummary:
      "Perfect for couples and small groups looking for an instagrammable rooftop dinner with mid-premium pricing.",
    trending: true,
    verified: true,
    menu: [
      {
        category: "Signature",
        items: [
          { name: "Lamb Shank Biryani", price: "৳ 890" },
          { name: "Truffle Mushroom Pasta", price: "৳ 760" },
        ],
      },
      {
        category: "Drinks",
        items: [
          { name: "Saffron Lassi", price: "৳ 240" },
          { name: "Cold Brew", price: "৳ 280" },
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "bay-leaf-cafe",
    name: "Bay Leaf Café",
    category: "cafe",
    cuisine: "Café • Dessert",
    location: "Dhanmondi 27, Dhaka",
    area: "Dhanmondi",
    image: img("photo-1554118811-1e0d58224f24"),
    gallery: [
      img("photo-1554118811-1e0d58224f24"),
      img("photo-1453614512568-c4024d13c247"),
      img("photo-1521017432531-fbd92d768814"),
    ],
    rating: 4.6,
    reviews: 842,
    priceLevel: 2,
    priceRange: "৳৳ • 500–900 per person",
    tags: ["Hidden Gem", "Instagrammable", "Quiet"],
    facilities: ["WiFi", "AC", "Outdoor Seating", "Card Accepted"],
    hours: "9:00 AM – 11:00 PM",
    phone: "+880 1700 000002",
    description:
      "Cozy plant-filled café known for cold brews, hand-crafted pastries and a quiet upstairs work corner.",
    aiSummary:
      "Great for solo work sessions, casual catch-ups, and dessert dates with a budget-friendly vibe.",
    hiddenGem: true,
    verified: true,
  },
  {
    id: "3",
    slug: "sahara-beach-resort",
    name: "Sahara Beach Resort",
    category: "resort",
    location: "Cox's Bazar",
    area: "Cox's Bazar",
    image: img("photo-1566073771259-6a8506099945"),
    gallery: [
      img("photo-1566073771259-6a8506099945"),
      img("photo-1582719508461-905c673771fd"),
      img("photo-1571896349842-33c89424de2d"),
      img("photo-1540541338287-41700207dee6"),
    ],
    rating: 4.9,
    reviews: 2105,
    priceLevel: 4,
    priceRange: "৳৳৳৳ • 12,000+ per night",
    tags: ["Beach", "Luxury", "Couple Spot"],
    facilities: ["Pool", "Beachfront", "Spa", "Restaurant", "Kids Zone", "Parking"],
    hours: "24/7 Reception",
    phone: "+880 1700 000003",
    website: "sahararesort.com",
    description:
      "Beachfront luxury with infinity pool, full-service spa and panoramic ocean-view suites.",
    aiSummary:
      "Ideal for honeymoons and family escapes seeking premium beachfront comfort with spa and pool.",
    trending: true,
    verified: true,
  },
  {
    id: "4",
    slug: "kacchi-bhai",
    name: "Kacchi Bhai",
    category: "restaurant",
    cuisine: "Bangla • Biryani",
    location: "Bashundhara, Dhaka",
    area: "Bashundhara",
    image: img("photo-1631515243349-e0cb75fb8d3a"),
    gallery: [img("photo-1631515243349-e0cb75fb8d3a"), img("photo-1604908176997-125f25cc6f3d")],
    rating: 4.5,
    reviews: 5240,
    priceLevel: 1,
    priceRange: "৳ • 350–500 per person",
    tags: ["Budget Friendly", "Family Friendly", "Most Saved"],
    facilities: ["AC", "Family Section", "Takeaway", "Parking"],
    hours: "12:00 PM – 11:00 PM",
    phone: "+880 1700 000004",
    description:
      "Iconic kacchi biryani served in a no-frills, energetic family setting. A local legend.",
    aiSummary:
      "Best for family meals on a budget — authentic taste over fancy interior.",
    verified: true,
  },
  {
    id: "5",
    slug: "north-end-coffee",
    name: "North End Coffee",
    category: "cafe",
    cuisine: "Café • Specialty Coffee",
    location: "Banani 11, Dhaka",
    area: "Banani",
    image: img("photo-1495474472287-4d71bcdd2085"),
    gallery: [img("photo-1495474472287-4d71bcdd2085"), img("photo-1442512595331-e89e73853f31")],
    rating: 4.7,
    reviews: 1102,
    priceLevel: 2,
    priceRange: "৳৳ • 400–800 per person",
    tags: ["Trending", "Best Coffee", "WiFi"],
    facilities: ["WiFi", "AC", "Power Outlets", "Card Accepted"],
    hours: "8:00 AM – 11:00 PM",
    phone: "+880 1700 000005",
    description: "Bangladesh's pioneering specialty coffee roaster with a warm minimalist space.",
    aiSummary: "Perfect for remote work, casual meetings, and serious coffee lovers.",
    trending: true,
    verified: true,
  },
  {
    id: "6",
    slug: "sajek-cloud-resort",
    name: "Sajek Cloud Resort",
    category: "resort",
    location: "Sajek Valley, Rangamati",
    area: "Sajek",
    image: img("photo-1469854523086-cc02fe5d8800"),
    gallery: [img("photo-1469854523086-cc02fe5d8800"), img("photo-1470770841072-f978cf4d019e")],
    rating: 4.7,
    reviews: 980,
    priceLevel: 2,
    priceRange: "৳৳ • 4,500+ per night",
    tags: ["Nature", "Hidden Gem", "Adventure"],
    facilities: ["Mountain View", "Restaurant", "Bonfire", "Guide Service"],
    hours: "24/7 Reception",
    phone: "+880 1700 000006",
    description: "Wake up above the clouds in cozy wooden cottages with sweeping valley views.",
    aiSummary: "Best for friends and couples seeking a nature escape on a moderate budget.",
    hiddenGem: true,
    verified: true,
  },
  {
    id: "7",
    slug: "izumi-japanese",
    name: "Izumi",
    category: "restaurant",
    cuisine: "Japanese • Sushi",
    location: "Gulshan 1, Dhaka",
    area: "Gulshan",
    image: img("photo-1579871494447-9811cf80d66c"),
    gallery: [img("photo-1579871494447-9811cf80d66c"), img("photo-1546069901-ba9599a7e63c")],
    rating: 4.8,
    reviews: 760,
    priceLevel: 4,
    priceRange: "৳৳৳৳ • 3000+ per person",
    tags: ["Fine Dining", "Couple Spot", "Premium"],
    facilities: ["AC", "Private Room", "Card Accepted", "Valet Parking"],
    hours: "12:30 PM – 10:30 PM",
    phone: "+880 1700 000007",
    description: "Refined omakase and authentic ramen in an intimate dark-wood setting.",
    aiSummary: "Ideal for fine-dining date nights and special celebrations.",
    verified: true,
  },
  {
    id: "8",
    slug: "purnima-resort",
    name: "Purnima Lake Resort",
    category: "resort",
    location: "Gazipur",
    area: "Gazipur",
    image: img("photo-1520250497591-112f2f40a3f4"),
    gallery: [img("photo-1520250497591-112f2f40a3f4"), img("photo-1564501049412-61c2a3083791")],
    rating: 4.4,
    reviews: 612,
    priceLevel: 2,
    priceRange: "৳৳ • 5,500+ per night",
    tags: ["Near Dhaka", "Family Friendly", "Pool"],
    facilities: ["Pool", "Lake View", "Kids Zone", "Restaurant", "Parking"],
    hours: "24/7 Reception",
    phone: "+880 1700 000008",
    description: "Quick weekend getaway with lakeside cottages, large pool and kid-friendly play areas.",
    aiSummary: "Great for families wanting a short Dhaka escape with a pool and kids zone.",
    verified: true,
  },
  {
    id: "9",
    slug: "ironcore-gym",
    name: "IronCore Fitness",
    category: "gym",
    location: "Banani 11, Dhaka",
    area: "Banani",
    image: img("photo-1534438327276-14e5300c3a48"),
    gallery: [img("photo-1534438327276-14e5300c3a48"), img("photo-1517836357463-d25dfeac3438")],
    rating: 4.7,
    reviews: 432,
    priceLevel: 3,
    priceRange: "৳৳৳ • 4,500/month",
    tags: ["Premium Gym", "Weight Training", "AC"],
    facilities: ["AC", "Weight Training", "Cardio", "Shower Room", "Female Trainer", "Parking"],
    hours: "6:00 AM – 11:00 PM",
    phone: "+880 1700 000009",
    description: "Premium strength-and-conditioning gym with imported equipment and certified coaches.",
    aiSummary: "Best for serious lifters and professionals wanting a premium AC training environment.",
    trending: true,
    verified: true,
  },
  {
    id: "10",
    slug: "fitfly-women",
    name: "FitFly Women's Studio",
    category: "gym",
    location: "Dhanmondi 15, Dhaka",
    area: "Dhanmondi",
    image: img("photo-1518611012118-696072aa579a"),
    gallery: [img("photo-1518611012118-696072aa579a")],
    rating: 4.8,
    reviews: 287,
    priceLevel: 2,
    priceRange: "৳৳ • 2,800/month",
    tags: ["Women Friendly", "Female Trainer", "Hidden Gem"],
    facilities: ["AC", "Female Trainer", "Cardio", "Yoga", "Shower Room"],
    hours: "7:00 AM – 10:00 PM",
    phone: "+880 1700 000010",
    description: "Women-only fitness studio with certified female trainers, yoga and HIIT classes.",
    aiSummary: "Ideal for women seeking a private, supportive training environment.",
    hiddenGem: true,
    verified: true,
  },
  {
    id: "11",
    slug: "powerhouse-uttara",
    name: "PowerHouse Uttara",
    category: "gym",
    location: "Uttara Sector 7, Dhaka",
    area: "Uttara",
    image: img("photo-1571902943202-507ec2618e8f"),
    gallery: [img("photo-1571902943202-507ec2618e8f")],
    rating: 4.4,
    reviews: 198,
    priceLevel: 1,
    priceRange: "৳ • 1,500/month",
    tags: ["Budget Gym", "Weight Training"],
    facilities: ["Weight Training", "Cardio", "Shower Room"],
    hours: "5:30 AM – 11:30 PM",
    phone: "+880 1700 000011",
    description: "No-frills neighborhood gym with everything you need to train hard on a budget.",
    aiSummary: "Great pick for budget-conscious lifters in Uttara.",
    verified: true,
  },
];

export const findPlace = (slug: string) => places.find((p) => p.slug === slug);

export const cuisines = ["Bangla", "Chinese", "Thai", "Italian", "BBQ", "Seafood", "Cafe", "Dessert"];
export const areas = ["Nearby", "Dhanmondi", "Gulshan", "Banani", "Uttara", "Bashundhara", "Gazipur", "Cox's Bazar", "Sajek", "Old Dhaka"];
