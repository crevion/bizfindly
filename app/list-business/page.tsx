"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Dumbbell,
  Eye,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Info,
  MapPin,
  Palmtree,
  Phone,
  Plus,
  Send,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Upload,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import { useListingWizard } from "@/hooks/useListingWizard";
import { CATEGORIES, CATEGORY_LIST } from "@/content/listingCategories";
import { POPULAR_AREAS } from "@/content/discoverFilters";
import { LiveListingPreview } from "@/components/list-business/LiveListingPreview";
import { SuccessScreen } from "@/components/list-business/SuccessScreen";
import { cn } from "@/lib/utils";
import { parseCoordinatePair } from "@/lib/maps";
import type { ListingCategory, ListingDraft } from "@/types/listing";

const SECTIONS = [
  { id: 0, label: "Identity", icon: Store, desc: "Category & Name" },
  { id: 1, label: "Hours & Pricing", icon: Clock, desc: "Operating Info" },
  { id: 2, label: "Photos", icon: ImageIcon, desc: "Gallery & Media" },
  { id: 3, label: "Amenities & Story", icon: Sparkles, desc: "Facilities & Vibe" },
];

interface SamplePreset {
  label: string;
  category: ListingCategory;
  name: string;
  area: string;
  location: string;
  phone: string;
  hours: string;
  priceMin: string;
  priceMax: string;
  cuisine?: string;
  rooms?: string;
  checkIn?: string;
  checkOut?: string;
  description: string;
  tags: string[];
  facilities: Record<string, boolean>;
  images: Record<string, string[]>;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    label: "Restaurant Preset",
    category: "restaurant",
    name: "Skyline Garden Bistro",
    area: "Dhanmondi",
    location: "House 42, Road 27, Dhanmondi, Dhaka",
    phone: "+880 1711 223344",
    hours: "12:00 PM – 11:30 PM",
    priceMin: "600",
    priceMax: "2400",
    cuisine: "Continental & Pan-Asian",
    description:
      "Charming rooftop garden dining offering panoramic sunset views, artisanal coffee, wood-fired pizzas, and live acoustic music on weekends.",
    tags: ["Rooftop Dining", "Couple Friendly", "Instagrammable", "Live music"],
    facilities: { rooftop: true, parking: true, ac: true, liveMusic: true, reservation: true },
    images: {
      food: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      ],
      interior: [
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
      ],
    },
  },
  {
    label: "Resort Preset",
    category: "resort",
    name: "Green Valley Eco Retreat",
    area: "Gazipur",
    location: "Rajendrapur, Gazipur 1703",
    phone: "+880 1819 556677",
    hours: "Open 24/7",
    priceMin: "5500",
    priceMax: "18000",
    rooms: "18 Private Cottages",
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
    description:
      "Tranquil nature sanctuary surrounded by sal forests and natural waterbodies. Features private cottages, an infinity pool, boating, and BBQ under the stars.",
    tags: ["Staycation", "Nature Resort", "Family Resort", "Couple Retreat"],
    facilities: { pool: true, villa: true, bbq: true, wifi: true, parking: true },
    images: {
      rooms: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      ],
      property: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      ],
    },
  },
  {
    label: "Gym Preset",
    category: "gym",
    name: "IronCore Athletic Studio",
    area: "Uttara",
    location: "Sector 3, Uttara, Dhaka",
    phone: "+880 1912 889900",
    hours: "6:00 AM – 11:00 PM",
    priceMin: "2000",
    priceMax: "5500",
    description:
      "State-of-the-art strength and conditioning facility with imported equipment, certified female trainers, dedicated cardio zone, and shower facilities.",
    tags: ["Female Trainer", "CrossFit", "Beginner Friendly", "Premium Fitness"],
    facilities: { trainer: true, femaleTrainer: true, cardio: true, weights: true, ac: true, shower: true },
    images: {
      gym: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      ],
    },
  },
];

export default function ListBusinessPage() {
  const router = useRouter();
  const {
    user,
    authHydrated,
    hydrated,
    draft,
    updateDraft,
    publish,
    publishState,
    publishedId,
    publishError,
    published,
  } = useListingWizard();

  const [activeSection, setActiveSection] = useState<number>(0);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");

  // Google Maps copies "lat, lng" as one string — split it across both boxes.
  const pasteCoordinates = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pair = parseCoordinatePair(event.clipboardData.getData("text"));
    if (!pair) return;
    event.preventDefault();
    updateDraft({ latitude: pair.lat, longitude: pair.lng });
  };

  useEffect(() => {
    if (authHydrated && hydrated && !user) {
      router.replace("/join?next=/list-business");
    }
  }, [authHydrated, hydrated, user, router]);

  // Default to restaurant if no category selected yet
  useEffect(() => {
    if (hydrated && !draft.category) {
      updateDraft({ category: "restaurant" });
    }
  }, [hydrated, draft.category, updateDraft]);

  if (!authHydrated || !hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  const cfg = draft.category ? CATEGORIES[draft.category] : CATEGORIES.restaurant;

  // Check section completion
  const isSection1Complete = !!(draft.category && draft.name.trim() && draft.location.trim());
  const isSection2Complete = !!(draft.hours.trim() && draft.priceMin.trim());
  const allImages = Object.values(draft.images || {}).flat().filter(Boolean);
  const isSection3Complete = allImages.length > 0;
  const isSection4Complete = draft.description.trim().length > 10;

  const canPublish = isSection1Complete && isSection2Complete;

  const handleApplyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    updateDraft({
      category: preset.category,
      name: preset.name,
      area: preset.area,
      location: preset.location,
      phone: preset.phone,
      hours: preset.hours,
      priceMin: preset.priceMin,
      priceMax: preset.priceMax,
      cuisine: "cuisine" in preset ? (preset.cuisine as string) : "",
      rooms: "rooms" in preset ? (preset.rooms as string) : "",
      description: preset.description,
      tags: preset.tags,
      facilities: preset.facilities,
      images: preset.images,
    });
    toast.success(`Applied ${preset.label}!`);
  };

  const handleAddCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;
    const group = cfg?.imageGroups?.[0]?.key || "photos";
    const current = draft.images?.[group] || [];
    updateDraft({
      images: {
        ...draft.images,
        [group]: [...current, customPhotoUrl.trim()],
      },
    });
    setCustomPhotoUrl("");
    toast.success("Photo added to gallery");
  };

  const handleRemovePhoto = (group: string, index: number) => {
    const current = draft.images?.[group] || [];
    updateDraft({
      images: {
        ...draft.images,
        [group]: current.filter((_, i) => i !== index),
      },
    });
  };

  const handleToggleFacility = (key: string) => {
    updateDraft({
      facilities: {
        ...draft.facilities,
        [key]: !draft.facilities?.[key],
      },
    });
  };

  const handleToggleTag = (tag: string) => {
    const current = draft.tags || [];
    updateDraft({
      tags: current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    });
  };

  if (publishState === "done" && published?.category) {
    return (
      <SuccessScreen
        draft={published}
        cfg={CATEGORIES[published.category]}
        listingId={publishedId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-16">
      {/* Header Banner & Stepper */}
      <section className="border-b border-border/80 bg-gradient-to-b from-card to-background py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
                  <Store className="h-3.5 w-3.5" /> For Business Owners
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3 w-3" /> Autosaved draft
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                List your business on <span className="text-brand">BizFindly</span>
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Get discovered by thousands of active foodies, travelers, and fitness enthusiasts in Bangladesh.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Sample Presets Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-soft transition hover:border-brand/40 hover:text-brand cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 text-brand" />
                  <span>Try Sample Template</span>
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-52 rounded-2xl border border-border bg-card p-1.5 shadow-card group-hover:block z-50">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Instant Demo Presets
                  </div>
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-foreground transition hover:bg-muted cursor-pointer"
                    >
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Preview Trigger */}
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-soft transition hover:bg-muted lg:hidden cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Card Preview</span>
              </button>
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-border/70">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const isDone =
                (sec.id === 0 && isSection1Complete) ||
                (sec.id === 1 && isSection2Complete) ||
                (sec.id === 2 && isSection3Complete) ||
                (sec.id === 3 && isSection4Complete);

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer",
                    isActive
                      ? "bg-foreground text-background shadow-soft"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", isActive ? "text-background" : "text-brand")} />
                  <span>{sec.label}</span>
                  {isDone && !isActive && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          {/* Left Column: Interactive Form Sections */}
          <div className="space-y-8">
            {/* Section 0: Category & Core Identity */}
            {activeSection === 0 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    1. Choose Category & Core Identity
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select your business type and provide your location details.
                  </p>
                </div>

                {/* Category Cards */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Business Category *
                  </label>
                  <div className="mt-2.5 grid grid-cols-3 gap-3">
                    {CATEGORY_LIST.map((c) => {
                      const Icon = c.icon;
                      const isSelected = draft.category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => updateDraft({ category: c.id })}
                          className={cn(
                            "group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition cursor-pointer",
                            isSelected
                              ? "border-brand bg-brand-soft shadow-soft ring-2 ring-brand/30"
                              : "border-border bg-card hover:border-foreground/30",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-xl transition",
                              isSelected
                                ? "bg-brand text-brand-foreground"
                                : "bg-muted text-foreground group-hover:scale-105",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="mt-2.5 font-display text-sm font-bold text-foreground">
                            {c.label}
                          </div>
                          <div className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">
                            {c.id === "restaurant"
                              ? "Food & Cafés"
                              : c.id === "resort"
                                ? "Stays & Nature"
                                : "Fitness & Gyms"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Business Name */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {cfg?.nameLabel || "Business Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={draft.name}
                      onChange={(e) => updateDraft({ name: e.target.value })}
                      placeholder={
                        draft.category === "restaurant"
                          ? "e.g. Skyline Rooftop Bistro"
                          : draft.category === "resort"
                            ? "e.g. Green Valley Eco Resort"
                            : "e.g. Powerhouse Fitness Club"
                      }
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                    />
                  </div>

                  {/* Popular Area / City Picker */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Area / District *
                      </label>
                      <input
                        type="text"
                        required
                        value={draft.area}
                        onChange={(e) => updateDraft({ area: e.target.value })}
                        placeholder="e.g. Dhanmondi, Gulshan, Gazipur"
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {POPULAR_AREAS.slice(0, 5).map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => updateDraft({ area: a })}
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                              draft.area === a
                                ? "bg-brand text-brand-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Phone Number *
                      </label>
                      <div className="relative mt-1.5">
                        <Phone className="h-4 w-4 text-muted-foreground pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={draft.phone}
                          onChange={(e) => updateDraft({ phone: e.target.value })}
                          placeholder="+880 1700 000000"
                          className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Full Address / Street Location *
                    </label>
                    <div className="relative mt-1.5">
                      <MapPin className="h-4 w-4 text-muted-foreground pointer-events-none absolute left-3.5 top-3" />
                      <textarea
                        rows={2}
                        value={draft.location}
                        onChange={(e) => updateDraft({ location: e.target.value })}
                        placeholder="e.g. House 42, Road 27, Dhanmondi 15, Dhaka 1209"
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Google Maps link */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Google Maps Link (Optional)
                    </label>
                    <div className="relative mt-1.5">
                      <MapPin className="h-4 w-4 text-muted-foreground pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={draft.mapUrl}
                        onChange={(e) => updateDraft({ mapUrl: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Latitude (Optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        value={draft.latitude}
                        onChange={(e) => updateDraft({ latitude: e.target.value })}
                        onPaste={pasteCoordinates}
                        placeholder="23.7266815"
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Longitude (Optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        value={draft.longitude}
                        onChange={(e) => updateDraft({ longitude: e.target.value })}
                        onPaste={pasteCoordinates}
                        placeholder="90.3836836"
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Coordinates pin your exact spot on the map. Open your place in Google Maps,
                    right-click the pin and copy the two numbers — pasting them into either box
                    fills both.
                  </p>

                  {/* Website */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Website Link (Optional)
                    </label>
                    <div className="relative mt-1.5">
                      <Globe className="h-4 w-4 text-muted-foreground pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={draft.website || ""}
                        onChange={(e) => updateDraft({ website: e.target.value })}
                        placeholder="https://your-business.com"
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Navigation Buttons */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveSection(1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-soft transition hover:shadow-card cursor-pointer"
                  >
                    Continue to Hours & Pricing <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Section 1: Operating Hours & Pricing */}
            {activeSection === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    2. Operating Hours & Pricing
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Specify your opening schedules and estimated budget range.
                  </p>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
                  {/* Operating Hours */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Operating Hours *
                    </label>
                    <div className="relative mt-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={draft.hours}
                        onChange={(e) => updateDraft({ hours: e.target.value })}
                        placeholder="e.g. 11:00 AM – 11:30 PM"
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                    </div>
                    {/* Quick Presets for hours */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["11:00 AM – 11:00 PM", "12:00 PM – 11:30 PM", "6:00 AM – 10:00 PM", "24/7 Open"].map(
                        (h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => updateDraft({ hours: h })}
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[11px] font-medium transition cursor-pointer",
                              draft.hours === h
                                ? "bg-brand text-brand-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {h}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Minimum Price (৳) *
                      </label>
                      <div className="relative mt-1.5">
                        <span className="text-muted-foreground font-semibold pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">
                          ৳
                        </span>
                        <input
                          type="number"
                          value={draft.priceMin}
                          onChange={(e) => updateDraft({ priceMin: e.target.value })}
                          placeholder={cfg?.priceMinPlaceholder || "500"}
                          className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Maximum Price (৳)
                      </label>
                      <div className="relative mt-1.5">
                        <span className="text-muted-foreground font-semibold pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">
                          ৳
                        </span>
                        <input
                          type="number"
                          value={draft.priceMax}
                          onChange={(e) => updateDraft({ priceMax: e.target.value })}
                          placeholder={cfg?.priceMaxPlaceholder || "2500"}
                          className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category-Specific Fields */}
                  {draft.category === "restaurant" && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Cuisine Type / Specialty
                      </label>
                      <input
                        type="text"
                        value={draft.cuisine || ""}
                        onChange={(e) => updateDraft({ cuisine: e.target.value })}
                        placeholder="e.g. Continental, Japanese, Thai, Bengali, Steakhouse"
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                      />
                    </div>
                  )}

                  {draft.category === "resort" && (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Rooms / Units
                        </label>
                        <input
                          type="text"
                          value={draft.rooms || ""}
                          onChange={(e) => updateDraft({ rooms: e.target.value })}
                          placeholder="e.g. 12 Villas"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Check-in Time
                        </label>
                        <input
                          type="text"
                          value={draft.checkIn || ""}
                          onChange={(e) => updateDraft({ checkIn: e.target.value })}
                          placeholder="e.g. 1:00 PM"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Check-out Time
                        </label>
                        <input
                          type="text"
                          value={draft.checkOut || ""}
                          onChange={(e) => updateDraft({ checkOut: e.target.value })}
                          placeholder="e.g. 11:00 AM"
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection(0)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Identity
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-soft transition hover:shadow-card cursor-pointer"
                  >
                    Continue to Photos <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Section 2: Photos & Gallery */}
            {activeSection === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    3. Photos & Media Gallery
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload photos of your ambiance, food/services, and venue. Listings with photos get 5x more clicks!
                  </p>
                </div>

                {/* Upload via URL / Preset Photos */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-4">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Add Photo via Image URL
                  </h3>
                  <form onSubmit={handleAddCustomPhoto} className="flex gap-2">
                    <input
                      type="url"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition hover:bg-foreground/90 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </form>

                  {/* Curated Sample Stock Suggestions */}
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Or click to quickly add high-res samples:
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        {
                          name: "Ambiance 1",
                          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                        },
                        {
                          name: "Ambiance 2",
                          url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                        },
                        {
                          name: "Interior",
                          url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
                        },
                        {
                          name: "Resort Pool",
                          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                        },
                        {
                          name: "Gym Floor",
                          url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
                        },
                      ].map((sample) => (
                        <button
                          key={sample.name}
                          type="button"
                          onClick={() => {
                            const group = cfg?.imageGroups?.[0]?.key || "photos";
                            const current = draft.images?.[group] || [];
                            updateDraft({
                              images: {
                                ...draft.images,
                                [group]: [...current, sample.url],
                              },
                            });
                            toast.success(`Added ${sample.name}`);
                          }}
                          className="rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:text-brand cursor-pointer"
                        >
                          + {sample.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Uploaded Gallery Grid */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-sm font-bold text-foreground">
                      Gallery Photos ({allImages.length})
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      First photo is used as main banner
                    </span>
                  </div>

                  {allImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 text-center bg-muted/20">
                      <ImageIcon className="h-10 w-10 text-muted-foreground opacity-40" />
                      <p className="mt-3 text-sm font-semibold text-foreground">
                        No photos added yet
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Add an image URL above or pick from high-res samples
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {Object.entries(draft.images || {}).flatMap(([group, urls]) =>
                        (urls || []).map((url, i) => (
                          <div
                            key={`${group}-${i}`}
                            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted shadow-soft"
                          >
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            {i === 0 && group === Object.keys(draft.images || {})[0] && (
                              <span className="absolute bottom-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase text-brand-foreground shadow-sm">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(group, i)}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 cursor-pointer hover:bg-destructive"
                              aria-label="Remove photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )),
                      )}
                    </div>
                  )}
                </div>

                {/* Section Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection(1)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-soft transition hover:shadow-card cursor-pointer"
                  >
                    Continue to Amenities <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Section 3: Amenities, Vibe & Story */}
            {activeSection === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    4. Amenities, Tags & Story
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Highlight what makes your place special so our AI can match you with the right audience.
                  </p>
                </div>

                {/* Facilities Multi-Select */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Available Facilities & Amenities
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cfg?.facilities?.map((f) => {
                      const isSelected = !!draft.facilities?.[f.key];
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => handleToggleFacility(f.key)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                            isSelected
                              ? "border-brand bg-brand text-brand-foreground shadow-soft"
                              : "border-border bg-background text-foreground hover:border-foreground/30",
                          )}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vibe & Mood Tags */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Vibe & Audience Tags
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cfg?.tags?.map((t) => {
                      const isSelected = draft.tags?.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleToggleTag(t)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                            isSelected
                              ? "border-brand bg-brand-soft text-brand font-bold"
                              : "border-border bg-background text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {isSelected && <Tag className="h-3 w-3" />}
                          #{t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description & Story */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      About Your Place / Story *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleText =
                          draft.category === "restaurant"
                            ? "A welcoming culinary haven serving freshly crafted specialties with locally sourced ingredients, warm hospitality, and a vibrant dining atmosphere."
                            : draft.category === "resort"
                              ? "Escape the bustle of the city in our lush, peaceful retreat featuring modern cottages, scenic views, and relaxing recreational amenities for families and couples."
                              : "Premier fitness sanctuary equipped with top-grade machinery, certified personal trainers, and motivating group classes tailored for all fitness levels.";
                        updateDraft({ description: sampleText });
                        toast.success("Added AI sample description");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> AI Suggestion
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={draft.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                    placeholder="Tell patrons what makes your venue, dishes, or trainers unique..."
                    className="w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Publish Error Display */}
                {publishError && (
                  <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-xs font-medium text-destructive">
                    {publishError}
                  </div>
                )}

                {/* Section Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection(2)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Photos
                  </button>
                  <button
                    type="button"
                    onClick={publish}
                    disabled={!canPublish || publishState === "publishing"}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-base font-bold text-brand-foreground shadow-glow transition hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    {publishState === "publishing"
                      ? "Publishing Listing..."
                      : "Publish Business Listing"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Real-time Live Preview (Desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <LiveListingPreview
              draft={draft}
              cfg={cfg}
              onJumpToSection={(idx) => setActiveSection(idx)}
            />
          </div>
        </div>
      </main>

      {/* Floating Bottom Bar for Quick Actions (Mobile & Desktop) */}
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobilePreviewOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-soft"
          >
            <Eye className="h-4 w-4 text-brand" />
            <span>Card Preview</span>
          </button>

          <button
            type="button"
            onClick={activeSection === 3 ? publish : () => setActiveSection((s) => s + 1)}
            disabled={activeSection === 3 && (!canPublish || publishState === "publishing")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-xs font-bold text-brand-foreground shadow-soft"
          >
            {activeSection === 3
              ? publishState === "publishing"
                ? "Publishing..."
                : "Publish Listing"
              : `Next: ${SECTIONS[activeSection + 1]?.label || "Next"}`}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Live Preview Modal Sheet */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-background p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-muted/80 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-base font-bold text-foreground mb-4">
              Realtime Listing Preview
            </h3>
            <LiveListingPreview
              draft={draft}
              cfg={cfg}
              onJumpToSection={(idx) => {
                setActiveSection(idx);
                setMobilePreviewOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
