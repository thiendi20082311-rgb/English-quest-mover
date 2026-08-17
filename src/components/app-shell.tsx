"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AuthGate } from "@/features/auth/auth-gate";
import { useAuth } from "@/features/auth/auth-provider";
import { useProgress } from "@/features/progress/progress-provider";

export function AppShell({ children }: { children: ReactNode }) {
  const { points } = useProgress();
  const { activeProfile, clearProfile } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" href="/" aria-label="Về trang chủ English Quest Movers">
            <span className="brand__mark" aria-hidden="true">EQ</span>
            <span className="brand__text">English Quest Movers</span>
          </Link>
          <div className="header-actions">
            {activeProfile && (
              <button className="header-profile" type="button" onClick={clearProfile}>
                {activeProfile.nickname} · Đổi
              </button>
            )}
            <div className="header-points" aria-label={`${points} điểm`}>
              <span aria-hidden="true">★</span>
              <span>{points} points</span>
            </div>
          </div>
        </div>
      </header>
      <AuthGate>{children}</AuthGate>
    </div>
  );
}
