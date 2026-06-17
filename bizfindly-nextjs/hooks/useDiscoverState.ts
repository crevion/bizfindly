"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Place } from "@/types/place";
import { listPlaces, type BudgetTier } from "@/lib/backend/places";
import { PRICE_BOUNDS, type DiscoverCategory, type SortOption } from "@/content/discoverFilters";
import { matchesQuickFilter, priceFromRange } from "@/lib/discoverFilters";

export type TaxonomyDimension = "cuisine" | "vibe" | "occasion" | "groupType" | "tag" | "facility";

export type TaxonomyFilters = Partial<Record<TaxonomyDimension, string>>;

const EMPTY_TAX: TaxonomyFilters = {};

export function useDiscoverState() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const initialCat = (catParam as DiscoverCategory | null) ?? "restaurant";
  const initialQ = searchParams.get("q") ?? "";

  const [cat, setCat] = useState<DiscoverCategory>(initialCat);
  const [query, setQuery] = useState(initialQ);
  const [area, setArea] = useState<string>("All");
  const [activeQuick, setActiveQuick] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const bounds = PRICE_BOUNDS[cat];
  const [priceRange, setPriceRange] = useState<[number, number]>([bounds[0], bounds[1]]);
  const [taxFilters, setTaxFilters] = useState<TaxonomyFilters>(EMPTY_TAX);
  const [budgetTier, setBudgetTier] = useState<BudgetTier | undefined>(undefined);

  useEffect(() => {
    if (catParam === "restaurant" || catParam === "resort" || catParam === "gym") {
      setCat(catParam);
    } else if (catParam === null) {
      setCat("restaurant");
    }
  }, [catParam]);

  useEffect(() => {
    const b = PRICE_BOUNDS[cat];
    setPriceRange([b[0], b[1]]);
    setActiveQuick([]);
    setTaxFilters(EMPTY_TAX);
    setBudgetTier(undefined);
  }, [cat]);

  const setTaxFilter = (dim: TaxonomyDimension, slug: string | undefined) =>
    setTaxFilters((prev) => {
      const next = { ...prev };
      if (!slug || prev[dim] === slug) delete next[dim];
      else next[dim] = slug;
      return next;
    });

  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(id);
  }, [query]);

  const [items, setItems] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const taxKey = JSON.stringify(taxFilters);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listPlaces(cat, {
      area,
      search: debouncedQuery.trim() || undefined,
      cuisine: taxFilters.cuisine,
      vibe: taxFilters.vibe,
      occasion: taxFilters.occasion,
      groupType: taxFilters.groupType,
      tag: taxFilters.tag,
      facility: taxFilters.facility,
      budgetTier,
    })
      .then((res) => {
        if (active) setItems(res);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, area, debouncedQuery, taxKey, budgetTier]);

  const baseList = items;

  const filtered = useMemo(() => {
    let res = baseList.slice();
    if (area !== "All" && cat === "gym") res = res.filter((p) => p.area === area);
    if (verifiedOnly) res = res.filter((p) => p.verified);
    if (minRating > 0) res = res.filter((p) => p.rating >= minRating);
    if (activeQuick.length)
      res = res.filter((p) => activeQuick.every((q) => matchesQuickFilter(p, q)));
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cuisine?.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q),
      );
    }
    res = res.filter((p) => {
      const v = priceFromRange(p);
      return v === 0 || (v >= priceRange[0] && v <= priceRange[1] * 1.05);
    });
    if (sort === "Top rated") res.sort((a, b) => b.rating - a.rating);
    else if (sort === "Most reviewed") res.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "Budget first") res.sort((a, b) => a.priceLevel - b.priceLevel);
    return res;
  }, [baseList, cat, area, verifiedOnly, minRating, activeQuick, query, priceRange, sort]);

  const trendingNear = useMemo(() => baseList.filter((p) => p.trending).slice(0, 6), [baseList]);
  const hiddenGems = useMemo(() => {
    const flagged = baseList.filter((p) => p.hiddenGem).slice(0, 6);
    const fallback = baseList.filter((p) => !p.trending && p.rating >= 4.5).slice(0, 6);
    return flagged.length ? flagged : fallback;
  }, [baseList]);

  const activeFilterCount =
    activeQuick.length +
    Object.keys(taxFilters).length +
    (budgetTier ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (openNow ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (area !== "All" ? 1 : 0) +
    (priceRange[0] !== bounds[0] || priceRange[1] !== bounds[1] ? 1 : 0);

  const toggleQuick = (f: string) =>
    setActiveQuick((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const resetFilters = () => {
    setActiveQuick([]);
    setArea("All");
    setVerifiedOnly(false);
    setOpenNow(false);
    setMinRating(0);
    setPriceRange([bounds[0], bounds[1]]);
    setTaxFilters(EMPTY_TAX);
    setBudgetTier(undefined);
  };

  return {
    cat,
    setCat,
    query,
    setQuery,
    area,
    setArea,
    activeQuick,
    setActiveQuick,
    toggleQuick,
    view,
    setView,
    showSearchPanel,
    setShowSearchPanel,
    showFilters,
    setShowFilters,
    sort,
    setSort,
    verifiedOnly,
    setVerifiedOnly,
    openNow,
    setOpenNow,
    minRating,
    setMinRating,
    priceRange,
    setPriceRange,
    taxFilters,
    setTaxFilter,
    budgetTier,
    setBudgetTier,
    bounds,
    baseList,
    filtered,
    trendingNear,
    hiddenGems,
    activeFilterCount,
    resetFilters,
    loading,
  };
}
