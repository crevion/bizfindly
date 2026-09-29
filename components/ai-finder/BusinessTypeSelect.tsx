"use client";

import { Dumbbell, Palmtree, Store, Utensils, type LucideIcon } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { usePlaceFinderStore } from "./usePlaceFinderStore";
import { BUSINESS_TYPES, businessTypeConfig, type BusinessType } from "./businessTypes";

export const BUSINESS_TYPE_ICONS: Record<BusinessType, LucideIcon> = {
  restaurant: Utensils,
  resort: Palmtree,
  gym: Dumbbell,
};

export function BusinessTypeIcon({ type, size = 14 }: { type: BusinessType; size?: number }) {
  const Icon = BUSINESS_TYPE_ICONS[type];
  return <Icon size={size} />;
}

/**
 * Picks what the whole page is about.
 *
 * Not a filter over what is already loaded -- choosing a type reloads the
 * listings, the map pins and the assistant from that type's endpoint, so it is
 * deliberately the most prominent control on the page.
 */
export function BusinessTypeSelect({
  className,
  triggerClassName,
}: {
  className?: string;
  triggerClassName?: string;
}) {
  const businessType = usePlaceFinderStore((s) => s.businessType);
  const setBusinessType = usePlaceFinderStore((s) => s.setBusinessType);
  const isLoading = usePlaceFinderStore((s) => s.isLoading);
  const isAiResponding = usePlaceFinderStore((s) => s.isAiResponding);

  return (
    <CustomSelect
      value={businessType}
      // A type switch cancels the reply mid-stream, so hold it until the
      // current turn has finished rather than dropping a half-written answer.
      disabled={isAiResponding}
      options={BUSINESS_TYPES.map((type) => ({
        value: type,
        label: businessTypeConfig(type).label,
        icon: <BusinessTypeIcon type={type} />,
      }))}
      onChange={(val) => setBusinessType(val as BusinessType)}
      icon={<Store size={14} />}
      className={className}
      triggerClassName={
        triggerClassName ??
        `h-11 rounded-2xl border-border bg-card px-4 text-sm font-bold text-foreground shadow-soft ${
          isLoading ? "opacity-80" : ""
        }`
      }
      menuClassName="w-full min-w-[200px]"
    />
  );
}
