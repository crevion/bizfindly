"use client";

import type { CategoryConfig, ListingDraft } from "@/types/listing";
import { StepHeader } from "./fields";
import { ImageDropzone } from "./ImageDropzone";

export function ImagesStep({
  cfg,
  draft,
  update,
}: {
  cfg: CategoryConfig;
  draft: ListingDraft;
  update: (p: Partial<ListingDraft>) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker={`Step 6 · ${cfg.label}`}
        title="Upload your photos"
        sub="Visuals make or break a listing. Drag & drop or tap to upload."
      />
      <div className="space-y-6">
        {cfg.imageGroups.map((g) => (
          <ImageDropzone
            key={g.key}
            label={g.label}
            files={draft.images[g.key] || []}
            onChange={(files) => update({ images: { ...draft.images, [g.key]: files } })}
          />
        ))}
      </div>
    </div>
  );
}
