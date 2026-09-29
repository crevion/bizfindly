import { restaurantsApi } from "@/lib/backend/restaurants";
import { resortsApi } from "@/lib/backend/resorts";
import type { ListingCategory } from "@/types/listing";

export interface ListingMediaFiles {
  cover: File | null;
  gallery: File[];
}

export interface ListingMediaResult {
  coverUploaded: boolean;
  galleryUploaded: number;
  /** One line per file the backend would not take. */
  failures: string[];
}

type MediaApi = {
  uploadCoverPhoto: (slug: string, data: FormData) => Promise<unknown>;
  uploadGalleryImage: (slug: string, data: FormData) => Promise<unknown>;
};

const MEDIA_APIS: Partial<Record<ListingCategory, MediaApi>> = {
  restaurant: restaurantsApi,
  resort: resortsApi,
};

/**
 * Pushes the picked files at a listing that already exists: the cover goes to
 * the single `cover_photo` field, and each gallery photo is its own POST
 * because the gallery endpoint takes one `image` per request.
 *
 * Never throws — the listing is already created by the time this runs, so a
 * failed photo is reported rather than allowed to fail the whole publish.
 */
export async function uploadListingMedia(
  category: ListingCategory,
  slug: string,
  { cover, gallery }: ListingMediaFiles,
): Promise<ListingMediaResult> {
  const api = MEDIA_APIS[category];
  const result: ListingMediaResult = {
    coverUploaded: false,
    galleryUploaded: 0,
    failures: [],
  };
  if (!api) return result;

  if (cover) {
    const body = new FormData();
    body.append("cover_photo", cover);
    try {
      await api.uploadCoverPhoto(slug, body);
      result.coverUploaded = true;
    } catch (error) {
      console.error("cover photo upload failed", error);
      result.failures.push(`${cover.name} (cover photo)`);
    }
  }

  for (const [index, file] of gallery.entries()) {
    const body = new FormData();
    body.append("image", file);
    body.append("order", String(index));
    try {
      await api.uploadGalleryImage(slug, body);
      result.galleryUploaded += 1;
    } catch (error) {
      console.error("gallery image upload failed", error);
      result.failures.push(file.name);
    }
  }

  return result;
}
