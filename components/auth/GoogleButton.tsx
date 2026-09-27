"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/backend/auth";
import { GoogleIcon } from "./GoogleIcon";
import { FormFeedback } from "./fields";

type GoogleIdentity = {
  initialize: (options: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    auto_select: boolean;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: {
      theme: string;
      size: string;
      text: string;
      width: number;
      shape: string;
      logo_alignment: string;
    },
  ) => void;
};

export function GoogleButton({
  onSuccess,
  disabled = false,
}: {
  onSuccess?: () => void;
  disabled?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const buttonFrame = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.googleLogin);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const handleCredential = useCallback(
    async ({ credential }: { credential: string }) => {
      if (busy.current || disabled) return;
      busy.current = true;
      setLoading(true);
      setError(null);
      try {
        await login(credential);
        onSuccess?.();
      } catch (error) {
        setError(error instanceof Error ? error.message : "Google sign-in failed. Please retry.");
      } finally {
        busy.current = false;
        setLoading(false);
      }
    },
    [disabled, login, onSuccess],
  );

  useEffect(() => {
    if (!ready || !clientId || !container.current) return;
    // Cast via unknown: @types/google.maps declares a global `google` that does
    // not include Google Identity Services.
    const google = (window as unknown as { google?: { accounts: { id: GoogleIdentity } } })
      .google;
    if (!google) return;
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      auto_select: false,
    });
    const element = container.current;
    const frame = buttonFrame.current;
    if (!frame) return;
    let previousWidth = 0;
    const render = () => {
      const width = Math.min(400, Math.floor(frame.clientWidth - 16));
      if (width <= 0 || width === previousWidth) return;
      previousWidth = width;
      element.replaceChildren();
      google.accounts.id.renderButton(element, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width,
      });
    };
    render();
    const observer = new ResizeObserver(render);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [ready, clientId, handleCredential]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs font-medium">or</span>
        <span className="bg-border h-px flex-1" />
      </div>
      {clientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          onReady={() => setReady(true)}
          onError={() =>
            setError("Google sign-in could not load. Check your connection and reload the page.")
          }
        />
      )}
      {clientId && ready ? (
        <div
          inert={disabled || loading}
          aria-busy={loading}
          ref={buttonFrame}
          className="border-border bg-background text-foreground hover:border-foreground/40 focus-within:ring-brand/30 flex min-h-[54px] w-full items-center justify-center rounded-2xl border px-2 py-1.5 shadow-sm transition focus-within:ring-2 hover:shadow-md [&[inert]]:opacity-60"
        >
          <div ref={container} className="flex w-full justify-center" />
        </div>
      ) : (
        <button
          type="button"
          disabled
          className="border-border bg-background text-foreground flex min-h-[54px] w-full items-center justify-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold opacity-60 shadow-sm"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>
      )}
      {!clientId && (
        <p className="text-muted-foreground text-center text-xs">
          Google sign-in will be available soon.
        </p>
      )}
      {clientId && !ready && !error && (
        <p role="status" className="text-muted-foreground text-center text-xs">
          Loading Google sign-in…
        </p>
      )}
      {loading && (
        <p role="status" className="text-center text-xs">
          Signing in with Google…
        </p>
      )}
      <FormFeedback error={error} />
    </div>
  );
}
