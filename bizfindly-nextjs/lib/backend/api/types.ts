export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NamedSlug {
  id?: number;
  name: string;
  slug: string;
}
