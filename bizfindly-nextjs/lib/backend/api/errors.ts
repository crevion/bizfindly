export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  const detail = record.detail ?? record.message ?? record.error;
  if (typeof detail === "string") return detail;

  if (Array.isArray(record.non_field_errors) && record.non_field_errors.length) {
    return String(record.non_field_errors[0]);
  }

  for (const value of Object.values(record)) {
    if (Array.isArray(value) && value.length) return String(value[0]);
    if (typeof value === "string") return value;
  }

  return fallback;
}
