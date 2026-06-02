"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Place, PlaceReview } from "@/types/place";
import { getPlace, getPlaceReviews, listPlaces } from "@/lib/backend/places";
import { getPlaceVerification } from "@/lib/verification";
import {
  AboutSection,
  AiSummary,
  FacilityList,
  MenuSection,
  ReviewList,
  TagList,
} from "@/components/place/PlaceBodySections";
import { CouponCard } from "@/components/place/CouponCard";
import { Lightbox } from "@/components/place/Lightbox";
import { OwnerStatusBanner } from "@/components/place/OwnerStatusBanner";
import { PlaceGallery } from "@/components/place/PlaceGallery";
import { PlaceTitle } from "@/components/place/PlaceTitle";
import { PricingSidebar } from "@/components/place/PricingSidebar";
import { SimilarPlaces } from "@/components/place/SimilarPlaces";
import { useLightbox } from "@/hooks/useLightbox";

export function PlaceDetail({ slug }: { slug: string }) {
  const [place, setPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<PlaceReview[]>([]);
  const [similar, setSimilar] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const lightbox = useLightbox(place?.gallery.length ?? 0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPlace(slug)
      .then(async (p) => {
        if (!active) return;
        setPlace(p);
        if (!p) return;
        const [reviewList, sameCategory] = await Promise.all([
          getPlaceReviews(p),
          listPlaces(p.category).catch(() => []),
        ]);
        if (!active) return;
        setReviews(reviewList);
        setSimilar(sameCategory.filter((s) => s.slug !== p.slug).slice(0, 4));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="bg-card h-72 w-full animate-pulse rounded-3xl" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-4">
            <div className="bg-card h-10 w-2/3 animate-pulse rounded-2xl" />
            <div className="bg-card h-32 w-full animate-pulse rounded-2xl" />
            <div className="bg-card h-48 w-full animate-pulse rounded-2xl" />
          </div>
          <div className="bg-card h-64 w-full animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Place not found</h1>
        <Link href="/discover" className="text-brand mt-4 inline-block">
          Back to discover
        </Link>
      </div>
    );
  }

  const verification = getPlaceVerification(place.slug);
  const status =
    verification.status === "verified" || place.verified ? "verified" : verification.status;

  return (
    <div>
      <PlaceGallery gallery={place.gallery} name={place.name} onOpenAt={lightbox.open} />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <PlaceTitle place={place} verificationStatus={status} />
            <OwnerStatusBanner status={status} />
            {place.aiSummary && <AiSummary summary={place.aiSummary} />}
            {place.description && <AboutSection description={place.description} />}
            {place.tags.length > 0 && <TagList tags={place.tags} />}
            {place.facilities.length > 0 && <FacilityList facilities={place.facilities} />}
            {place.menu && <MenuSection menu={place.menu} />}
            <ReviewList reviews={reviews} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PricingSidebar place={place} />
            <CouponCard placeName={place.name} />
          </aside>
        </div>

        {similar.length > 0 && <SimilarPlaces places={similar} />}
      </div>

      {lightbox.index !== null && (
        <Lightbox
          gallery={place.gallery}
          index={lightbox.index}
          onClose={lightbox.close}
          onPrev={lightbox.prev}
          onNext={lightbox.next}
          onPickIndex={lightbox.open}
        />
      )}
    </div>
  );
}
