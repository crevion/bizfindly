import { formatOpeningHours } from "@/lib/backend/places/hours";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const fieldClass = "border-border bg-background mt-1 w-full rounded-xl border px-3 py-2 text-sm";

function schedule(value: unknown): Record<string, unknown> | null {
  if (typeof value === "string") {
    try {
      return schedule(JSON.parse(value));
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (Object.keys(value).some((key) => !DAYS.includes(key))) return null;
  return value as Record<string, unknown>;
}

export function OpeningHoursFields({ value, category }: { value: unknown; category: string }) {
  const weekly = category === "restaurant" ? schedule(value) : null;
  if (weekly)
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Opening hours</legend>
        <p className="text-muted-foreground text-xs">
          Enter hours such as 12:00-22:45, or Closed. Separate multiple time slots with commas.
          Leave blank if hours are not provided.
        </p>
        {DAYS.map((day) => (
          <label key={day} className="grid items-center gap-2 text-sm sm:grid-cols-[7rem_1fr]">
            {day}
            <input
              name={`hours.${day}`}
              defaultValue={formatOpeningHours(weekly[day])}
              placeholder="12:00-22:45 or Closed"
              className={fieldClass}
            />
          </label>
        ))}
      </fieldset>
    );
  return (
    <label className="block text-sm font-medium">
      Opening hours
      <textarea
        name="opening_hours"
        defaultValue={formatOpeningHours(value).replace(/ · /g, "\n")}
        rows={4}
        maxLength={category === "restaurant" ? undefined : 255}
        placeholder="Monday: 12:00-22:45"
        className={fieldClass}
      />
      <span className="text-muted-foreground text-xs">
        Enter the hours for each day on a separate line.
      </span>
    </label>
  );
}

export function listingFormData(form: FormData, originalHours: unknown): Record<string, unknown> {
  const data: Record<string, unknown> = Object.fromEntries(form.entries());
  if (form.has(`hours.${DAYS[0]}`)) {
    const original = schedule(originalHours) ?? {};
    const hours: Record<string, unknown> = {};
    for (const day of DAYS) {
      const text = String(form.get(`hours.${day}`) ?? "").trim();
      // Preserve the original JSON shape for unchanged days.
      if (day in original && text === formatOpeningHours(original[day]).trim())
        hours[day] = original[day];
      else if (text)
        hours[day] = text
          .split(",")
          .map((slot) => slot.trim())
          .filter(Boolean);
      delete data[`hours.${day}`];
    }
    data.opening_hours = hours;
  }
  // Blank coordinates mean "not provided" rather than an empty decimal.
  for (const field of ["latitude", "longitude"]) {
    if (field in data) data[field] = String(data[field] ?? "").trim() || null;
  }
  return data;
}
