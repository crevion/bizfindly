import { BadgeCheck, Clock, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/verification";

interface Props {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({ status, size = "md", showLabel = true, className }: Props) {
  if (status === "verified") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-semibold text-white",
          "bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_4px_14px_rgba(37,99,235,0.35)]",
          size === "sm" && "px-2 py-0.5 text-[10px]",
          size === "md" && "px-2.5 py-1 text-[11px]",
          size === "lg" && "px-3 py-1.5 text-xs",
          className,
        )}
        title="Verified Business"
      >
        <BadgeCheck className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", "fill-white text-blue-600")} />
        {showLabel && <span className="uppercase tracking-wide">Verified</span>}
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800",
          className,
        )}
      >
        <Clock className="h-3.5 w-3.5" />
        {showLabel && <span className="uppercase tracking-wide">Pending</span>}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground",
        className,
      )}
    >
      <ShieldQuestion className="h-3.5 w-3.5" />
      {showLabel && <span className="uppercase tracking-wide">Unclaimed</span>}
    </span>
  );
}
