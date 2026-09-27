"use client";

import { useId, useState, type ReactNode, type RefObject } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { COUNTRIES } from "@/content/countries";
import type { CountryOption } from "@/lib/backend/auth/types";

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase"
    >
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        autoComplete="name"
        type={type}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border-border bg-background focus:border-foreground/40 w-full rounded-2xl border px-4 py-3 text-base font-medium focus:outline-none"
      />
    </div>
  );
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="border-border bg-background focus-within:border-foreground/40 flex items-center rounded-2xl border">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-medium focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-muted-foreground hover:text-foreground px-3"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function PhoneField({
  country,
  setCountry,
  phone,
  setPhone,
}: {
  country: CountryOption;
  setCountry: (c: CountryOption) => void;
  phone: string;
  setPhone: (p: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id}>Phone number</FieldLabel>
      <div className="border-border bg-background focus-within:border-foreground/40 flex items-stretch gap-2 rounded-2xl border p-1.5">
        <select
          aria-label="Country calling code"
          value={country.code}
          onChange={(e) =>
            setCountry(COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0])
          }
          className="bg-muted rounded-xl px-2 py-2 text-sm font-semibold focus:outline-none"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          id={id}
          autoComplete="tel-national"
          type="tel"
          inputMode="numeric"
          placeholder="1XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-base font-medium tracking-wide focus:outline-none"
        />
      </div>
    </div>
  );
}

export function OtpInput({
  code,
  setCode,
  inputRef,
}: {
  code: string;
  setCode: (c: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      aria-label="Six-digit verification code"
      autoComplete="one-time-code"
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={6}
      value={code}
      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
      placeholder="••••••"
      className="border-border bg-background focus:border-foreground/40 w-full rounded-2xl border px-4 py-4 text-center font-mono text-2xl font-bold tracking-[0.5em] focus:outline-none"
    />
  );
}

export function SubmitButton({
  loading,
  disabled,
  icon,
  children,
  onClick,
  type = "button",
}: {
  loading: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="gradient-brand text-brand-foreground shadow-glow flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function FormFeedback({ error, info }: { error?: string | null; info?: string | null }) {
  if (error) {
    return (
      <div
        role="alert"
        className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-3 py-2 text-xs font-medium"
      >
        {error}
      </div>
    );
  }
  if (info) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600"
      >
        {info}
      </div>
    );
  }
  return null;
}
