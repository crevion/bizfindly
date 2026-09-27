"use client";

import { ArrowRight, KeyRound, Loader2, Lock, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleButton } from "./GoogleButton";
import { AuthShell } from "./AuthShell";
import {
  FormFeedback,
  OtpInput,
  PasswordField,
  PhoneField,
  SubmitButton,
  TextField,
} from "./fields";
import { useAuthForm, type AuthMode } from "@/lib/backend/auth";

interface Props {
  initialMode?: "login" | "register";
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

const PRIMARY_TABS: { mode: AuthMode; label: string }[] = [
  { mode: "login", label: "Sign in" },
  { mode: "register", label: "Create account" },
];

export function AuthGate({ title, subtitle, initialMode = "login", onSuccess }: Props) {
  const f = useAuthForm(onSuccess, initialMode);
  const showTabs = f.mode === "login" || f.mode === "register";

  return (
    <AuthShell
      title={
        title ??
        {
          login: "Welcome back",
          register: "Create your account",
          otp: "Verify your number",
          forgot: "Forgot your password?",
          reset: "Choose a new password",
        }[f.mode]
      }
      subtitle={
        subtitle ??
        "Save your favorite places, share reviews and manage your business on BizFindly."
      }
    >
      <div className="border-border/60 bg-background/60 shadow-card mt-8 rounded-3xl border p-5 backdrop-blur-xl md:p-7">
        {showTabs && (
          <div className="bg-muted mb-5 grid grid-cols-2 gap-1 rounded-full p-1">
            {PRIMARY_TABS.map((t) => (
              <button
                key={t.mode}
                type="button"
                disabled={f.loading}
                aria-pressed={f.mode === t.mode}
                onClick={() => f.switchMode(t.mode)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition",
                  f.mode === t.mode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {f.mode === "login" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void f.handleLogin();
            }}
          >
            <fieldset disabled={f.loading} className="space-y-4">
              <PhoneField
                country={f.country}
                setCountry={f.setCountry}
                phone={f.phone}
                setPhone={f.setPhone}
              />
              <PasswordField
                label="Password"
                value={f.password}
                onChange={f.setPassword}
                autoComplete="current-password"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => f.switchMode("forgot")}
                  className="text-brand text-xs font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <SubmitButton loading={f.loading} type="submit" icon={<LogIn className="h-4 w-4" />}>
                Sign in
              </SubmitButton>
              <button
                type="button"
                onClick={() => void f.handleSendVerification()}
                className="text-brand w-full text-center text-xs font-semibold hover:underline"
              >
                Already registered but haven’t verified your number?
              </button>
            </fieldset>
          </form>
        )}

        {f.mode === "register" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void f.handleRegister();
            }}
          >
            <fieldset disabled={f.loading} className="space-y-4">
              <TextField
                label="Name (optional)"
                value={f.name}
                onChange={f.setName}
                placeholder="Your name"
              />
              <PhoneField
                country={f.country}
                setCountry={f.setCountry}
                phone={f.phone}
                setPhone={f.setPhone}
              />
              <PasswordField
                label="Password (at least 8 characters)"
                value={f.password}
                onChange={f.setPassword}
                autoComplete="new-password"
              />
              <PasswordField
                label="Confirm password"
                value={f.passwordConfirm}
                onChange={f.setPasswordConfirm}
                autoComplete="new-password"
              />
              <SubmitButton
                loading={f.loading}
                type="submit"
                icon={<UserPlus className="h-4 w-4" />}
              >
                Create account
              </SubmitButton>
              <p className="text-muted-foreground text-center text-xs">
                We&apos;ll text a 6-digit code to verify your number.
              </p>
            </fieldset>
          </form>
        )}

        {f.mode === "otp" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void f.handleVerifyOtp();
            }}
          >
            <fieldset disabled={f.loading} className="space-y-4">
              <div className="bg-muted/60 rounded-2xl p-3 text-center">
                <div className="text-muted-foreground text-xs">Verification code sent to</div>
                <div className="font-semibold">{f.fullPhone}</div>
              </div>
              <OtpInput code={f.code} setCode={f.setCode} inputRef={f.otpRef} />
              <SubmitButton
                loading={f.loading}
                disabled={f.code.length !== 6}
                type="submit"
                icon={<ShieldCheck className="h-4 w-4" />}
              >
                Verify & continue
              </SubmitButton>
              <ResendRow
                seconds={f.seconds}
                loading={f.loading}
                onResend={f.resend}
                onBack={() => f.switchMode("login")}
                backLabel="← Back to sign in"
              />
            </fieldset>
          </form>
        )}

        {f.mode === "forgot" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void f.handleForgot();
            }}
          >
            <fieldset disabled={f.loading} className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Enter your registered phone number and we&apos;ll send a reset code.
              </p>
              <PhoneField
                country={f.country}
                setCountry={f.setCountry}
                phone={f.phone}
                setPhone={f.setPhone}
              />
              <SubmitButton
                loading={f.loading}
                type="submit"
                icon={<KeyRound className="h-4 w-4" />}
              >
                Send reset code
                {!f.loading && <ArrowRight className="h-4 w-4" />}
              </SubmitButton>
              <button
                type="button"
                onClick={() => f.switchMode("login")}
                className="text-muted-foreground hover:text-foreground w-full text-center text-xs font-semibold"
              >
                ← Back to sign in
              </button>
            </fieldset>
          </form>
        )}

        {f.mode === "reset" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void f.handleReset();
            }}
          >
            <fieldset disabled={f.loading} className="space-y-4">
              <div className="bg-muted/60 rounded-2xl p-3 text-center">
                <div className="text-muted-foreground text-xs">Reset code sent to</div>
                <div className="font-semibold">{f.fullPhone}</div>
              </div>
              <OtpInput code={f.code} setCode={f.setCode} inputRef={f.otpRef} />
              <PasswordField
                label="New password"
                value={f.password}
                onChange={f.setPassword}
                autoComplete="new-password"
              />
              <PasswordField
                label="Confirm password"
                value={f.passwordConfirm}
                onChange={f.setPasswordConfirm}
                autoComplete="new-password"
              />
              <SubmitButton loading={f.loading} type="submit" icon={<Lock className="h-4 w-4" />}>
                Reset password
              </SubmitButton>
              <ResendRow
                seconds={f.seconds}
                loading={f.loading}
                onResend={f.resend}
                onBack={() => f.switchMode("login")}
                backLabel="← Back to sign in"
              />
            </fieldset>
          </form>
        )}

        {showTabs && (
          <div className="mt-5">
            <GoogleButton onSuccess={onSuccess} disabled={f.loading} />
          </div>
        )}

        <div className="mt-4">
          <FormFeedback error={f.error} info={f.info} />
        </div>
      </div>
    </AuthShell>
  );
}

function ResendRow({
  seconds,
  loading,
  onResend,
  onBack,
  backLabel,
}: {
  seconds: number;
  loading: boolean;
  onResend: () => void;
  onBack: () => void;
  backLabel: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <button
        type="button"
        disabled={loading}
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onResend}
        disabled={seconds > 0 || loading}
        className={cn(
          "inline-flex items-center gap-1 font-semibold",
          seconds > 0 ? "text-muted-foreground" : "text-brand hover:underline",
        )}
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
      </button>
    </div>
  );
}
