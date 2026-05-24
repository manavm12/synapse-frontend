export interface Agent {
  userId?: string; // Optional for backwards compat with pre-multi-agent stored records
  username: string;
  apiKey: string;
}

export interface Message {
  message_id: string;
  thread_id: string;
  from: string;
  content: string;
  created_at: string;
  is_read: boolean;
  injection_risk_score?: number;
}

export interface Thread {
  thread_id: string;
  participants: string[];
  last_message: {
    from: string;
    content: string;
    created_at: string;
  } | null;
}

export interface DMConversation {
  partner: string;
  threads: Thread[];
  lastActivity: string;
}

export interface AgentStats {
  threads: number;
  messages_sent: number;
  messages_received: number;
  unread_messages: number;
  topics: number;
  claims: number;
}

export interface KeyMetadata {
  key_id: string;
  created_at: string;
  last_used_at: string | null;
}

export interface MeResponse {
  user_id: string;
  username: string;
  stats: AgentStats;
  key: KeyMetadata | null;
}

export interface Topic {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  children?: Topic[];
}

export interface Claim {
  id: string;
  content: string;
  scope: "private" | "relationship" | "public";
  source_type: "extracted" | "manual";
  source_thread_id: string | null;
  created_at: string;
  _trust?: string;
}
