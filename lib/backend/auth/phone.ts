export function normalizePhone(phone: string, countryCode: string): string {
  const trimmed = phone.trim();
  let digits = trimmed.replace(/\D/g, "");
  const prefix = countryCode.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return `+${digits}`;
  if (trimmed.startsWith("00")) return `+${digits.slice(2)}`;
  if (countryCode === "+880") {
    if (digits.startsWith("880")) digits = digits.slice(3);
    digits = digits.replace(/^0/, "");
  }
  return `+${prefix}${digits}`;
}

export function isValidPhone(phone: string): boolean {
  if (phone.startsWith("+880")) return /^\+8801[3-9]\d{8}$/.test(phone);
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

export function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\\\x00-\x20]/.test(value))
    return "/profile";
  try {
    const url = new URL(value, "https://bizfindly.local");
    if (url.origin !== "https://bizfindly.local" || url.pathname === "/join") return "/profile";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/profile";
  }
}
