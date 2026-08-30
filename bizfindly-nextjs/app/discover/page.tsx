"use client";

import { Suspense } from "react";
import { CategoryTabs } from "@/components/discover/CategoryTabs";
import { DiscoverSearchBar } from "@/components/discover/DiscoverSearchBar";
import { FilterModal } from "@/components/discover/FilterModal";
import {
  HiddenGemsScroller,
  TrendingScroller,
} from "@/components/discover/HorizontalPlaceScroller";
import { MobileActionBar } from "@/components/discover/MobileActionBar";
import { PopularAreas } from "@/components/discover/PopularAreas";
import { QuickFilterRow } from "@/components/discover/QuickFilterRow";
import { ResultsGrid } from "@/components/discover/ResultsGrid";
import { DiscoverPageSkeleton } from "@/components/discover/DiscoverCardSkeleton";
import { useDiscoverState } from "@/hooks/useDiscoverState";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverPageSkeleton />}>
      <DiscoverInner />
    </Suspense>
  );
}

function DiscoverInner() {
  const s = useDiscoverState();

  const placeholder =
    s.cat === "restaurant"
      ? "Find rooftop restaurants…"
      : s.cat === "resort"
        ? "Luxury resorts in Gazipur…"
        : "Best gyms near me…";

  return (
    <div className="pb-24 md:pb-12">
      <div className="border-border/60 bg-background/80 sticky top-14 z-30 border-b backdrop-blur-xl md:top-16">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-3 md:px-8 md:py-4">
          <DiscoverSearchBar
            query={s.query}
            setQuery={s.setQuery}
            placeholder={placeholder}
            showSearchPanel={s.showSearchPanel}
            setShowSearchPanel={s.setShowSearchPanel}
            setArea={s.setArea}
            onOpenFilters={() => s.setShowFilters(true)}
            activeFilterCount={s.activeFilterCount}
          />
          <CategoryTabs cat={s.cat} setCat={s.setCat} view={s.view} setView={s.setView} />
          <QuickFilterRow cat={s.cat} activeQuick={s.activeQuick} toggleQuick={s.toggleQuick} />
        </div>
      </div>

      <PopularAreas area={s.area} setArea={s.setArea} />

      {s.view === "grid" && <TrendingScroller places={s.trendingNear} />}

      <ResultsGrid
        cat={s.cat}
        area={s.area}
        filtered={s.filtered}
        sort={s.sort}
        setSort={s.setSort}
        view={s.view}
        onReset={s.resetFilters}
        loading={s.loading}
      />

      {s.view === "grid" && <HiddenGemsScroller places={s.hiddenGems} />}

      <MobileActionBar
        view={s.view}
        setView={s.setView}
        onOpenFilters={() => s.setShowFilters(true)}
        activeFilterCount={s.activeFilterCount}
      />

      {s.showFilters && (
        <FilterModal
          cat={s.cat}
          area={s.area}
          setArea={s.setArea}
          activeQuick={s.activeQuick}
          setActiveQuick={s.setActiveQuick}
          verifiedOnly={s.verifiedOnly}
          setVerifiedOnly={s.setVerifiedOnly}
          openNow={s.openNow}
          setOpenNow={s.setOpenNow}
          minRating={s.minRating}
          setMinRating={s.setMinRating}
          priceRange={s.priceRange}
          setPriceRange={s.setPriceRange}
          taxFilters={s.taxFilters}
          setTaxFilter={s.setTaxFilter}
          budgetTier={s.budgetTier}
          setBudgetTier={s.setBudgetTier}
          sort={s.sort}
          setSort={s.setSort}
          onClose={() => s.setShowFilters(false)}
          onReset={s.resetFilters}
          resultCount={s.filtered.length}
        />
      )}
    </div>
  );
}
