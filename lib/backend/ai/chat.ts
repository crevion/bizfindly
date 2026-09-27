import type { Paginated } from "@/lib/backend/api";
import { extractErrorMessage } from "@/lib/backend/api/errors";
import type { RestaurantListItem } from "@/lib/backend/restaurants";

export type ChatEvent =
  | { type: "status"; text: string }
  | { type: "delta"; text: string }
  | ({ type: "results"; query_string: string } & Paginated<RestaurantListItem>)
  | { type: "error"; message: string }
  | { type: "done" };

export interface ChatRequest {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
  selected_slug?: string;
  restaurant_slugs: string[];
  previous_query_string: string;
}

export async function streamChat(
  payload: ChatRequest,
  onEvent: (event: ChatEvent) => void,
  signal: AbortSignal,
) {
  const response = await fetch("/api/ai-query/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    throw new Error(extractErrorMessage(data, "Chat is unavailable. Please try again."));
  }
  if (!response.body) throw new Error("Your browser could not open the chat stream.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;
  const parseLine = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line) as ChatEvent;
    if (event.type === "error") throw new Error(event.message);
    if (event.type === "done") finished = true;
    onEvent(event);
  };
  try {
    while (!finished) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) parseLine(line);
      if (done) {
        parseLine(buffer);
        if (!finished) throw new Error("The reply was interrupted. Please try again.");
        break;
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
