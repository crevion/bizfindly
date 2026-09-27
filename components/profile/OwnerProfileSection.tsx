"use client";

import { useEffect, useRef, useState } from "react";
import { Save, UserCog } from "lucide-react";
import { ownerApi, type OwnerProfile } from "@/lib/backend/owner";
import { useAuthStore } from "@/lib/backend/auth";
import { FormFeedback, SubmitButton, TextField } from "@/components/auth/fields";

export function OwnerProfileSection() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    ownerApi
      .getProfile()
      .then((p) => {
        if (!active) return;
        setProfile(p);
        setName(p.name ?? "");
        setEmail(p.email ?? "");
        setBio(p.bio ?? "");
        setAvatarPreview(p.avatar ?? null);
      })
      .catch(() => {
        if (active) setUnavailable(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const pickAvatar = (file: File | null) => {
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    setError(null);
    setInfo(null);
    setSaving(true);
    try {
      let updated: OwnerProfile;
      if (avatarFile) {
        const form = new FormData();
        form.append("name", name);
        form.append("email", email);
        form.append("bio", bio);
        form.append("avatar", avatarFile);
        updated = await ownerApi.updateProfile(form);
      } else {
        updated = await ownerApi.updateProfile({ name, email, bio });
      }
      setProfile(updated);
      setAvatarFile(null);
      if (updated.avatar) setAvatarPreview(updated.avatar);
      setInfo("Profile updated.");
      if (user) {
        setUser({
          ...user,
          name: updated.name || user.name,
          email: updated.email || user.email,
          avatar: updated.avatar || user.avatar,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (unavailable) return null;

  const initial = (name || profile?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="bg-card shadow-soft mt-6 rounded-3xl p-6">
      <div className="flex items-center gap-2">
        <UserCog className="text-brand h-5 w-5" />
        <h2 className="font-display text-lg font-bold">Owner profile</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Manage the details shown on your business listings.
      </p>

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted h-12 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-xl font-bold">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickAvatar(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="border-border hover:bg-muted rounded-full border px-4 py-2 text-xs font-semibold"
              >
                Change avatar
              </button>
            </div>
          </div>

          <TextField label="Name" value={name} onChange={setName} placeholder="Your name" />
          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="you@example.com"
          />
          <div>
            <label className="text-muted-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell guests a little about you."
              className="border-border bg-background focus:border-foreground/40 w-full rounded-2xl border px-4 py-3 text-base font-medium focus:outline-none"
            />
          </div>

          <SubmitButton loading={saving} onClick={save} icon={<Save className="h-4 w-4" />}>
            Save profile
          </SubmitButton>
          <FormFeedback error={error} info={info} />
        </div>
      )}
    </div>
  );
}
