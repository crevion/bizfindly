"use client";

import { descriptionHtml, richTextClass } from "@/lib/richText";

export default function RichDescription({ value }: { value: string }) {
  return (
    <div
      className={`text-muted-foreground mt-3 ${richTextClass}`}
      dangerouslySetInnerHTML={{ __html: descriptionHtml(value) }}
    />
  );
}
