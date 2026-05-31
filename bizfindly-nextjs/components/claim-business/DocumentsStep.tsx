"use client";

import { DOC_TYPES } from "@/content/verificationConfig";
import { DocUpload } from "./DocUpload";
import { PrivacyNote, StepHeader } from "./primitives";
import type { ClaimDocsState } from "@/types/verification";

export function DocumentsStep({
  docs,
  setDocs,
}: {
  docs: ClaimDocsState;
  setDocs: (d: ClaimDocsState) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 3 · Documents"
        title="Upload verification documents"
        sub="Upload at least the required documents. Files are encrypted and only used for verification."
      />
      <div className="mt-6 grid gap-3">
        {DOC_TYPES.map((d) => (
          <DocUpload
            key={d.key}
            label={d.label}
            required={d.required}
            value={docs[d.key]}
            onChange={(v) => setDocs({ ...docs, [d.key]: v })}
          />
        ))}
      </div>
      <PrivacyNote />
    </div>
  );
}
