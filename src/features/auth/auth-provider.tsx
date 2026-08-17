"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type LearnerProfile = {
  id: string;
  owner_id: string;
  nickname: string;
  avatar_key: string | null;
};

type AuthContextValue = {
  user: User | null;
  profiles: LearnerProfile[];
  activeProfile: LearnerProfile | null;
  isLoading: boolean;
  error: string | null;
  magicLinkSent: boolean;
  sendMagicLink: (email: string) => Promise<void>;
  selectProfile: (profile: LearnerProfile) => void;
  clearProfile: () => void;
  createProfile: (nickname: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = Boolean(getSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [profiles, setProfiles] = useState<LearnerProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<LearnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(isConfigured);
  const [error, setError] = useState<string | null>(
    isConfigured ? null : "Ứng dụng chưa được cấu hình kết nối Supabase.",
  );
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const loadProfiles = useCallback(async (userId: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsLoading(true);
    const { data, error: queryError } = await supabase
      .from("learner_profiles")
      .select("id, owner_id, nickname, avatar_key")
      .eq("owner_id", userId)
      .order("created_at");

    if (queryError) {
      setError("Không thể tải hồ sơ học sinh. Vui lòng thử lại.");
      setProfiles([]);
      setActiveProfile(null);
    } else {
      const nextProfiles = (data ?? []) as LearnerProfile[];
      setProfiles(nextProfiles);
      setActiveProfile((current) => {
        const rememberedId = window.localStorage.getItem(`eqm:v1:profile:${userId}`);
        return (
          nextProfiles.find((profile) => profile.id === current?.id) ??
          nextProfiles.find((profile) => profile.id === rememberedId) ??
          (nextProfiles.length === 1 ? nextProfiles[0] : null)
        );
      });
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) void loadProfiles(data.session.user.id);
      else setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) void loadProfiles(nextSession.user.id);
      else {
        setProfiles([]);
        setActiveProfile(null);
        setIsLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfiles]);

  const sendMagicLink = async (email: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setError(null);
    setMagicLinkSent(false);
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    if (signInError) {
      setError("Không thể gửi magic link. Hãy kiểm tra email và thử lại.");
      return;
    }
    setMagicLinkSent(true);
  };

  const selectProfile = (profile: LearnerProfile) => {
    if (session?.user) window.localStorage.setItem(`eqm:v1:profile:${session.user.id}`, profile.id);
    setActiveProfile(profile);
  };

  const clearProfile = () => {
    if (session?.user) window.localStorage.removeItem(`eqm:v1:profile:${session.user.id}`);
    setActiveProfile(null);
  };

  const createProfile = async (nickname: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !session?.user) return;
    setError(null);
    const { data, error: insertError } = await supabase
      .from("learner_profiles")
      .insert({ owner_id: session.user.id, nickname: nickname.trim() })
      .select("id, owner_id, nickname, avatar_key")
      .single();

    if (insertError) {
      setError("Không thể tạo hồ sơ. Hãy dùng biệt danh ngắn và không nhập tên thật của trẻ.");
      return;
    }

    const profile = data as LearnerProfile;
    setProfiles((current) => [...current, profile]);
    selectProfile(profile);
  };

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const value = {
    user: session?.user ?? null,
    profiles,
    activeProfile,
    isLoading,
    error,
    magicLinkSent,
    sendMagicLink,
    selectProfile,
    clearProfile,
    createProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
