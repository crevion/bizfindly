"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/content/countries";
import { useAuthStore } from "./store";

export type AuthMode = "login" | "register" | "otp" | "forgot" | "reset";

const RESEND_SECONDS = 45;

export function useAuthForm(onSuccess?: () => void) {
  const register = useAuthStore((s) => s.register);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const login = useAuthStore((s) => s.login);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [mode, setMode] = useState<AuthMode>("login");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [code, setCode] = useState("");

  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const fullPhone = `${country.code}${phone.replace(/\D/g, "")}`;

  const goTo = useCallback((next: AuthMode) => {
    setMode(next);
    setError(null);
  }, []);

  const phoneValid = phone.replace(/\D/g, "").length >= 7;

  const focusOtp = () => setTimeout(() => otpRef.current?.focus(), 50);

  const handleLogin = async () => {
    setError(null);
    setInfo(null);
    if (!phoneValid) return setError("Enter a valid phone number");
    if (!password) return setError("Enter your password");
    setLoading(true);
    try {
      await login(fullPhone, password);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setInfo(null);
    if (!phoneValid) return setError("Enter a valid phone number");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== passwordConfirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const message = await register({
        phone: fullPhone,
        name: name.trim(),
        password,
        password_confirm: passwordConfirm,
      });
      setInfo(message);
      setCode("");
      goTo("otp");
      setSeconds(RESEND_SECONDS);
      focusOtp();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create your account");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (code.length !== 6) return setError("Enter the 6-digit code");
    setLoading(true);
    try {
      await verifyOtp(fullPhone, code, name.trim());
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError(null);
    setInfo(null);
    if (!phoneValid) return setError("Enter a valid phone number");
    setLoading(true);
    try {
      const message = await forgotPassword(fullPhone);
      setInfo(message);
      setCode("");
      setPassword("");
      setPasswordConfirm("");
      goTo("reset");
      setSeconds(RESEND_SECONDS);
      focusOtp();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError(null);
    if (code.length !== 6) return setError("Enter the 6-digit code");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== passwordConfirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const message = await resetPassword({
        phone: fullPhone,
        code,
        password,
        password_confirm: passwordConfirm,
      });
      setPassword("");
      setPasswordConfirm("");
      setCode("");
      goTo("login");
      setInfo(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (seconds > 0 || loading) return;
    setError(null);
    setLoading(true);
    try {
      if (mode === "otp") {
        await register({
          phone: fullPhone,
          name: name.trim(),
          password,
          password_confirm: passwordConfirm,
        });
      } else if (mode === "reset") {
        await forgotPassword(fullPhone);
      }
      setSeconds(RESEND_SECONDS);
      setCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not resend the code");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setPassword("");
    setPasswordConfirm("");
    setCode("");
    setInfo(null);
    goTo(next);
  };

  return {
    mode,
    switchMode,
    goTo,
    country,
    setCountry,
    phone,
    setPhone,
    name,
    setName,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    code,
    setCode,
    seconds,
    loading,
    error,
    info,
    otpRef,
    fullPhone,
    handleLogin,
    handleRegister,
    handleVerifyOtp,
    handleForgot,
    handleReset,
    resend,
  };
}
