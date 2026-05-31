"use client";

export function DualRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  const step = Math.max(1, Math.round((max - min) / 100));

  return (
    <div className="relative h-10">
      <div className="bg-muted absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" />
      <div
        className="bg-brand absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
        style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => {
          const v = Math.min(parseInt(e.target.value, 10), hi - step);
          onChange([v, hi]);
        }}
        className="range-thumb absolute inset-x-0 top-0 h-10 w-full appearance-none bg-transparent"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => {
          const v = Math.max(parseInt(e.target.value, 10), lo + step);
          onChange([lo, v]);
        }}
        className="range-thumb absolute inset-x-0 top-0 h-10 w-full appearance-none bg-transparent"
      />
    </div>
  );
}
