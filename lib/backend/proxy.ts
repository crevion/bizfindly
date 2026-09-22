const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.bizfindly.com"
).replace(/\/+$/, "");

export const BACKEND_API_URL = `${BACKEND_ORIGIN}/api`;

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "host",
  "content-length",
  "content-encoding",
]);

const FORWARD_REQUEST_HEADERS = ["authorization", "content-type", "accept"];

function resolveBackendUrl(request: Request): string {
  const incoming = new URL(request.url);
  let path = incoming.pathname.replace(/^\/api/, "");
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  return `${BACKEND_API_URL}${path}${incoming.search}`;
}

export async function proxyToBackend(request: Request): Promise<Response> {
  const url = resolveBackendUrl(request);

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: request.method,
      headers,
      body: body && body.byteLength ? body : undefined,
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { detail: "Unable to reach the server. Please try again." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  const buffer = await upstream.arrayBuffer();
  return new Response(buffer.byteLength ? buffer : null, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
