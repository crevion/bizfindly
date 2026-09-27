/**
 * WebSocket URLs are built from a single origin env var:
 * NEXT_PUBLIC_WS_ORIGIN=wss://devbackend.themixer.org
 *
 * Paths (/ws/v2/..., /ws/chat/, /ws/program/, etc.) live in code.
 */

const DEFAULT_WS_ORIGIN = "wss://devbackend.themixer.org";

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

/** e.g. wss://devbackend.themixer.org */
export function getWsOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WS_ORIGIN?.trim();
  if (fromEnv) {
    try {
      return stripTrailingSlash(new URL(fromEnv).origin);
    } catch {
      return stripTrailingSlash(fromEnv);
    }
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiBase) {
    try {
      const wsBase = apiBase.replace(/^http/i, "ws");
      return stripTrailingSlash(new URL(wsBase).origin);
    } catch {
      // fall through
    }
  }

  return DEFAULT_WS_ORIGIN;
}

/** e.g. wss://devbackend.themixer.org/ws/v2 */
export function getWsV2BaseUrl(): string {
  return `${getWsOrigin()}/ws/v2`;
}

export function buildWsV2Url(
  segment: string,
  params?: URLSearchParams,
): string {
  const base = getWsV2BaseUrl();
  const path = segment.replace(/^\/+/, "").replace(/^ws\/v2\//, "");
  const query = params?.toString();
  return query ? `${base}/${path}/?${query}` : `${base}/${path}/`;
}

function buildWsPathUrl(
  path: string,
  query?: URLSearchParams | string,
): string {
  const origin = getWsOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withTrailingSlash = normalized.endsWith("/")
    ? normalized
    : `${normalized}/`;

  if (!query) {
    return `${origin}${withTrailingSlash}`;
  }

  const queryString = typeof query === "string" ? query : query.toString();
  return queryString
    ? `${origin}${withTrailingSlash}?${queryString}`
    : `${origin}${withTrailingSlash}`;
}

/** Inbox / DM chat: /ws/chat/?token=... */
export function buildWsInboxUrl(token: string): string {
  return buildWsPathUrl("/ws/chat", `token=${encodeURIComponent(token)}`);
}

/** Program finder assistant: /ws/program/?token=... */
export function buildWsProgramUrl(token: string): string {
  return buildWsPathUrl("/ws/program", `token=${encodeURIComponent(token)}`);
}
