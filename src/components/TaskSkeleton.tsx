export default function TaskSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[80, 60, 72, 50, 66].map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3"
        >
          <div className="h-5 w-5 rounded-full bg-muted shrink-0" />
          <div className="h-3 rounded-full bg-muted" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}
