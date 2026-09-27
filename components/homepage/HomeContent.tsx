"use client";

import { useQueries } from "@tanstack/react-query";
import { restaurantsApi } from "@/lib/backend/restaurants";
import { resortsApi } from "@/lib/backend/resorts";
import { gymsApi, mapGym } from "@/lib/backend/gyms/api";
import { mapRestaurantListItem, mapResortListItem } from "@/lib/backend/places/map";
import { HeroSection } from "./HeroSection";
import { HomeFeed } from "./HomeFeed";
import { WhyBizFindly } from "./WhyBizFindly";
import { Collections } from "./Collections";

const loaders = [
  async () => {
    const response = await restaurantsApi.list({ page_size: 30 });
    return { count: response.count, places: response.results.map(mapRestaurantListItem), images: response.results.map((place) => place.cover_photo) };
  },
  async () => {
    const response = await resortsApi.list({ page_size: 30 });
    return { count: response.count, places: response.results.map(mapResortListItem), images: response.results.map((place) => place.cover_photo) };
  },
  async () => {
    const response = await gymsApi.list({ page_size: 30 });
    return { count: response.count, places: response.results.map(mapGym), images: response.results.map((place) => place.cover_photo) };
  },
];

export function HomeContent() {
  const queries = useQueries({
    queries: loaders.map((queryFn, index) => ({
      queryKey: ["homepage", ["restaurant", "resort", "gym"][index]],
      queryFn,
      staleTime: 60_000,
      retry: 1,
    })),
  });
  const images = queries.flatMap((query) => query.data?.images ?? []).filter((image): image is string => Boolean(image));

  return (
    <>
      <HeroSection images={images} />
      <HomeFeed queries={queries} />
      <Collections />
      <WhyBizFindly counts={queries.map((query) => query.data?.count)} />
    </>
  );
}
