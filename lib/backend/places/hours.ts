/** The API may return plain text, JSON text, or a schedule keyed by weekday. */
export function formatOpeningHours(value: unknown): string {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object") return formatOpeningHours(parsed);
    } catch {
      // Plain text opening hours need no conversion.
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(formatOpeningHours).filter(Boolean).join(", ");
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([day, hours]) => `${day}: ${formatOpeningHours(hours)}`)
      .join(" · ");
  }
  return typeof value === "number" ? String(value) : "";
}
