"use client";

import type { Topic } from "@/lib/types";

interface TopicTreeProps {
  topics: Topic[];
  selectedId: string | null;
  onSelect: (topic: Topic) => void;
  depth?: number;
}

export function TopicTree({ topics, selectedId, onSelect, depth = 0 }: TopicTreeProps) {
  if (topics.length === 0) return null;

  return (
    <ul className={depth === 0 ? "" : "ml-3 border-l border-white/[0.06] pl-3"}>
      {topics.map((topic) => (
        <li key={topic.id}>
          <button
            onClick={() => onSelect(topic)}
            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
              selectedId === topic.id
                ? "bg-white/[0.08] text-white/80"
                : "text-white/40 hover:text-white/65 hover:bg-white/[0.03]"
            }`}
          >
            {depth > 0 && <span className="text-white/20 mr-1">∟</span>}
            {topic.name}
          </button>
          {topic.children && topic.children.length > 0 && (
            <TopicTree
              topics={topic.children}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
