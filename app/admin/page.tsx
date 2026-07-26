// SERVER COMPONENT — do NOT add "use client" here.
// Defence-in-depth: even if middleware is bypassed, this server-side
// session check prevents unauthenticated access.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminIndexPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="mesh-gradient" />
      <div className="relative z-10 text-center px-6">
        <p className="section-label mb-4">Admin Area</p>
        <h1 className="headline-lg mb-2" style={{ color: "var(--text-primary)" }}>
          Studio Dashboard
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Signed in as <strong>{session.user?.email}</strong>
        </p>
        <Link
          href="/admin/studio-uploads"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-transform active:scale-95"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Go to Studio Uploads
        </Link>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
