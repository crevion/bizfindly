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
    <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 pb-1 sm:w-auto">
      <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
        {LIST_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setListTab(tab as ListTab)}
            className={`min-h-11 flex-1 cursor-pointer rounded-2xl px-3 py-2.5 text-xs font-bold transition-all sm:flex-none sm:px-4 ${
              listTab === tab
                ? "bg-foreground text-background shadow-soft"
                : "text-muted-foreground border-border hover:text-foreground border bg-white"
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
          options={SORT_OPTIONS.filter((option) => option !== "Nearest First" || range > 0).map(
            (option) => option as string,
          )}
          onChange={(val) => setSortBy(val as SortOption)}
          icon={<SlidersHorizontal size={13} />}
          triggerClassName="h-11 px-3.5 rounded-xl border border-border bg-white text-xs font-semibold text-foreground shadow-soft min-w-[170px]"
          menuClassName="w-[190px]"
        />
      </div>
    </div>
  );
}
