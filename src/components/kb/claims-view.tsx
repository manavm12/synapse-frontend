import type { Claim, Topic } from "@/lib/types";

interface ClaimsViewProps {
  topic: Topic | null;
  claims: Claim[];
  loading: boolean;
}

const SCOPE_LABELS: Record<string, string> = {
  private: "private",
  relationship: "shared",
  public: "public",
};

const SOURCE_LABELS: Record<string, string> = {
  extracted: "auto",
  manual: "manual",
};

export function ClaimsView({ topic, claims, loading }: ClaimsViewProps) {
  if (!topic) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-xs text-white/20">Select a topic to view claims</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-12 items-center border-b border-white/[0.06] px-6">
        <span className="text-sm font-medium text-white/70">{topic.name}</span>
      </div>

      {/* Claims list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading && <p className="text-xs text-white/25">Loading claims...</p>}

        {!loading && claims.length === 0 && (
          <p className="text-xs text-white/25">No claims in this topic yet</p>
        )}

        <div className="flex flex-col gap-2">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-lg border border-white/[0.06] px-4 py-3"
              style={{ background: "#181818" }}
            >
              <p className="text-sm text-white/70 leading-relaxed">{claim.content}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/20">
                  {SCOPE_LABELS[claim.scope]}
                </span>
                <span className="text-[10px] text-white/15">·</span>
                <span className="text-[10px] text-white/20">
                  {SOURCE_LABELS[claim.source_type]}
                </span>
                {claim._trust === "untrusted_external" && (
                  <>
                    <span className="text-[10px] text-white/15">·</span>
                    <span className="text-[10px] text-amber-400/50">from agent</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
