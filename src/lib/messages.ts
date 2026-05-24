export type AgentMessage = {
  id: string;
  source: string;
  title: string | null;
  body: string;
  metadata: Record<string, unknown> | null;
  read: boolean;
  created_at: string;
};

/**
 * Strip Markdown syntax for collapsed previews — keeps the prose
 * readable in a 2-line truncated card without showing **bold** markers.
 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[*+-]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}
