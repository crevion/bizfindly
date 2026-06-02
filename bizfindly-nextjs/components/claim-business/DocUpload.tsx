"use client";

import { Check, CloudUpload, FileText, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type DocValue = { name: string; size: number; preview?: string } | null | undefined;

export function DocUpload({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: DocValue;
  onChange: (v: { name: string; size: number; preview?: string } | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      onChange({ name: file.name, size: file.size });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      onChange({ name: file.name, size: file.size, preview: reader.result as string });
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className="border-border bg-card shadow-soft flex items-center gap-3 rounded-2xl border p-3">
        <div className="bg-muted h-14 w-14 overflow-hidden rounded-xl">
          {value.preview ? (
            <img src={value.preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-muted-foreground truncate text-xs">
            {value.name} · {(value.size / 1024).toFixed(0)} KB
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <Check className="h-3 w-3" /> Uploaded
        </span>
        <button
          onClick={() => onChange(null)}
          className="text-muted-foreground hover:bg-muted hover:text-destructive flex h-9 w-9 items-center justify-center rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className={cn(
        "bg-surface flex items-center gap-3 rounded-2xl border-2 border-dashed p-3 transition",
        drag ? "border-sky-500 bg-sky-500/5" : "border-border",
      )}
    >
      <span className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-xl">
        <CloudUpload className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </div>
        <div className="text-muted-foreground text-xs">
          Drag &amp; drop, or click to upload (Image / PDF)
        </div>
      </div>
      <button
        onClick={() => ref.current?.click()}
        className="bg-foreground text-background rounded-full px-4 py-2 text-xs font-semibold"
      >
        Upload
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
