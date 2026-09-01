"use client";

import { ChevronRight, RotateCcw, Sparkles, X, Search, MapPin, Utensils } from "lucide-react";
import { usePlaceFinderStore } from "./usePlaceFinderStore";
import { CUISINES_LIST } from "./constants";
import { CustomSelect } from "@/components/common/CustomSelect";

const PROMPT_SUGGESTIONS = [
  "Rooftop restaurant in Gulshan with city view",
  "Budget Biryani or Kacchi under ৳500",
  "Weekend resort near Dhaka with pool",
  "Top gym with certified personal trainer",
];

const SelectedPlaceHeader = () => {
  const selectedPlaceId = usePlaceFinderStore((s) => s.selectedPlaceId);
  const allPlaces = usePlaceFinderStore((s) => s.allPlaces);
  const clearSelectedPlace = usePlaceFinderStore((s) => s.clearSelectedPlace);

  if (!selectedPlaceId) return null;
  const place = allPlaces.find((p) => p.id === selectedPlaceId);
  if (!place) return null;

  return (
    <div className="mx-3 mt-3 flex items-center gap-3 rounded-xl bg-muted p-2.5">
      <img
        src={place.image}
        alt={place.name}
        className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{place.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {place.area} · {place.cuisine || place.category}
        </p>
      </div>
      <button
        type="button"
        onClick={clearSelectedPlace}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-background transition cursor-pointer"
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

  if (openAI) {
    return (
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-soft">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-soft">
              <Sparkles size={16} />
            </span>
            <h2 className="text-base font-bold text-foreground">AI Place Finder</h2>
          </div>
          <div className="flex items-center gap-2">
            {chatMessages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-muted text-muted-foreground transition cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpenAI(false)}
              className="flex items-center gap-1 h-8 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition cursor-pointer"
            >
              Manual <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {chatMessages.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              What kind of place are you looking for?
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              Ask by mood, cuisine, vibe, area or occasion (e.g. &ldquo;Cozy cafe for work in Dhanmondi&rdquo;).
            </p>

            <div className="mt-5 space-y-2 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Try asking:
              </p>
              {PROMPT_SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendChatMessage(prompt)}
                  className="w-full text-left rounded-xl border border-border bg-card p-2.5 text-xs text-foreground font-medium hover:border-brand hover:text-brand transition cursor-pointer"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className="min-w-0">
                {msg.type === "user" ? (
                  <div className="ml-auto w-fit max-w-[85%] rounded-2xl bg-brand text-brand-foreground px-3.5 py-2 text-xs font-medium leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex gap-2.5 items-start">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand mt-0.5">
                      <Sparkles size={12} />
                    </span>
                    <div className="flex-1 rounded-2xl bg-muted p-3 text-xs leading-relaxed text-foreground whitespace-pre-line">
                      {msg.text}
                      {msg.recommendedPlaces && msg.recommendedPlaces.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.recommendedPlaces.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-2 rounded-xl bg-card p-2 border border-border shadow-soft"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-8 w-8 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs truncate">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">
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

            {isAiResponding && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Sparkles size={10} />
                </span>
                <span>Finding the best matches...</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3 border-t border-border bg-card">
          <SelectedPlaceHeader />
          <div className="relative mt-2">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage();
                }
              }}
              placeholder="Ask anything (e.g. 'Rooftop with sushi in Gulshan')..."
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={() => sendChatMessage()}
              className="absolute bottom-2.5 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground hover:opacity-90 transition cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border p-5 shadow-soft space-y-4">
      <h2 className="text-lg font-bold text-foreground">Search places</h2>

      <button
        type="button"
        onClick={() => setOpenAI(true)}
        className="w-full relative overflow-hidden rounded-2xl border border-brand/40 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-3.5 flex items-center justify-between gap-3 text-left transition hover:border-brand cursor-pointer shadow-soft"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-glow shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">Search with AI Finder</div>
            <div className="text-xs text-muted-foreground">Personalized mood & vibe search</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-brand">
          <span>AI</span>
          <ChevronRight size={16} />
        </div>
      </button>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
            Place Name or Keyword
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={searchPlace}
              onChange={(e) => setSearchPlace(e.target.value)}
              placeholder="e.g. Noor Rooftop, Izumi, Sahara..."
              className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
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
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
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
