import type { Place } from "@/types/place";
import type { VerificationStatus } from "@/types/verification";

export function getPlaceVerification(place: Pick<Place, "verified">): {
  status: VerificationStatus;
} {
  return { status: place.verified ? "verified" : "unclaimed" };
}
