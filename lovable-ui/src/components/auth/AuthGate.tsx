import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, Lock, Phone, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

interface Props {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

const COUNTRIES = [
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
];

export function AuthGate({
  title = "Sign in to continue",
  subtitle = "List your business, manage listings and reach thousands of discovery users in Bangladesh.",
  onSuccess,
}: Props) {
  const { signInWithGoogle, startPhoneAuth, verifyPhoneOtp } = useAuth();
  const [tab, setTab] = useState<"google" | "phone">("phone");
  const [phase, setPhase] = useState<"enter" | "otp">("enter");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [expected, setExpected] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const fullPhone = `${country.code}${phone.replace(/\D/g, "")}`;

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError(null);
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7) {
      setError("Enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const { devCode } = await startPhoneAuth(fullPhone);
      setExpected(devCode);
      setPhase("otp");
      setSeconds(45);
      setTimeout(() => otpRef.current?.focus(), 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneOtp(fullPhone, code, expected);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (seconds > 0) return;
    setLoading(true);
    try {
      const { devCode } = await startPhoneAuth(fullPhone);
      setExpected(devCode);
      setSeconds(45);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-accent/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 py-6 md:py-12">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Shield className="h-3.5 w-3.5" /> Secure sign-in
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand shadow-glow">
            <Sparkles className="h-6 w-6 text-brand-foreground" />
          </span>
          <div className="font-display text-2xl font-bold tracking-tight">
            Biz<span className="text-gradient-brand">Findly</span>
          </div>
        </div>

        <h1 className="mt-8 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{subtitle}</p>

        <div className="mt-8 rounded-3xl border border-border/60 bg-background/60 p-5 shadow-elegant backdrop-blur-xl md:p-7">
          {/* Tabs */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
            {(["phone", "google"] as const).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setTab(k);
                  setError(null);
                }}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition",
                  tab === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                {k === "phone" ? "Mobile number" : "Google"}
              </button>
            ))}
          </div>

          {tab === "google" && (
            <div className="space-y-3">
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-foreground/40 hover:shadow-md disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <GoogleIcon className="h-5 w-5" />
                )}
                Continue with Google
              </button>
              <p className="text-center text-xs text-muted-foreground">
                We'll create your business owner account automatically.
              </p>
            </div>
          )}

          {tab === "phone" && phase === "enter" && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone number
              </label>
              <div className="flex items-stretch gap-2 rounded-2xl border border-border bg-background p-1.5 focus-within:border-foreground/40 focus-within:shadow-sm">
                <select
                  value={country.code}
                  onChange={(e) =>
                    setCountry(COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0])
                  }
                  className="rounded-xl bg-muted px-2 py-2 text-sm font-semibold focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="1XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent px-2 py-2 text-base font-medium tracking-wide focus:outline-none"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand px-4 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Phone className="h-4 w-4" />}
                Send verification code
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Standard SMS rates may apply. By continuing you agree to our Terms.
              </p>
            </div>
          )}

          {tab === "phone" && phase === "otp" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-muted/60 p-3 text-center">
                <div className="text-xs text-muted-foreground">Code sent to</div>
                <div className="font-semibold">{fullPhone}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Demo code: <span className="font-mono font-semibold text-foreground">{expected}</span>
                </div>
              </div>
              <input
                ref={otpRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••••"
                className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-center font-mono text-2xl font-bold tracking-[0.5em] focus:border-foreground/40 focus:outline-none"
              />
              <button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand px-4 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
                Verify & continue
              </button>
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setPhase("enter");
                    setCode("");
                    setError(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Change number
                </button>
                <button
                  onClick={resend}
                  disabled={seconds > 0 || loading}
                  className={cn(
                    "font-semibold",
                    seconds > 0 ? "text-muted-foreground" : "text-brand hover:underline",
                  )}
                >
                  {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          🔒 Your information is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
