"use client";

import { Clock, Eye, Globe, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { AboutSection } from "@/components/place/PlaceBodySections";
import { Lightbox } from "@/components/place/Lightbox";
import { OpeningHours } from "@/components/place/OpeningHours";
import { useLightbox } from "@/hooks/useLightbox";
import type { LegacyListing } from "@/lib/backend/legacy/api";
import { humanizeSlug, legacyHours, legacyPrice } from "@/lib/backend/legacy/format";
import { directionsUrl, mapEmbedUrl, mapLinkUrl } from "@/lib/maps";

// Grid for up to five photos: the first is the large tile, the rest fill the right.
const GALLERY_LAYOUT: Record<number, { grid: string; first: string; shown: number }> = {
  1: { grid: "md:grid-cols-1", first: "", shown: 1 },
  2: { grid: "md:grid-cols-2", first: "", shown: 2 },
  3: { grid: "md:grid-cols-2 md:grid-rows-2", first: "md:row-span-2", shown: 3 },
  4: { grid: "md:grid-cols-2 md:grid-rows-2", first: "md:row-span-2", shown: 3 },
  5: { grid: "md:grid-cols-4 md:grid-rows-2", first: "md:col-span-2 md:row-span-2", shown: 5 },
};

const safeDecodeUri = (value: string) => {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
};

export function LegacyListingDetail({ listing }: { listing: LegacyListing }) {
  const images = listing.gallery.map((item) => item.image).filter(Boolean);
  const lightbox = useLightbox(images.length);
  const gallery = GALLERY_LAYOUT[Math.min(images.length, 5)];

  const lat = listing.latitude ? Number(listing.latitude) : NaN;
  const lng = listing.longitude ? Number(listing.longitude) : NaN;
  const mapTarget = {
    name: listing.title,
    location: listing.address,
    coords: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined,
  };
  const showMap = !listing.hide_map && (mapTarget.coords || listing.address);
  const embedSrc = showMap ? mapEmbedUrl(mapTarget) : undefined;

  const price = legacyPrice(listing);
  const hours = legacyHours(listing.business_hours);
  const whatsappDigits = listing.whatsapp.replace(/\D/g, "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: listing.title, url: window.location.href });
      } catch {
        // Share sheet dismissed
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div>
      {gallery && (
        <div className="bg-muted relative w-full">
          <div
            className={`grid h-[48vh] max-h-[560px] min-h-[280px] w-full grid-cols-1 gap-1.5 overflow-hidden md:h-[480px] md:gap-2 ${gallery.grid}`}
          >
            {images.slice(0, gallery.shown).map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => lightbox.open(i)}
                aria-label={`View photo ${i + 1} of ${listing.title}`}
                className={
                  i === 0
                    ? `group relative h-full w-full cursor-pointer overflow-hidden ${gallery.first}`
                    : "group relative hidden h-full w-full cursor-pointer overflow-hidden md:block"
                }
              >
                {/* Old-site photos are mostly square, so a cover crop on a wide
                    tile cuts most of them away. Show the whole photo and fill
                    the rest with a blurred copy of it. */}
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
                />
                <img
                  src={src}
                  alt={i === 0 ? listing.title : `${listing.title} photo ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="relative h-full w-full object-contain transition duration-700 ease-out group-hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share listing"
            className="glass text-foreground absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-sm transition hover:scale-105 md:top-6 md:right-6"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="min-w-0">
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              {listing.category && (
                <span className="bg-muted rounded-full px-2.5 py-1">
                  {humanizeSlug(listing.category)}
                </span>
              )}
              {listing.location && (
                <span className="bg-muted rounded-full px-2.5 py-1">
                  {humanizeSlug(listing.location)}
                </span>
              )}
            </div>

            <h1 className="font-display mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              {listing.title}
            </h1>

            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {listing.address && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {listing.address}
                </span>
              )}
              {listing.views > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {listing.views.toLocaleString("en-US")} views
                </span>
              )}
            </div>

            {listing.content && <AboutSection description={listing.content} />}

            {listing.tags.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-2xl font-bold">Tags</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-border bg-card rounded-full border px-4 py-2 text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card shadow-card rounded-3xl p-6">
              {price && (
                <>
                  <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Price
                  </div>
                  <div className="font-display mt-1 mb-6 text-2xl font-bold">{price}</div>
                </>
              )}

              <div className="space-y-3 text-sm">
                {listing.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <a
                      href={mapLinkUrl(mapTarget)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {listing.address}
                    </a>
                  </div>
                )}
                {listing.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <a href={`tel:${listing.phone}`} className="hover:underline">
                      {listing.phone}
                    </a>
                  </div>
                )}
                {whatsappDigits && (
                  <div className="flex items-start gap-3">
                    <MessageCircle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {listing.whatsapp}
                    </a>
                  </div>
                )}
                {listing.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <a href={`mailto:${listing.email}`} className="break-all hover:underline">
                      {listing.email}
                    </a>
                  </div>
                )}
                {listing.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <a
                      href={listing.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {safeDecodeUri(listing.website)}
                    </a>
                  </div>
                )}
                {hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <OpeningHours hours={hours} />
                    </div>
                  </div>
                )}
              </div>

              {listing.social_profiles.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {listing.social_profiles.map((profile) => (
                    <a
                      key={profile.url}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border bg-surface rounded-full border px-3 py-1.5 text-xs font-semibold capitalize"
                    >
                      {profile.platform}
                    </a>
                  ))}
                </div>
              )}

              {showMap && (
                <>
                  <a
                    href={directionsUrl(mapTarget)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gradient-brand text-brand-foreground shadow-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                  >
                    Get directions
                  </a>
                  {embedSrc && (
                    <div className="from-muted to-secondary mt-5 h-40 overflow-hidden rounded-2xl bg-gradient-to-br">
                      <iframe
                        src={embedSrc}
                        title={`Map of ${listing.title}`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-full w-full border-0"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {lightbox.index !== null && (
        <Lightbox
          gallery={images}
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
