"use client";

import { DocUpload, type DocValue } from "./DocUpload";
import { PrivacyNote, StepHeader } from "./primitives";

export function DocumentsStep({
  document,
  setDocument,
}: {
  document: DocValue;
  setDocument: (d: DocValue) => void;
}) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 3 · Documents"
        title="Upload proof of ownership"
        sub="A trade license, utility bill, or other document showing you own or manage this business. Files are only used for verification."
      />
      <div className="mt-6 grid gap-3">
        <DocUpload
          label="Proof of ownership"
          required
          value={document}
          onChange={setDocument}
        />
      </div>
      <PrivacyNote />
    </div>
  );
}
