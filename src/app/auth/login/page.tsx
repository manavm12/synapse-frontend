"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/inbox");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors">
            ✦ Synapse
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/35">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg bg-white/[0.05] px-4 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none focus:ring-1 focus:ring-white/20"
          />
          {error && <p className="text-xs text-red-400/80">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-white/10 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/15 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-white/30">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-white/55 hover:text-white/80 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
