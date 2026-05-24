export default function TaskSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[80, 60, 72, 50, 66].map((w, i) => (
        <div
          key={i}
          className="bg-card border-border flex items-center gap-3 rounded-xl border px-4 py-3"
        >
          <div className="bg-muted h-5 w-5 shrink-0 rounded-full" />
          <div className="bg-muted h-3 rounded-full" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}
