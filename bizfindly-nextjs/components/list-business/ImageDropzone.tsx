"use client";

import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ImageDropzone({
  label,
  files,
  onChange,
}: {
  label: string;
  files: string[];
  onChange: (files: string[]) => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, 6);
    const dataUrls = await Promise.all(
      arr.map(
        (f) =>
          new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.onerror = rej;
            r.readAsDataURL(f);
          }),
      ),
    );
    onChange([...files, ...dataUrls].slice(0, 8));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-muted-foreground text-xs">{files.length}/8</div>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
          drag ? "border-brand bg-brand/5" : "border-border bg-surface hover:border-foreground/30",
        )}
      >
        <span className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
          <Upload className="h-5 w-5" />
        </span>
        <div className="text-sm font-semibold">Drag photos here</div>
        <div className="text-muted-foreground text-xs">or click to browse · JPG, PNG up to 5MB</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
          {files.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
