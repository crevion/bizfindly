"use client";

import { ArrowRight, KeyRound, Loader2, Lock, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthShell } from "./AuthShell";
import { GoogleButton } from "./GoogleButton";
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
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

const PRIMARY_TABS: { mode: AuthMode; label: string }[] = [
  { mode: "login", label: "Sign in" },
  { mode: "register", label: "Create account" },
];

export function AuthGate({
  title = "Sign in to continue",
  subtitle = "List your business, manage listings and reach thousands of discovery users in Bangladesh.",
  onSuccess,
}: Props) {
  const f = useAuthForm(onSuccess);
  const showTabs = f.mode === "login" || f.mode === "register";

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <div className="border-border/60 bg-background/60 shadow-card mt-8 rounded-3xl border p-5 backdrop-blur-xl md:p-7">
        {showTabs && (
          <div className="bg-muted mb-5 grid grid-cols-2 gap-1 rounded-full p-1">
            {PRIMARY_TABS.map((t) => (
              <button
                key={t.mode}
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
          <div className="space-y-4">
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
                onClick={() => f.switchMode("forgot")}
                className="text-brand text-xs font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <SubmitButton
              loading={f.loading}
              onClick={f.handleLogin}
              icon={<LogIn className="h-4 w-4" />}
            >
              Sign in
            </SubmitButton>
            <GoogleButton />
          </div>
        )}

        {f.mode === "register" && (
          <div className="space-y-4">
            <TextField label="Name" value={f.name} onChange={f.setName} placeholder="Your name" />
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
              onClick={f.handleRegister}
              icon={<UserPlus className="h-4 w-4" />}
            >
              Create account
            </SubmitButton>
            <p className="text-muted-foreground text-center text-xs">
              We&apos;ll text a 6-digit code to verify your number.
            </p>
            <GoogleButton />
          </div>
        )}

        {f.mode === "otp" && (
          <div className="space-y-4">
            <div className="bg-muted/60 rounded-2xl p-3 text-center">
              <div className="text-muted-foreground text-xs">Verification code sent to</div>
              <div className="font-semibold">{f.fullPhone}</div>
            </div>
            <OtpInput code={f.code} setCode={f.setCode} inputRef={f.otpRef} />
            <SubmitButton
              loading={f.loading}
              disabled={f.code.length !== 6}
              onClick={f.handleVerifyOtp}
              icon={<ShieldCheck className="h-4 w-4" />}
            >
              Verify & continue
            </SubmitButton>
            <ResendRow
              seconds={f.seconds}
              loading={f.loading}
              onResend={f.resend}
              onBack={() => f.switchMode("register")}
              backLabel="← Edit details"
            />
          </div>
        )}

        {f.mode === "forgot" && (
          <div className="space-y-4">
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
              onClick={f.handleForgot}
              icon={<KeyRound className="h-4 w-4" />}
            >
              Send reset code
              {!f.loading && <ArrowRight className="h-4 w-4" />}
            </SubmitButton>
            <button
              onClick={() => f.switchMode("login")}
              className="text-muted-foreground hover:text-foreground w-full text-center text-xs font-semibold"
            >
              ← Back to sign in
            </button>
          </div>
        )}

        {f.mode === "reset" && (
          <div className="space-y-4">
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
            <SubmitButton
              loading={f.loading}
              onClick={f.handleReset}
              icon={<Lock className="h-4 w-4" />}
            >
              Reset password
            </SubmitButton>
            <ResendRow
              seconds={f.seconds}
              loading={f.loading}
              onResend={f.resend}
              onBack={() => f.switchMode("login")}
              backLabel="← Back to sign in"
            />
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
      <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
        {backLabel}
      </button>
      <button
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
