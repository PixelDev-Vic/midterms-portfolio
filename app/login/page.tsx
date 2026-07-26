"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";

function LoginForm() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const from = searchParams.get("from") ?? "/admin";
      router.replace(from);
    }
  }, [status, router, searchParams]);

  // Show error from NextAuth callback (e.g. AccessDenied)
  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError === "AccessDenied") {
      setError("Access denied. This Google account is not authorised to access the admin area.");
    }
  }, [searchParams]);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    await signIn("google", {
      callbackUrl: searchParams.get("from") ?? "/admin",
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient gradient */}
      <div className="mesh-gradient" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="card p-10 flex flex-col items-center text-center gap-7">
          {/* Brand mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold tracking-tight"
            style={{ background: "rgba(41,151,255,0.12)", color: "var(--accent)" }}
          >
            JV
          </motion.div>

          {/* Heading */}
          <div>
            <p className="section-label mb-2">Admin Access</p>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.025em" }}
            >
              Studio Login
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Sign in with your authorised Google account to access the studio backend.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm px-4 py-3 rounded-xl w-full text-left"
              style={{
                background: "rgba(255,45,85,0.08)",
                color: "#FF2D55",
                border: "1px solid rgba(255,45,85,0.2)",
              }}
            >
              {error}
            </motion.p>
          )}

          {/* Google Sign-in Button */}
          <motion.button
            onClick={handleSignIn}
            disabled={loading || status === "loading"}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-medium text-sm transition-all"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-strong)",
              color: "var(--text-primary)",
              cursor: loading || status === "loading" ? "not-allowed" : "pointer",
              opacity: loading || status === "loading" ? 0.65 : 1,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {loading || status === "loading" ? (
              <span
                className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
              />
            ) : (
              /* Google logo SVG */
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? "Signing in…" : "Continue with Google"}
          </motion.button>

          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Only authorised accounts can access this area.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
