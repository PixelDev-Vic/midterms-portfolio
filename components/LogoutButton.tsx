"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-transform active:scale-95"
      style={{
        background: "transparent",
        color: "var(--text-secondary)",
        border: "1px solid var(--border, rgba(255,255,255,0.15))",
      }}
    >
      Sign out
    </button>
  );
}
