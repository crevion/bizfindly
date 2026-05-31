"use client";

import { TrendingUp } from "lucide-react";
import { Section } from "./Section";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const SAMPLE_DATA = [40, 65, 50, 80, 72, 95, 88];

export function ViewsChart() {
  return (
    <Section title="Views this week" icon={TrendingUp}>
      <div className="flex h-40 items-end gap-2">
        {SAMPLE_DATA.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="gradient-brand w-full rounded-t-lg" style={{ height: `${h}%` }} />
            <div className="text-muted-foreground text-[10px] font-semibold">{DAYS[i]}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
