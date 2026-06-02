"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/backend/auth";
import { FormFeedback, PasswordField, SubmitButton } from "./fields";

export function ChangePasswordForm() {
  const router = useRouter();
  const changePassword = useAuthStore((s) => s.changePassword);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setInfo(null);
    if (!oldPassword) return setError("Enter your current password");
    if (password.length < 8) return setError("New password must be at least 8 characters");
    if (password !== passwordConfirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const message = await changePassword({
        old_password: oldPassword,
        password,
        password_confirm: passwordConfirm,
      });
      setInfo(message);
      setOldPassword("");
      setPassword("");
      setPasswordConfirm("");
      setTimeout(() => router.replace("/join"), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card shadow-soft mt-6 rounded-3xl p-6">
      <h2 className="font-display text-lg font-bold">Change password</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        You&apos;ll be signed out and need to log in again with your new password.
      </p>
      <div className="mt-4 space-y-4">
        <PasswordField
          label="Current password"
          value={oldPassword}
          onChange={setOldPassword}
          autoComplete="current-password"
        />
        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm new password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          autoComplete="new-password"
        />
        <SubmitButton loading={loading} onClick={submit} icon={<KeyRound className="h-4 w-4" />}>
          Update password
        </SubmitButton>
        <FormFeedback error={error} info={info} />
      </div>
    </div>
  );
}
