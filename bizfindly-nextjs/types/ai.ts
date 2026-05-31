export type AiTrack = "restaurant" | "resort" | "gym";

export interface AiStep {
  key: string;
  question: string;
  options: string[];
  multi?: boolean;
}
