export interface Agent {
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

// A "DM conversation" — all threads grouped by the other participant
export interface DMConversation {
  partner: string;
  threads: Thread[];
  lastActivity: string;
}
