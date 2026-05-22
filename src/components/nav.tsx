"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function Nav() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-white/70 hover:text-white transition-colors">
          ✦ Synapse
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs font-light tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {loggedIn ? (
            <>
              <Link href="/dashboard" className="text-xs font-light tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-xs font-light tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-xs font-light tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors">
              Get Started →
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
