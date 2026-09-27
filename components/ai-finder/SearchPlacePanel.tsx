"use client";

import { useEffect, useRef } from "react";

import { ChevronRight, RotateCcw, Sparkles, X, Search, Utensils } from "lucide-react";
import { usePlaceFinderStore } from "./usePlaceFinderStore";
import { CUISINES_LIST } from "./constants";
import { CustomSelect } from "@/components/common/CustomSelect";

const PROMPT_SUGGESTIONS = [
  "Rooftop restaurant in Gulshan with city view",
  "Budget Biryani or Kacchi under ৳500",
  "Trending restaurants in Dhaka",
  "Family dinner in Banani",
];

const SelectedPlaceHeader = () => {
  const selectedPlaceId = usePlaceFinderStore((s) => s.selectedPlaceId);
  const allPlaces = usePlaceFinderStore((s) => s.allPlaces);
  const clearSelectedPlace = usePlaceFinderStore((s) => s.clearSelectedPlace);

  if (!selectedPlaceId) return null;
  const place = allPlaces.find((p) => p.id === selectedPlaceId);
  if (!place) return null;

  return (
    <div className="bg-muted mx-3 mt-3 flex items-center gap-3 rounded-xl p-2.5">
      <img
        src={place.image}
        alt={place.name}
        className="border-border h-10 w-10 shrink-0 rounded-lg border object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-semibold">{place.name}</p>
        <p className="text-muted-foreground truncate text-xs">
          {place.area} · {place.cuisine || place.category}
        </p>
      </div>
      <button
        type="button"
        onClick={clearSelectedPlace}
        className="text-muted-foreground hover:bg-background flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
        aria-label="Unpin place"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export function SearchPlacePanel() {
  const openAI = usePlaceFinderStore((s) => s.openAI);
  const setOpenAI = usePlaceFinderStore((s) => s.setOpenAI);
  const searchPlace = usePlaceFinderStore((s) => s.searchPlace);
  const setSearchPlace = usePlaceFinderStore((s) => s.setSearchPlace);
  const searchCuisine = usePlaceFinderStore((s) => s.searchCuisine);
  const setSearchCuisine = usePlaceFinderStore((s) => s.setSearchCuisine);
  const chatInput = usePlaceFinderStore((s) => s.chatInput);
  const setChatInput = usePlaceFinderStore((s) => s.setChatInput);
  const chatMessages = usePlaceFinderStore((s) => s.chatMessages);
  const isAiResponding = usePlaceFinderStore((s) => s.isAiResponding);
  const sendChatMessage = usePlaceFinderStore((s) => s.sendChatMessage);
  const clearChat = usePlaceFinderStore((s) => s.clearChat);
  const stopChat = usePlaceFinderStore((s) => s.stopChat);
  const chatStatus = usePlaceFinderStore((s) => s.chatStatus);
  const error = usePlaceFinderStore((s) => s.error);
  const chatScroll = useRef<HTMLDivElement>(null);
  const followReply = useRef(true);
  useEffect(() => {
    if (followReply.current && chatScroll.current)
      chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
  }, [chatMessages, chatStatus]);

  if (openAI) {
    return (
      <div className="border-border shadow-soft overflow-hidden rounded-3xl border bg-white">
        <div className="border-border flex items-center justify-between border-b p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <span className="bg-brand text-brand-foreground shadow-soft flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles size={16} />
            </span>
            <h2 className="text-foreground text-base font-bold">Chat with BizFindly</h2>
          </div>
          <div className="flex items-center gap-2">
            {chatMessages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="border-border hover:bg-muted text-muted-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpenAI(false)}
              className="border-border hover:bg-muted flex h-8 cursor-pointer items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition"
            >
              Manual <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {chatMessages.length === 0 ? (
          <div className="p-6 text-center">
            <div className="bg-brand/10 text-brand mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-foreground text-base font-bold">
              What kind of restaurant are you looking for?
            </h3>
            <p className="text-muted-foreground mx-auto mt-1 max-w-xs text-xs">
              Tell me what you’re in the mood for, compare restaurants, or ask about a menu (e.g.
              &ldquo;Cozy cafe for work in Dhanmondi&rdquo;).
            </p>

            <div className="mt-5 space-y-2 text-left">
              <p className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Try asking:
              </p>
              {PROMPT_SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendChatMessage(prompt)}
                  className="border-border bg-card text-foreground hover:border-brand hover:text-brand w-full cursor-pointer rounded-xl border p-2.5 text-left text-xs font-medium transition"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={chatScroll}
            role="log"
            aria-label="Conversation"
            onScroll={() => {
              const el = chatScroll.current;
              if (el) followReply.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
            }}
            className="max-h-[380px] space-y-4 overflow-y-auto p-4"
          >
            {chatMessages.map((msg, i) => (
              <div key={i} className="min-w-0">
                {msg.type === "user" ? (
                  <div className="bg-brand text-brand-foreground ml-auto w-fit max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed font-medium">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brand/10 text-brand mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <Sparkles size={12} />
                    </span>
                    <div className="bg-muted text-foreground flex-1 rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line">
                      {!msg.text && isAiResponding && i === chatMessages.length - 1 ? (
                        <span role="status" className="text-muted-foreground">
                          {chatStatus || "Thinking…"}
                        </span>
                      ) : (
                        <ChatReplyText text={msg.text || "Reply stopped."} />
                      )}
                      {msg.recommendedPlaces && msg.recommendedPlaces.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.recommendedPlaces.map((p) => (
                            <div
                              key={p.id}
                              className="bg-card border-border shadow-soft flex items-center gap-2 rounded-xl border p-2"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-8 w-8 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold">{p.name}</p>
                                <p className="text-muted-foreground truncate text-[10px]">
                                  {p.area} · ⭐ {p.rating}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="border-border bg-card border-t p-3">
          <SelectedPlaceHeader />
          <div className="relative mt-2">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  followReply.current = true;
                  void sendChatMessage();
                }
              }}
              aria-label="Message BizFindly"
              disabled={isAiResponding}
              placeholder="Ask for ideas, compare restaurants, or ask a follow-up…"
              maxLength={1000}
              rows={2}
              className="border-border bg-background focus:border-brand w-full resize-none rounded-xl border px-3 py-2 text-xs outline-none"
            />
            <button
              type="button"
              disabled={!isAiResponding && !chatInput.trim()}
              aria-label={isAiResponding ? "Stop reply" : "Send message"}
              onClick={() => {
                followReply.current = true;
                if (isAiResponding) stopChat();
                else void sendChatMessage();
              }}
              className="bg-brand text-brand-foreground absolute right-2 bottom-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition hover:opacity-90"
            >
              {isAiResponding ? <span aria-hidden="true">■</span> : <ChevronRight size={16} />}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-destructive mt-2 text-xs">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-border shadow-soft space-y-4 rounded-3xl border bg-white p-5">
      <h2 className="text-foreground text-lg font-bold">Search places</h2>

      <button
        type="button"
        onClick={() => setOpenAI(true)}
        className="border-brand/40 from-brand/10 via-brand/5 hover:border-brand shadow-soft relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-2xl border bg-gradient-to-r to-transparent p-3.5 text-left transition"
      >
        <div className="flex items-center gap-3">
          <div className="bg-brand text-brand-foreground shadow-glow flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-foreground text-sm font-bold">Search with AI Finder</div>
            <div className="text-muted-foreground text-xs">Personalized mood & vibe search</div>
          </div>
        </div>
        <div className="text-brand flex items-center gap-1 text-xs font-semibold">
          <span>AI</span>
          <ChevronRight size={16} />
        </div>
      </button>

      <div className="space-y-3">
        <div>
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">
            Place Name or Keyword
          </label>
          <div className="border-border bg-background flex items-center gap-2 rounded-xl border px-3 py-2.5">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={searchPlace}
              onChange={(e) => setSearchPlace(e.target.value)}
              placeholder="e.g. Noor Rooftop, Izumi, Sahara..."
              className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
            />
            {searchPlace && (
              <button
                type="button"
                onClick={() => setSearchPlace("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground mb-1 block text-xs font-semibold">
            Cuisine or Style
          </label>
          <CustomSelect
            value={searchCuisine}
            options={[
              { value: "", label: "All Cuisines & Types" },
              ...CUISINES_LIST.map((c) => ({ value: c, label: c })),
            ]}
            onChange={(val) => setSearchCuisine(val)}
            icon={<Utensils size={13} />}
            className="w-full"
            triggerClassName="h-10 rounded-xl border border-border bg-background text-sm font-normal text-foreground shadow-none"
            menuClassName="w-full"
          />
        </div>
      </div>
    </div>
  );
}

function ChatReplyText({ text }: { text: string }) {
  return (
    <>
      {text
        .replace(/^\*\s+/gm, "• ")
        .split(/(\*\*[^*]+\*\*)/g)
        .map((part, index) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
    </>
  );
}
