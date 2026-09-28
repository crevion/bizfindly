"use client";

import { selectResultCount, usePlaceFinderStore } from "./usePlaceFinderStore";
import { LIST_TABS, SORT_OPTIONS, type ListTab, type SortOption } from "./constants";
import { CustomSelect } from "@/components/common/CustomSelect";
import { SlidersHorizontal } from "lucide-react";

export function PlaceListToolbar() {
  const listTab = usePlaceFinderStore((s) => s.listTab);
  const setListTab = usePlaceFinderStore((s) => s.setListTab);
  const sortBy = usePlaceFinderStore((s) => s.sortBy);
  const setSortBy = usePlaceFinderStore((s) => s.setSortBy);
  const resultCount = usePlaceFinderStore(selectResultCount);
  const range = usePlaceFinderStore((s) => s.range);

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap pb-1">
      <div className="flex items-center gap-2">
        {LIST_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setListTab(tab as ListTab)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              listTab === tab
                ? "bg-foreground text-background shadow-soft"
                : "bg-white text-muted-foreground border border-border hover:text-foreground"
            }`}
          >
            {tab}
            {/* The count belongs to whichever tab is open: each is a
                different search, so it would be wrong under the others. */}
            {listTab === tab && <span className="ml-1.5 opacity-70">({resultCount})</span>}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <CustomSelect
          value={sortBy}
          // Nearest first is the radius search's own ordering, so it is only
          // on offer once a radius is set.
          options={SORT_OPTIONS.filter(
            (option) => option !== "Nearest First" || range > 0,
          ).map((option) => option as string)}
          onChange={(val) => setSortBy(val as SortOption)}
          icon={<SlidersHorizontal size={13} />}
          triggerClassName="h-9 px-3.5 rounded-xl border border-border bg-white text-xs font-semibold text-foreground shadow-soft min-w-[170px]"
          menuClassName="w-[190px]"
        />
      </div>
    </div>
  );
}
