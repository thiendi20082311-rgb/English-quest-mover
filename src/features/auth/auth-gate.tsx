"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/features/auth/auth-provider";

export function AuthGate({ children }: { children: ReactNode }) {
  const {
    user,
    profiles,
    activeProfile,
    isLoading,
    error,
    magicLinkSent,
    sendMagicLink,
    selectProfile,
    createProfile,
    signOut,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await sendMagicLink(email);
    setSubmitting(false);
  };

  const submitProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!nickname.trim()) return;
    setSubmitting(true);
    await createProfile(nickname);
    setSubmitting(false);
  };

  if (isLoading) {
    return <main className="auth-page"><p className="auth-status">Đang tải dữ liệu học tập…</p></main>;
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Parent sign in</p>
          <h1>Đăng nhập để lưu tiến trình</h1>
          <p>Nhập email của phụ huynh. Chúng tôi sẽ gửi một liên kết đăng nhập, không cần mật khẩu.</p>
          <form onSubmit={submitEmail} className="auth-form">
            <label htmlFor="parent-email">Email phụ huynh</label>
            <input
              id="parent-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="parent@example.com"
              autoComplete="email"
              required
            />
            <button className="button button--primary" type="submit" disabled={submitting}>
              {submitting ? "Đang gửi…" : "Gửi magic link"}
            </button>
          </form>
          {magicLinkSent && <p className="notice notice--success">Đã gửi! Hãy mở email và bấm liên kết để đăng nhập.</p>}
          {error && <p className="notice notice--error">{error}</p>}
        </section>
      </main>
    );
  }

  if (!activeProfile) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Learner profile</p>
          <h1>Chọn hồ sơ học sinh</h1>
          <p>Chỉ sử dụng biệt danh, không nhập tên thật hoặc thông tin cá nhân của trẻ.</p>
          {profiles.length > 0 && (
            <div className="profile-list" aria-label="Danh sách hồ sơ học sinh">
              {profiles.map((profile) => (
                <button key={profile.id} className="profile-option" type="button" onClick={() => selectProfile(profile)}>
                  <span aria-hidden="true">★</span>
                  {profile.nickname}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={submitProfile} className="auth-form auth-form--profile">
            <label htmlFor="learner-nickname">Tạo hồ sơ bằng biệt danh</label>
            <input
              id="learner-nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Ví dụ: Blue Kite"
              minLength={2}
              maxLength={30}
              required
            />
            <button className="button button--primary" type="submit" disabled={submitting}>
              {submitting ? "Đang tạo…" : "Tạo hồ sơ"}
            </button>
          </form>
          {error && <p className="notice notice--error">{error}</p>}
          <button className="sign-out auth-sign-out" type="button" onClick={() => void signOut()}>
            Đăng xuất tài khoản phụ huynh
          </button>
        </section>
      </main>
    );
  }

  return children;
}
