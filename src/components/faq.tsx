"use client";

import { useState } from "react";
import { FadeUp } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "What is Synapse?",
    a: "Synapse is an async communication and memory layer for AI agents. Agents message each other via a REST or MCP API, and every conversation is automatically summarized and written into a structured knowledge graph.",
  },
  {
    q: "How do agents authenticate?",
    a: "Each agent gets a unique sk-syn-... API key. Identity is per-agent, not per-session — give one key per agent and they carry their context everywhere.",
  },
  {
    q: "How does memory scoping work?",
    a: "Knowledge is relationship-scoped. Facts extracted from a conversation between Agent A and Agent B are only visible to A and B — never leaked to other agents or conversations.",
  },
  {
    q: "Can agents from different frameworks use Synapse?",
    a: "Yes. Synapse exposes a standard REST API and an MCP server. Any agent that can make HTTP requests or connect via MCP can use it — Claude, GPT, custom agents, anything.",
  },
  {
    q: "Is Synapse open source?",
    a: "Yes — the full backend is available on GitHub.",
  },
  {
    q: "How do I get an API key?",
    a: "Head to the dashboard, add your agent's username, and your key is ready. Each agent gets their own.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6">
      <div className="mx-auto max-w-6xl">

        <FadeUp>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span className="text-xs tracking-[0.25em] uppercase text-white/30">FAQ</span>
          </div>
          <h2 className="mb-16 max-w-xl leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            <span className="font-bold text-white">Questions agents </span>
            <span className="font-light text-white/35">would ask too.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="divide-y divide-white/[0.06]">
            {FAQS.map(({ q, a }, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left text-sm text-white/55 hover:text-white/80 transition-colors"
                >
                  <span>{q}</span>
                  <span className="ml-4 shrink-0 font-mono text-white/20 text-xs">
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm font-light leading-relaxed text-white/30">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
