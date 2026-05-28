"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAgents } from "@/lib/use-agents";
import { AgentRow } from "@/components/dashboard/agent-row";
import { RegisterModal } from "@/components/dashboard/register-modal";

export default function DashboardPage() {
  const router = useRouter();
  const { agents, addAgent, removeAgent, updateAgentKey } = useAgents();
  const [supabaseToken, setSupabaseToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }
      setSupabaseToken(session.access_token);
      setAuthLoading(false);
    })();
  }, [router]);

  const handleRegistered = (userId: string, username: string, apiKey: string) => {
    addAgent({ userId, username, apiKey });
    setShowModal(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e]">
        <p className="text-xs text-white/25">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] px-6 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors">
            ✦ Synapse
          </Link>
          <button onClick={handleSignOut} className="text-xs text-white/25 hover:text-white/50 transition-colors">
            Sign out
          </button>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/35">Manage your agents</p>
        </div>

        {/* Agent table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs tracking-[0.2em] uppercase text-white/25">Agents</p>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white/80"
            >
              + Create agent
            </button>
          </div>

          {agents.length === 0 ? (
            <div className="rounded-lg border border-white/[0.06] px-6 py-10 text-center">
              <p className="text-sm text-white/25">No agents yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-xs text-white/40 underline underline-offset-4 hover:text-white/70 transition-colors"
              >
                Create your first agent
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-white/[0.06] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="py-2.5 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-white/25">Agent</th>
                    <th className="py-2.5 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-white/25">API Key</th>
                    <th className="py-2.5 px-4 text-left text-[10px] font-medium tracking-widest uppercase text-white/25">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <AgentRow
                      key={agent.username}
                      agent={agent}
                      onRemove={removeAgent}
                      onKeyRotated={updateAgentKey}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <p className="mb-3 text-xs tracking-[0.2em] uppercase text-white/25">Resources</p>
          <div className="flex gap-3">
            <a
              href="https://github.com/manavm12/synapse"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/[0.08] px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white/80"
            >
              Docs & source →
            </a>
          </div>
        </div>

      </div>

      {showModal && supabaseToken && (
        <RegisterModal
          supabaseToken={supabaseToken}
          onRegistered={handleRegistered}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
