export type AgentMessage = {
  id: string;
  source: string;
  title: string | null;
  body: string;
  metadata: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
};
