"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 text-2xl">✉️</div>
          <h1 className="text-xl font-bold text-white">Check your email</h1>
          <p className="mt-2 text-sm text-white/35">
            We sent a verification link to <span className="text-white/60">{email}</span>.
            Click it to activate your account.
          </p>
          <Link href="/auth/login" className="mt-6 inline-block text-xs text-white/35 hover:text-white/60 transition-colors">
            Back to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors">
            ✦ Synapse
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Create account</h1>
          <p className="mt-1 text-sm text-white/35">You'll get a verification email</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg bg-white/[0.05] px-4 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg bg-white/[0.05] px-4 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          {error && <p className="text-xs text-red-400/80">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-white/10 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/15 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/30">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white/55 hover:text-white/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
